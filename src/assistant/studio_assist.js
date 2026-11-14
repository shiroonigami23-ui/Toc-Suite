// assistant/studio_assist.js — the Automata Assistant side panel for the Mealy/Moore, PDA and TM
// studios (the FA studio has its own, richer panel).
//
//   Describe → Build & draw: the Automata Builder, rendered inline (switches studio if needed)
//   Describe → Guide me:     keep the built machine hidden as a target; you draw, then Check
//   Check:                   run your drawing against the target on every short input and show the
//                            first input where they differ (acceptance, output or final tape)

import { buildFromText, KIND_NAME, ROUTE } from '../core/build/index.js';
import { pdaAccepts, tmRun, transduce, allWords, lengthFor } from '../core/build/sim.js';
import { loadModel, context, resultHtml, studioMachine, EXAMPLES, STUDIO_NAME } from './builder_ui.js';
import { refreshLucideIcons, addLogMessage } from '../shared/utils.js';
import { MACHINE as MM_MACHINE } from '../mm/moore_mealy_state.js';
import { MACHINE as PDA_MACHINE } from '../pda/pda_state.js';
import { MACHINE as TM_MACHINE } from '../tm/tm_state.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const targets = {};          // route → last builder result used as the target

const HELP = {
  mm: 'Describe a Moore or Mealy machine: an output rule (“output 1 when the input so far ends with 101”), a detector, a remainder, or a task such as 2’s complement.',
  pda: 'Describe a context-free language: aⁿbⁿ-style notation, counts (“more a’s than b’s”), palindromes, brackets — or name another machine to switch studio.',
  tm: 'Describe a language (aⁿbⁿcⁿ, ww, palindromes, counts) or a task (increment, unary addition, doubling). Regular and context-free languages work too.',
};

function currentMachine(route) {
  return route === 'mm' ? MM_MACHINE : route === 'pda' ? PDA_MACHINE : TM_MACHINE;
}

/** Find (or create) the panel's host in the current studio's side bar. */
function host(route) {
  const panel = document.getElementById('controlPanel');
  if (!panel) return null;
  let root = document.getElementById('studioAssistRoot');
  if (!root) {
    const sec = document.createElement('details');
    sec.className = 'control-section';
    sec.id = 'studioAssistSection';
    sec.open = true;
    sec.innerHTML = '<summary><i data-lucide="sparkles" style="color: #8b5cf6;"></i> <span>Automata Assistant</span></summary><div class="control-section-content" id="studioAssistRoot"></div>';
    const first = panel.querySelector(':scope > details');
    if (first?.nextSibling) panel.insertBefore(sec, first.nextSibling); else panel.appendChild(sec);
    root = sec.querySelector('#studioAssistRoot');
  }
  return root;
}

export function mountStudioAssist(route) {
  const root = host(route);
  if (!root || root.dataset.ready === route) return;
  root.dataset.ready = route;
  const ex = EXAMPLES[route] || [];
  root.innerHTML = `
    <div class="assist-tabs">
      <button class="assist-tab active" data-tab="describe" type="button">Describe</button>
      <button class="assist-tab" data-tab="check" type="button">Check</button>
    </div>
    <div class="assist-pane" data-pane="describe">
      <div class="assist-muted">${esc(HELP[route])}</div>
      <textarea class="sa-desc" rows="3" placeholder="${esc(ex[0] || '')}"></textarea>
      <div class="assist-examples">${ex.map(e => `<button class="assist-mini" type="button" data-ex="${esc(e)}">${esc(e)}</button>`).join('')}</div>
      <div class="assist-row">
        <button class="assist-btn primary sa-build" type="button">Build &amp; draw</button>
        <button class="assist-btn sa-guide" type="button" title="Keep the answer hidden: you draw it, then press Check">Guide me</button>
      </div>
      <div class="sa-out"></div>
    </div>
    <div class="assist-pane" data-pane="check" hidden>
      <button class="assist-btn primary sa-check" type="button">Check my machine</button>
      <div class="sa-check-out assist-muted">Describe a target first (Build or Guide me), draw or edit your machine, then check it here.</div>
    </div>`;
  const $ = (sel) => root.querySelector(sel);
  root.querySelectorAll('.assist-tab').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('.assist-tab').forEach(x => x.classList.toggle('active', x === b));
    root.querySelectorAll('.assist-pane').forEach(p => { p.hidden = p.dataset.pane !== b.dataset.tab; });
  }));
  root.querySelectorAll('[data-ex]').forEach(b => b.addEventListener('click', () => { $('.sa-desc').value = b.dataset.ex.replace(/ \(watch.*\)$/, ''); }));
  $('.sa-build').addEventListener('click', () => describe(root, route, true));
  $('.sa-guide').addEventListener('click', () => describe(root, route, false));
  $('.sa-desc').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) describe(root, route, true); });
  $('.sa-check').addEventListener('click', () => check(root, route));
  if (targets[route]) $('.sa-check-out').innerHTML = `Target: <b>${esc(targets[route].language)}</b>`;
  refreshLucideIcons();
  loadModel().catch(() => {});
}

async function describe(root, route, draw) {
  const text = root.querySelector('.sa-desc').value.trim();
  const out = root.querySelector('.sa-out');
  if (!text) { out.innerHTML = '<div class="assist-warn">Describe a machine first.</div>'; return; }
  out.innerHTML = '<div class="assist-muted"><span class="tb-spin"></span> Reading, building and testing…</div>';
  await new Promise(r => setTimeout(r, 16));
  const ctx = context();
  let r;
  try { r = buildFromText(text, { model: await loadModel(), studio: ctx.studio, mode: ctx.mode }); } catch (e) { out.innerHTML = `<div class="assist-error">${esc(e.message)}</div>`; return; }
  if (!r.ok) { out.innerHTML = resultHtml(r, false); return; }
  if (!draw) {
    if (r.route !== route) {
      out.innerHTML = `<div class="assist-warn">That is a ${esc(KIND_NAME[r.kind])}, which belongs in the ${esc(STUDIO_NAME[r.route])}. Use <b>Build &amp; draw</b> to open it there, or describe a ${route === 'mm' ? 'Moore/Mealy machine' : route === 'pda' ? 'PDA' : 'Turing machine'}.</div>`;
      return;
    }
    targets[route] = r;
    out.innerHTML = `<div class="assist-ok"><b>Target set (hidden):</b> ${esc(r.language)}</div>
      <div class="assist-muted">Draw your ${esc(KIND_NAME[r.kind])} on the canvas, then open <b>Check</b>. ${r.samples ? `It should accept e.g. ${r.samples.accepted.slice(0, 3).map(w => `<code>${esc(w)}</code>`).join(' ')} and reject ${r.samples.rejected.slice(0, 3).map(w => `<code>${esc(w)}</code>`).join(' ')}.` : ''}${r.io ? `For example ${r.io.slice(0, 2).map(([a, b]) => `<code>${esc(a)}</code> → <code>${esc(b)}</code>`).join(', ')}.` : ''}</div>`;
    root.querySelector('.sa-check-out').innerHTML = `Target: <b>${esc(r.language)}</b>`;
    return;
  }
  targets[r.route] = r;
  out.innerHTML = resultHtml(r, false);
  await window.TocStudio.load(studioMachine(r), r.route);
  if (r.route === route) { out.innerHTML = resultHtml(r, true); refreshLucideIcons(); }
  try { addLogMessage(`Assistant: ${KIND_NAME[r.kind]} for “${text}” — verified.`, 'sparkles'); } catch { /* no log */ }
}

function check(root, route) {
  const out = root.querySelector('.sa-check-out');
  const t = targets[route];
  if (!t) { out.innerHTML = '<div class="assist-warn">Set a target first: describe it in the Describe tab and press <b>Guide me</b> (or Build).</div>'; return; }
  const mine = structuredClone(currentMachine(route) || {});
  if (!mine.states?.length || !mine.states.some(s => s.initial)) { out.innerHTML = '<div class="assist-warn">Your machine needs states and an initial state.</div>'; return; }
  const alphabet = t.machine.alphabet?.length ? t.machine.alphabet : t.machine.inputAlphabet;
  const L = lengthFor(alphabet.length, route === 'pda' ? 1500 : 2500, alphabet.length === 1 ? 20 : 9);
  let run, want, describeDiff;
  if (route === 'mm') {
    mine.type = mine.type || t.machine.type;
    if (mine.type !== t.machine.type) { out.innerHTML = `<div class="assist-warn">The target is a ${esc(KIND_NAME[t.kind])}; switch the studio mode to ${t.kind === 'MOORE' ? 'Moore' : 'Mealy'}.</div>`; return; }
    run = (w) => transduce(mine, w);
    want = (w) => transduce(t.machine, w);
    describeDiff = (w, got, exp) => `On <code>${esc(w || 'ε')}</code> your machine outputs <code>${esc(got ?? 'nothing (a move is missing)')}</code>; it should output <code>${esc(exp)}</code>.`;
  } else if (route === 'pda') {
    run = (w) => pdaAccepts(mine, w);
    want = (w) => pdaAccepts(t.machine, w);
    describeDiff = (w, got) => `Your PDA ${got ? 'accepts' : 'rejects'} <code>${esc(w || 'ε')}</code>, but it should ${got ? 'reject' : 'accept'} it.`;
  } else {
    if (String(mine.type || '').toUpperCase() === 'NON_DET' || String(mine.type || '').toUpperCase() === 'MULTI_TAPE') { out.innerHTML = '<div class="assist-warn">Checking works on standard single-tape machines.</div>'; return; }
    const tape = !!t.ioKind;
    run = (w) => { const x = tmRun(mine, w, 20000); return x.timeout ? 'loop' : tape ? (x.accepted ? x.tape : null) : x.accepted; };
    want = (w) => { const x = tmRun(t.machine, w, 200000); return tape ? (x.accepted ? x.tape : null) : x.accepted; };
    describeDiff = (w, got, exp) => (got === 'loop'
      ? `Your machine does not halt on <code>${esc(w || 'ε')}</code> within 20 000 steps.`
      : tape ? `On <code>${esc(w || 'ε')}</code> your machine ${got === null ? 'rejects' : `leaves <code>${esc(got || 'ε')}</code> on the tape`}; expected ${exp === null ? 'rejection' : `<code>${esc(exp || 'ε')}</code>`}.`
        : `Your machine ${got ? 'accepts' : 'rejects'} <code>${esc(w || 'ε')}</code>, but it should ${got ? 'reject' : 'accept'} it.`);
  }
  let n = 0;
  for (const word of allWords(alphabet, L)) {
    const w = word.join('');
    n++;
    let got, exp;
    try { got = run(w); exp = want(w); } catch (e) { out.innerHTML = `<div class="assist-error">${esc(e.message)}</div>`; return; }
    if (got !== exp) { out.innerHTML = `<div class="assist-error"><b>Not yet.</b> ${describeDiff(w, got, exp)}</div><div class="assist-muted">Target: ${esc(t.language)}</div>`; return; }
  }
  out.innerHTML = `<div class="assist-ok"><b>Correct</b> on all ${n} inputs up to length ${L}.</div><div class="assist-muted">Target: ${esc(t.language)}</div>`;
}
