// assistant/builder_ui.js — the Automata Builder drawer, available in every studio.
//
// Type what you want ("a PDA for aⁿb²ⁿ", "Mealy machine for 2's complement", "TM that adds two
// unary numbers", "strings ending with 01"). The builder (core/build) decides the machine type from
// the wording and the current studio, builds it, verifies it, and the drawer then draws it —
// switching studio first when the request belongs to another one.

import { buildFromText, detectKind, defaultKind, KIND_NAME, ROUTE } from '../core/build/index.js';
import { refreshLucideIcons, addLogMessage } from '../shared/utils.js';

let model = null;
let busy = false;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const STUDIO_NAME = { fa: 'Finite Automata studio', mm: 'Mealy/Moore studio', pda: 'PDA studio', tm: 'Turing Machine studio' };
const EXAMPLES = {
  fa: ['strings over {a,b} ending with ab', 'NFA where the third symbol from the end is 1', 'ε-NFA for (a|b)*abb', 'binary numbers divisible by 3', 'a^n b^n (watch it switch to a PDA)'],
  mm: ['Moore machine: output 1 when the input so far ends with 101', 'Mealy machine for 2\'s complement', 'sequence detector for 110, non-overlapping', 'remainder mod 3 of the binary number read so far', 'Mealy machine that outputs the previous input'],
  pda: ['{aⁿb²ⁿ | n ≥ 1}', 'equal number of a\'s and b\'s', 'a^i b^j c^k with i = j or j = k', 'even-length palindromes over {0,1}', 'balanced parentheses and brackets'],
  tm: ['aⁿbⁿcⁿ', '{ww | w ∈ {a,b}*}', 'increment a binary number', 'unary addition 1^m 0 1^n', 'a^(2^n)'],
};

async function loadModel() {
  if (model) return model;
  const res = await fetch(new URL('../core/nl-model.json', import.meta.url));
  if (!res.ok) throw new Error('Could not load the language model.');
  model = await res.json();
  return model;
}

function context() {
  const studio = window.TocStudio?.route?.() || 'fa';
  const mode = window.TocStudio?.mode?.() || '';
  return { studio: { fa: 'FA', mm: 'MM', pda: 'PDA', tm: 'TM' }[studio] || 'FA', mode, route: studio };
}

function targetLine() {
  const el = $('tbTarget');
  if (!el) return;
  const ctx = context();
  const text = $('tbInput')?.value || '';
  const det = detectKind(text);
  const kind = det.kind === 'MM' ? (defaultKind(ctx.studio, ctx.mode) === 'MEALY' ? 'MEALY' : 'MOORE') : det.kind || defaultKind(ctx.studio, ctx.mode);
  el.innerHTML = `${esc(KIND_NAME[kind])} <span class="tb-dim">· ${esc(STUDIO_NAME[ROUTE[kind]])}${det.kind ? '' : ' (current mode)'}</span>`;
}

function renderExamples() {
  const box = $('tbExamples');
  if (!box) return;
  const r = context().route;
  const list = [...EXAMPLES[r] || EXAMPLES.fa, ...Object.entries(EXAMPLES).filter(([k]) => k !== r).map(([, v]) => v[0])];
  box.innerHTML = list.map(e => `<button type="button" class="assist-mini" data-ex="${esc(e.replace(/ \(watch.*\)$/, ''))}">${esc(e)}</button>`).join('');
}

function ensureUi() {
  if ($('tocBuilder')) return;
  const host = document.body;
  const drawer = document.createElement('aside');
  drawer.id = 'tocBuilder';
  drawer.className = 'tb-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-label', 'Automata Builder');
  drawer.hidden = true;
  drawer.innerHTML = `
    <header class="tb-head">
      <div class="tb-title"><i data-lucide="wand-sparkles"></i> Automata Builder</div>
      <button type="button" class="tb-x" id="tbClose" data-close aria-label="Close builder"><i data-lucide="x"></i></button>
    </header>
    <div class="tb-body">
      <p class="tb-sub">Describe a <b>DFA, NFA, ε-NFA, Moore or Mealy machine, PDA or Turing machine</b>, in words or notation. It picks the right studio, builds the machine, tests it on every short input, then draws it.</p>
      <div class="tb-target"><i data-lucide="target"></i> Building: <span id="tbTarget"></span></div>
      <textarea id="tbInput" rows="3" spellcheck="false" placeholder="e.g. a PDA for {aⁿb²ⁿ | n ≥ 1}  ·  Mealy machine for 2's complement  ·  TM for ww"></textarea>
      <div class="assist-row">
        <button type="button" id="tbBuild" class="assist-btn primary"><i data-lucide="wand-sparkles"></i> Build &amp; draw</button>
        <button type="button" id="tbPreview" class="assist-btn" title="Check what would be built without drawing">Preview</button>
      </div>
      <div class="tb-ex" id="tbExamples"></div>
      <div id="tbOut" aria-live="polite"></div>
    </div>`;
  host.appendChild(drawer);
  const fab = document.createElement('button');
  fab.id = 'tocBuilderFab';
  fab.type = 'button';
  fab.className = 'tb-fab';
  fab.title = 'Automata Builder (B)';
  fab.setAttribute('aria-label', 'Open the Automata Builder');
  fab.innerHTML = '<i data-lucide="wand-sparkles"></i><span>Build</span>';
  host.appendChild(fab);

  fab.addEventListener('click', () => (drawer.hidden ? open() : close()));
  $('tbClose').addEventListener('click', close);
  $('tbBuild').addEventListener('click', () => run(true));
  $('tbPreview').addEventListener('click', () => run(false));
  $('tbInput').addEventListener('input', targetLine);
  $('tbInput').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || !e.shiftKey)) { e.preventDefault(); run(true); } });
  $('tbExamples').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ex]');
    if (!b) return;
    $('tbInput').value = b.dataset.ex;
    targetLine();
    run(true);
  });
  refreshLucideIcons();
}

export function open(text) {
  ensureUi();
  const d = $('tocBuilder');
  d.hidden = false;
  requestAnimationFrame(() => { d.classList.add('open'); document.body.classList.add('tb-open'); });
  if (typeof text === 'string') $('tbInput').value = text;
  renderExamples();
  targetLine();
  setTimeout(() => $('tbInput')?.focus(), 60);
  loadModel().catch(() => {});
}

export function close() {
  const d = $('tocBuilder');
  if (!d) return;
  d.classList.remove('open');
  document.body.classList.remove('tb-open');
  setTimeout(() => { d.hidden = true; }, 180);
}

function resultHtml(r, drawn) {
  if (!r.ok) {
    return `<div class="assist-error"><b>Nothing was drawn.</b><br>${(r.problems || []).map(esc).join('<br>')}</div>
      <div class="assist-muted">Try notation like <code>{aⁿbⁿ | n ≥ 1}</code>, or name the machine: “Mealy machine…”, “PDA…”, “Turing machine…”.</div>`;
  }
  const v = r.verified || {};
  const check = v.exact ? 'Exactly equivalent to the language (checked by DFA comparison).' : `Checked on all ${v.checked} inputs up to length ${v.maxLen}: every answer correct.`;
  const io = r.io?.length ? `<table class="tb-io"><thead><tr><th>input</th><th>${r.ioKind === 'tape' ? 'tape after halting' : 'output'}</th></tr></thead><tbody>${r.io.map(([a, b]) => `<tr><td><code>${esc(a || 'ε')}</code></td><td><code>${esc(b || 'ε')}</code></td></tr>`).join('')}</tbody></table>` : '';
  const samples = r.samples ? `<div class="assist-samples"><div>✓ ${r.samples.accepted.map(w => `<code>${esc(w)}</code>`).join(' ') || '—'}</div><div>✗ ${r.samples.rejected.map(w => `<code>${esc(w)}</code>`).join(' ') || '—'}</div></div>` : '';
  const m = r.machine;
  return `
    <div class="tb-card">
      <div class="tb-kind"><span class="tb-badge">${esc(KIND_NAME[r.kind])}</span> ${m.states.length} states · ${m.transitions.length} transitions${drawn ? ` · <b>drawn in the ${esc(STUDIO_NAME[r.route])}</b>` : ''}</div>
      ${r.notes.map(n => `<div class="assist-warn">${esc(n)}</div>`).join('')}
      <div class="tb-lang">${esc(r.language || '')}</div>
      ${r.how ? `<div class="tb-how"><b>How it works:</b> ${esc(r.how)}</div>` : ''}
      ${samples}${io}
      <div class="assist-ok tb-verified"><i data-lucide="shield-check"></i> ${esc(check)}</div>
    </div>`;
}

export async function run(draw = true, textArg) {
  if (busy) return null;
  ensureUi();
  const text = (textArg ?? $('tbInput').value).trim();
  const out = $('tbOut');
  if (!text) { out.innerHTML = '<div class="assist-warn">Describe a machine first.</div>'; return null; }
  busy = true;
  out.innerHTML = '<div class="assist-muted"><span class="tb-spin"></span> Reading, building and testing…</div>';
  try {
    const ctx = context();
    const m = await loadModel();
    await new Promise(r => setTimeout(r, 16));        // let the spinner paint
    const r = buildFromText(text, { model: m, studio: ctx.studio, mode: ctx.mode });
    out.innerHTML = resultHtml(r, false);
    refreshLucideIcons();
    if (r.ok && draw) {
      const switched = r.route !== ctx.route;
      if (switched) out.insertAdjacentHTML('afterbegin', `<div class="assist-muted"><span class="tb-spin"></span> Opening the ${esc(STUDIO_NAME[r.route])}…</div>`);
      await window.TocStudio.load(studioMachine(r), r.route);
      out.innerHTML = resultHtml(r, true);
      refreshLucideIcons();
      try { addLogMessage(`Builder: ${KIND_NAME[r.kind]} for “${text}” — verified.`, 'wand-sparkles'); } catch { /* log panel may be absent */ }
      // on phones the drawer covers the canvas: get out of the way (the result stays for the next open)
      if (window.matchMedia?.('(max-width: 720px)').matches) setTimeout(close, 900);
      renderExamples();
      targetLine();
    }
    return r;
  } catch (e) {
    out.innerHTML = `<div class="assist-error">${esc(e.message || e)}</div>`;
    return null;
  } finally {
    busy = false;
  }
}

/** Adjust a built machine to what each studio expects. */
function studioMachine(r) {
  const m = structuredClone(r.machine);
  if (r.kind === 'PDA') m.type = 'NPDA';
  if (r.kind === 'TM') m.type = 'STANDARD';
  return m;
}

export function initBuilder() {
  ensureUi();
  window.TocBuilder = { open, close, run };
}
