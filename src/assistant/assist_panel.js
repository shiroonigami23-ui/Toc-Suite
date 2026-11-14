// assist_panel.js — "Automata Assistant" for the FA studio.
//   Describe : English → exact minimal DFA (trained intent model + exact construction)
//   Guide me : same, but the DFA stays hidden; you draw it and get live, specific hints
//   Examples : accepted / rejected strings → smallest consistent DFA (RPNI)
//   Check    : compare the canvas with the target, with counterexamples and state-level hints
//   Tidy     : one-click auto-layout of the current diagram
// Everything runs locally in the browser; no network calls except loading the model file once.

import { MACHINE, setMachine, pushUndo } from '../fa/state.js';
import { renderAll } from '../fa/renderer.js';
import { updateUndoRedoButtons } from '../fa/ui.js';
import { addLogMessage, setValidationMessage } from '../shared/utils.js';
import * as FA from '../core/fa.js';
import { parseDescription } from '../core/nl.js';
import { learnDfa, parseExamples } from '../core/learn.js';
import { autoLayout } from '../core/layout.js';
import { diagnose } from '../core/diagnose.js';

let model = null;
let target = null;          // { dfa, label }
let liveTimer = null;
let lastSig = '';

async function loadModel() {
  if (model) return model;
  const res = await fetch(new URL('../core/nl-model.json', import.meta.url));
  if (!res.ok) throw new Error('Could not load the language model file.');
  model = await res.json();
  return model;
}

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (id) => document.getElementById(id);

// ------------------------------------------------------------------ canvas helpers

function applyMachine(machine, message) {
  pushUndo(updateUndoRedoButtons);
  const pos = autoLayout(machine);
  const laid = { ...machine, states: machine.states.map(s => ({ ...s, ...(pos[s.id] || {}) })) };
  setMachine(laid);
  const modeSelect = $('modeSelect');
  if (modeSelect && laid.type === 'DFA' && !modeSelect.value.startsWith('DFA')) modeSelect.value = 'DFA';
  renderAll();
  if (message) addLogMessage(message, 'sparkles');
}

export function tidyLayout() {
  if (!MACHINE.states?.length) { setValidationMessage('Nothing to arrange yet.', 'info'); return; }
  pushUndo(updateUndoRedoButtons);
  const pos = autoLayout(MACHINE);
  MACHINE.states.forEach(s => { if (pos[s.id]) Object.assign(s, pos[s.id]); });
  renderAll();
  highlight(currentHighlights);
  addLogMessage('Auto-layout applied: layered from the start state, trap state at the bottom.', 'layout-grid');
}

let currentHighlights = [];
function highlight(ids, word) {
  currentHighlights = ids || [];
  document.querySelectorAll('#states g[data-id]').forEach(g => {
    g.classList.toggle('assist-bad', currentHighlights.includes(g.getAttribute('data-id')));
  });
  if (word !== undefined && $('testInput')) $('testInput').value = word === 'ε' ? '' : word;
}

// ------------------------------------------------------------------ rendering of results

function renderHints(result, box) {
  if (!box) return;
  const icon = { error: '✗', warn: '!', info: '•', success: '✓' };
  const pct = Math.round((result.progress || 0) * 100);
  box.innerHTML = `
    ${target ? `<div class="assist-target">Target: ${esc(target.label)}</div>` : ''}
    <div class="assist-progress"><span style="width:${result.correct ? 100 : pct}%"></span></div>
    <ul class="assist-hints">${result.hints.map((h, i) => `
      <li class="assist-${h.level}" data-i="${i}" title="${h.states ? 'Click to highlight on the canvas' : ''}">
        <b>${icon[h.level]}</b> <span>${esc(h.message)}</span>
        ${h.word !== undefined ? `<button class="assist-mini" data-word="${esc(h.word)}" data-i="${i}">Test "${esc(h.word)}"</button>` : ''}
      </li>`).join('')}</ul>`;
  box.querySelectorAll('li[data-i]').forEach(li => li.addEventListener('click', () => highlight(result.hints[+li.dataset.i].states, result.hints[+li.dataset.i].word)));
  box.querySelectorAll('button[data-word]').forEach(b => b.addEventListener('click', (e) => {
    e.stopPropagation();
    highlight(result.hints[+b.dataset.i].states, b.dataset.word);
    $('runTestBtn')?.click();
  }));
  const bad = result.hints.filter(h => h.level === 'error').flatMap(h => h.states || []);
  highlight([...new Set(bad)]);
}

function interpretationHtml(r) {
  const chips = r.clauses.map(c => {
    if (c.intent === 'FILLER') return `<span class="assist-chip muted" title="ignored">${esc(c.text)}</span>`;
    const conf = Math.round(c.confidence * 100);
    return `<span class="assist-chip" title="${c.inherited ? 'verb carried over from the previous clause' : `model confidence ${conf}%`}">${esc(c.text)} → <b>${esc(c.intent)}</b>${c.negated ? ' (negated)' : ''}${c.inherited ? ' ↩' : ` ${conf}%`}</span>`;
  }).join(' ');
  return `<div class="assist-chips">${chips}</div>`;
}

function samplesHtml(dfa) {
  const acc = FA.sampleWords(dfa, { limit: 6, maxLen: 7 }).map(w => w || 'ε');
  const rej = FA.sampleWords(dfa, { limit: 6, maxLen: 7, accepted: false }).map(w => w || 'ε');
  return `<div class="assist-samples"><div><b>Accepts</b> ${acc.map(w => `<code>${esc(w)}</code>`).join(' ') || '—'}</div>
    <div><b>Rejects</b> ${rej.map(w => `<code>${esc(w)}</code>`).join(' ') || '—'}</div></div>`;
}

// ------------------------------------------------------------------ actions

async function onDescribe(guided) {
  const text = $('assistDesc').value.trim();
  const out = $('assistDescOut');
  if (!text) { out.innerHTML = '<div class="assist-warn">Type a description first, e.g. “strings over {a,b} ending with ab”.</div>'; return; }
  out.innerHTML = '<div class="assist-muted">Thinking…</div>';
  let r;
  try { r = parseDescription(text, await loadModel()); } catch (e) { out.innerHTML = `<div class="assist-error">${esc(e.message)}</div>`; return; }
  if (!r.ok) {
    out.innerHTML = `${interpretationHtml(r)}<div class="assist-error">${r.problems.map(esc).join('<br>')}</div>`;
    return;
  }
  const states = r.dfa.delta.length;
  target = { dfa: r.dfa, label: text };
  out.innerHTML = `<div class="assist-ok">${esc(r.explanation)}</div>${interpretationHtml(r)}${samplesHtml(r.dfa)}
    ${r.problems.length ? `<div class="assist-warn">${r.problems.map(esc).join('<br>')}</div>` : ''}
    <div class="assist-muted">Minimal DFA: ${states} state${states > 1 ? 's' : ''} (incl. trap if any).</div>`;
  if (guided) startGuided(r);
  else {
    stopLive();
    const keepDead = $('assistTrap')?.checked ?? true;
    applyMachine(FA.toAppMachine(r.dfa, { keepDead, title: text }), `Built the minimal DFA for: ${text}`);
    setValidationMessage(`Built a ${states}-state DFA. Use “Check” after editing, or “Guide me” to draw it yourself.`, 'success');
  }
}

function startGuided(r) {
  const liveBox = $('assistLive');
  if (liveBox) liveBox.checked = true;
  pushUndo(updateUndoRedoButtons);
  setMachine({ type: 'DFA', title: target.label, alphabet: [...r.alphabet], states: [], transitions: [] });
  renderAll();
  openTab('check');
  setValidationMessage('Guided mode: draw the DFA on the canvas. Hints update as you go.', 'info');
  addLogMessage(`Guided mode started for: ${target.label}`, 'compass');
  startLive();
  runCheck('guided');
}

function onLearn() {
  const out = $('assistLearnOut');
  const { positive, negative } = parseExamples($('assistExamples').value);
  if (!positive.length && !negative.length) { out.innerHTML = '<div class="assist-warn">Add examples, one per line: <code>+ ab</code> for accepted, <code>- ba</code> for rejected.</div>'; return; }
  const sigmaText = $('assistSigma').value.trim();
  const sigma = sigmaText ? sigmaText.split(/[\s,{}]+/).filter(Boolean) : undefined;
  const r = learnDfa(positive, negative, sigma);
  if (!r.ok || !r.dfa) { out.innerHTML = `<div class="assist-error">${esc(r.error)}</div>`; return; }
  target = { dfa: r.dfa, label: `learned from ${positive.length}+ / ${negative.length}− examples` };
  out.innerHTML = `<div class="assist-ok">Learned a ${r.dfa.delta.length}-state DFA consistent with all ${positive.length + negative.length} examples.</div>
    ${samplesHtml(r.dfa)}<div class="assist-muted">Few examples can fit many languages: if a sample above looks wrong, add it as a counter-example and learn again.</div>`;
  applyMachine(FA.toAppMachine(r.dfa, { keepDead: $('assistTrap')?.checked ?? true, title: target.label }), `Learned a DFA from ${positive.length + negative.length} examples.`);
}

function practiceTarget() {
  const p = window.__CURRENT_FA_PRACTICE;
  if (p?.machine) return { dfa: FA.toMinimalDfa(p.machine, FA.machineAlphabet(p.machine)), label: `practice: ${String(p.q).replace(/<[^>]+>/g, '').slice(0, 80)}` };
  return null;
}

function runCheck(mode = 'final') {
  const box = $('assistCheckOut');
  const t = target || practiceTarget();
  if (!t) {
    // No target language: still report structural problems of the drawing.
    const issues = FA.structuralIssues({ ...MACHINE, type: MACHINE.type || 'DFA' });
    renderHints({ correct: false, progress: 0, hints: issues.length ? issues.map(i => ({ level: i.kind === 'missing' ? 'warn' : 'error', message: i.message, states: i.state ? [i.state] : undefined }))
      : [{ level: 'info', message: 'No target yet: describe a language, learn one from examples, or start a practice question to check against.' }] }, box);
    return;
  }
  const machine = { ...MACHINE, type: (MACHINE.type || 'DFA').replace(/_TO_.*/, '') };
  const r = diagnose(machine, t.dfa, { mode });
  renderHints(r, box);
  if (r.correct && mode === 'guided') {
    setValidationMessage('Correct! Your drawing matches the language exactly.', 'success');
    addLogMessage('Guided mode complete — correct automaton!', 'check-circle');
    stopLive();
    const liveBox = $('assistLive');
    if (liveBox) liveBox.checked = false;
  }
}

function signature() {
  return JSON.stringify([(MACHINE.states || []).map(s => [s.id, !!s.initial, !!s.accepting]), (MACHINE.transitions || []).map(t => [t.from, t.to, t.symbol])]);
}
function startLive() {
  stopLive();
  lastSig = '';
  liveTimer = setInterval(() => {
    const sig = signature();
    if (sig !== lastSig) { lastSig = sig; runCheck('guided'); }
  }, 600);
}
function stopLive() { if (liveTimer) clearInterval(liveTimer); liveTimer = null; }

function openTab(name) {
  document.querySelectorAll('#assistPanelRoot .assist-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('#assistPanelRoot .assist-pane').forEach(p => { p.hidden = p.dataset.pane !== name; });
}

// ------------------------------------------------------------------ mount

const EXAMPLES = [
  'strings over {a,b} ending with ab',
  'binary strings with no two consecutive 1s',
  'even number of a and odd number of b',
  'binary numbers divisible by 3',
  'strings that start and end with the same symbol',
  'the third symbol from the end is 1',
];

export function initAssistPanel() {
  const root = $('assistPanelRoot');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';
  root.innerHTML = `
    <div class="assist-top">
      <button id="assistTidyBtn" class="assist-btn" type="button" title="Arrange states neatly">✦ Tidy layout</button>
      <label class="assist-muted" title="Include the non-accepting trap state so every state has a move on every symbol"><input type="checkbox" id="assistTrap" checked> trap state</label>
    </div>
    <div class="assist-tabs">
      <button class="assist-tab active" data-tab="describe" type="button">Describe</button>
      <button class="assist-tab" data-tab="examples" type="button">Examples</button>
      <button class="assist-tab" data-tab="check" type="button">Check</button>
    </div>
    <div class="assist-pane" data-pane="describe">
      <textarea id="assistDesc" rows="3" placeholder="e.g. strings over {a,b} with an even number of a and ending in b"></textarea>
      <div class="assist-examples">${EXAMPLES.map(e => `<button class="assist-mini" type="button" data-ex="${esc(e)}">${esc(e)}</button>`).join('')}</div>
      <div class="assist-row">
        <button id="assistBuildBtn" class="assist-btn primary" type="button">Build DFA</button>
        <button id="assistGuideBtn" class="assist-btn" type="button" title="Keep the answer hidden: you draw, the assistant points out mistakes">Guide me</button>
      </div>
      <div id="assistDescOut"></div>
    </div>
    <div class="assist-pane" data-pane="examples" hidden>
      <textarea id="assistExamples" rows="5" placeholder="+ ab&#10;+ aab&#10;- ba&#10;- b&#10;+ ε"></textarea>
      <input id="assistSigma" placeholder="Alphabet (optional), e.g. a,b">
      <button id="assistLearnBtn" class="assist-btn primary" type="button">Learn DFA from examples</button>
      <div id="assistLearnOut"></div>
    </div>
    <div class="assist-pane" data-pane="check" hidden>
      <div class="assist-row">
        <button id="assistCheckBtn" class="assist-btn primary" type="button">Check my automaton</button>
        <label class="assist-muted"><input type="checkbox" id="assistLive"> live hints</label>
      </div>
      <div id="assistCheckOut" class="assist-muted">Describe a language, learn one from examples, or open a practice question — then draw and check.</div>
    </div>`;
  root.querySelectorAll('.assist-tab').forEach(b => b.addEventListener('click', () => openTab(b.dataset.tab)));
  root.querySelectorAll('[data-ex]').forEach(b => b.addEventListener('click', () => { $('assistDesc').value = b.dataset.ex; }));
  $('assistTidyBtn').addEventListener('click', tidyLayout);
  $('assistBuildBtn').addEventListener('click', () => onDescribe(false));
  $('assistGuideBtn').addEventListener('click', () => onDescribe(true));
  $('assistLearnBtn').addEventListener('click', onLearn);
  $('assistCheckBtn').addEventListener('click', () => runCheck('final'));
  $('assistLive').addEventListener('change', (e) => (e.target.checked ? startLive() : stopLive()));
  $('assistDesc').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onDescribe(false); });
  // The 155 KB model is fetched on first use (Build / Guide / Check), or when the browser is idle.
  const warm = () => loadModel().catch(() => {});
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(warm, { timeout: 8000 }); else setTimeout(warm, 4000);
}

// Exposed for the practice checker and for debugging in the console.
window.TocAssist = { diagnose, parseDescription: async (t) => parseDescription(t, await loadModel()), learnDfa, autoLayout, FA };
