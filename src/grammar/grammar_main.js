// grammar/grammar_main.js — the Grammar Studio page (UI over core/cfg.js).

import * as C from '../core/cfg.js';
import * as FA from '../core/fa.js';
import { regexToEnfa, regexToDfa } from '../core/regex.js';
import { readSpec, oracleFor } from '../core/build/lang.js';
import { consumePendingImportedMachine, setPendingImportedMachine } from '../app/machine_router.js';
import { appUrl } from '../shared/paths.js';
import { refreshLucideIcons, initializeShortcuts } from '../shared/utils.js';
import { initBuilder } from '../assistant/builder_ui.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const STORE = 'tocGrammarStudioV2';
let G = null;            // current parsed grammar
let parsed = null;       // parse result (errors / warnings)
let analysis = null;
let tab = 'overview';

// ------------------------------------------------------------------ helpers

const show = (w) => (w === '' ? 'ε' : w);
const word = (arr) => (arr.some(s => s.length > 1) ? arr.join(' ') : arr.join(''));
const grammarPre = (g) => `<pre class="gs-pre">${esc(C.grammarText(g))}</pre>`;
const setList = (set) => (set && set.size ? [...set].map(x => `<code>${esc(x)}</code>`).join(' ') : '<span class="gs-dim">none</span>');

function openInStudio(route, machine) {
  setPendingImportedMachine(route, machine);
  window.location.href = appUrl(`index.html#${route}`);
}

function testWords(g, maxLen) {
  const out = [];
  let layer = [[]];
  for (let L = 0; L <= maxLen; L++) {
    if (L) layer = layer.flatMap(w => g.terminals.map(a => [...w, a]));
    if (out.length + layer.length > 4000) break;
    out.push(...layer);
  }
  return out;
}

// ------------------------------------------------------------------ core refresh

function refresh() {
  const text = $('gsGrammar').value;
  parsed = C.parseGrammar(text, $('gsStart').value.trim());
  G = parsed.grammar;
  try { localStorage.setItem(STORE, JSON.stringify({ text, start: $('gsStart').value, input: $('gsInput').value })); } catch { /* storage may be off */ }
  const status = $('gsStatus');
  if (!parsed.ok) {
    analysis = null;
    $('gsBadge').textContent = 'error';
    $('gsBadge').className = 'gs-badge bad';
    status.innerHTML = parsed.errors.map(e => `<div class="assist-error">${esc(e)}</div>`).join('');
    renderTab();
    return;
  }
  analysis = C.analyse(G);
  const cls = analysis.classification;
  $('gsBadge').textContent = `Type ${cls.type}`;
  $('gsBadge').className = `gs-badge t${cls.type}`;
  $('gsStart').placeholder = G.start;
  status.innerHTML = parsed.warnings.map(w => `<div class="assist-warn">${esc(w)}</div>`).join('');
  renderTab();
}

function renderTab() {
  document.querySelectorAll('.gs-tabs [data-tab]').forEach(b => { b.classList.toggle('active', b.dataset.tab === tab); b.setAttribute('aria-selected', b.dataset.tab === tab); });
  document.querySelectorAll('.gs-panel').forEach(p => { p.hidden = p.id !== `tab-${tab}`; });
  const needCfg = ['parse', 'normal', 'cyk', 'll1', 'convert'].includes(tab);
  if (needCfg && (!G || !parsed.ok || !G.isCfg)) {
    const host = $(`tab-${tab}`);
    const msg = !parsed?.ok ? 'Fix the grammar first (see the messages under the editor).' : 'This tool works on context-free grammars (one non-terminal on each left side). The Overview tab classifies the current grammar.';
    if (tab === 'parse') $('gsParseOut').innerHTML = `<div class="assist-warn">${msg}</div>`;
    else if (tab === 'cyk') $('gsCykOut').innerHTML = `<div class="assist-warn">${msg}</div>`;
    else host.innerHTML = `<div class="assist-warn">${msg}</div>`;
    return;
  }
  ({ overview: renderOverview, parse: renderParse, normal: renderNormal, cyk: renderCyk, ll1: renderLl1, convert: renderConvert, pumping: () => {}, regex: () => {} })[tab]();
  refreshLucideIcons();
}

// ------------------------------------------------------------------ overview

function renderOverview() {
  const host = $('tab-overview');
  if (!G || !parsed.ok) { host.innerHTML = '<div class="assist-muted">Write a grammar on the left.</div>'; return; }
  const a = analysis;
  const cls = a.classification;
  const samples = G.isCfg ? C.sampleStrings(G, 6, 24) : [];
  const facts = [];
  if (G.isCfg) {
    if (a.emptyLanguage) facts.push(['bad', `The start symbol ${G.start} derives no terminal string: the language is empty.`]);
    if (a.useless.length) facts.push(['warn', `Useless non-terminals: ${a.useless.join(', ')} (never reachable or never terminating). “Simplify & CNF” removes them.`]);
    if (a.leftRecursive.length) facts.push(['warn', `Left-recursive: ${a.leftRecursive.join(', ')} — no LL(1) parser can use it as is.`]);
    facts.push(a.ll1 ? ['ok', 'LL(1): one rule per (non-terminal, look-ahead) — predictive parsing works.'] : ['info', `Not LL(1): ${a.conflicts.length} table conflict${a.conflicts.length === 1 ? '' : 's'} (see FIRST / FOLLOW / LL(1)).`]);
    if (C.isCnf(G)) facts.push(['ok', 'Already in Chomsky normal form.']);
    const amb = findAmbiguity(G);
    if (amb) facts.push(['warn', `Ambiguous: “${show(amb)}” has two different parse trees (Parse trees tab).`]);
  } else facts.push(['info', 'Parse trees, normal forms and conversions need a context-free grammar.']);
  host.innerHTML = `
    <div class="gs-cls t${cls.type}"><b>${esc(cls.name)}</b><span>${esc(cls.detail)}</span></div>
    <div class="gs-grid">
      <div class="gs-stat"><b>${G.rules.length}</b><span>rules</span></div>
      <div class="gs-stat"><b>${G.nonterminals.length}</b><span>non-terminals</span></div>
      <div class="gs-stat"><b>${G.terminals.length}</b><span>terminals</span></div>
      <div class="gs-stat"><b><code>${esc(G.start)}</code></b><span>start symbol</span></div>
    </div>
    ${facts.map(([k, t]) => `<div class="${k === 'ok' ? 'assist-ok' : k === 'bad' ? 'assist-error' : k === 'warn' ? 'assist-warn' : 'gs-info'}">${esc(t)}</div>`).join('')}
    <table class="gs-table"><tbody>
      <tr><th>Non-terminals V</th><td>${G.nonterminals.map(x => `<code>${esc(x)}</code>`).join(' ')}</td></tr>
      <tr><th>Terminals Σ</th><td>${G.terminals.map(x => `<code>${esc(x)}</code>`).join(' ') || '<span class="gs-dim">none</span>'}</td></tr>
      ${G.isCfg ? `<tr><th>Nullable (⇒* ε)</th><td>${setList(a.nullable)}</td></tr>
      <tr><th>Generating</th><td>${setList(a.generating)}</td></tr>
      <tr><th>Reachable from ${esc(G.start)}</th><td>${setList(a.reachable)}</td></tr>` : ''}
    </tbody></table>
    <h3>Rules</h3>
    <ol class="gs-rules">${G.rules.map(r => `<li><code>${esc(C.ruleStr(r))}</code></li>`).join('')}</ol>
    ${G.isCfg ? `<h3>Strings in the language (length ≤ 6)</h3><div class="gs-words">${samples.length ? samples.map(w => `<button type="button" class="assist-mini" data-try="${esc(w)}">${esc(show(w))}</button>`).join('') : '<span class="gs-dim">none up to length 6</span>'}</div>` : ''}`;
}

function findAmbiguity(g) {
  for (const w of testWords(g, 5).filter(w => w.length <= 5)) {
    const t = C.parseTrees(g, w, 2);
    if (t.count >= 2) return word(w);
  }
  return null;
}

// ------------------------------------------------------------------ parse trees

function renderParse() {
  const out = $('gsParseOut');
  const tokens = C.tokenize(G, $('gsInput').value);
  if (tokens === null) { out.innerHTML = '<div class="assist-error">The string uses symbols that are not terminals of this grammar.</div>'; return; }
  const res = C.parseTrees(G, tokens, 2);
  const w = word(tokens);
  if (!res.accepted) {
    out.innerHTML = `<div class="assist-error"><b>“${esc(show(w))}” is not in the language.</b> No parse tree exists.</div>${nearMiss(tokens)}`;
    return;
  }
  const amb = res.count >= 2;
  const cyclic = amb && res.trees.length < 2;
  const head = amb
    ? `<div class="assist-warn"><b>Ambiguous:</b> “${esc(show(w))}” has ${cyclic ? 'infinitely many parse trees (the grammar has a derivation cycle such as A ⇒⁺ A)' : 'two different parse trees, shown below'}.</div>`
    : `<div class="assist-ok"><b>“${esc(show(w))}” is in the language</b> and has exactly one parse tree.</div>`;
  const blocks = res.trees.map((t, i) => {
    const lm = C.derivation(G, t), rm = C.derivation(G, t, true);
    return `<div class="gs-tree-card">
      <h3>${res.trees.length > 1 ? `Tree ${i + 1}` : 'Parse tree'}</h3>
      <div class="gs-tree">${treeSvg(t)}</div>
      <details open><summary>Leftmost derivation (${lm.length - 1} steps)</summary>${derivList(lm)}</details>
      <details><summary>Rightmost derivation</summary>${derivList(rm)}</details>
    </div>`;
  }).join('');
  out.innerHTML = head + `<div class="gs-trees">${blocks}</div>`;
}

function nearMiss(tokens) {
  const P = C.parseCounts(G, tokens);
  let best = -1;
  for (let j = tokens.length; j >= 0; j--) {
    // longest prefix that is a prefix of some sentence: approximate by the longest prefix in the language
    if (P.get(G.start, 0, j)) { best = j; break; }
  }
  return best >= 0 ? `<div class="gs-dim">The longest prefix that is itself in the language: “${esc(show(word(tokens.slice(0, best))))}”.</div>` : '';
}

function derivList(steps) {
  return `<ol class="gs-deriv">${steps.map((s, i) => `<li>${i ? '⇒ ' : ''}<code>${esc(s.form.length ? word(s.form) : 'ε')}</code>${s.rule ? `<span class="gs-dim"> by ${esc(C.ruleStr(s.rule))}</span>` : ''}</li>`).join('')}</ol>`;
}

function treeSvg(tree) {
  // leaves get consecutive x positions, parents sit above the middle of their children
  let leafX = 0;
  const nodes = [];
  const edges = [];
  const place = (n, depth) => {
    const me = { n, depth };
    nodes.push(me);
    if (!n.children?.length) { me.x = leafX++; return me; }
    const kids = n.children.map(c => place(c, depth + 1));
    me.x = (kids[0].x + kids[kids.length - 1].x) / 2;
    for (const k of kids) edges.push([me, k]);
    return me;
  };
  place(tree, 0);
  const DX = 46, DY = 58, R = 15;
  const maxD = Math.max(...nodes.map(n => n.depth));
  const W = Math.max(1, leafX) * DX + 30, H = (maxD + 1) * DY + 20;
  const X = (n) => 15 + n.x * DX + DX / 2, Y = (n) => 25 + n.depth * DY;
  const isNt = (n) => !n.n.leaf;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Parse tree">
    ${edges.map(([a, b]) => `<line x1="${X(a)}" y1="${Y(a) + R}" x2="${X(b)}" y2="${Y(b) - R}" class="gs-edge"/>`).join('')}
    ${nodes.map(n => `<g class="gs-node ${isNt(n) ? 'nt' : n.n.sym === C.EPS ? 'eps' : 't'}"><circle cx="${X(n)}" cy="${Y(n)}" r="${R}"/><text x="${X(n)}" y="${Y(n) + 5}">${esc(n.n.sym)}</text></g>`).join('')}
  </svg>`;
}

// ------------------------------------------------------------------ simplify & CNF

function renderNormal() {
  const host = $('tab-normal');
  const simp = C.simplify(G);
  const cnf = C.toCnf(G);
  const words = testWords(G, 6);
  const sameS = words.every(w => C.accepts(G, w) === C.accepts(simp.grammar, w));
  const sameC = words.every(w => C.accepts(G, w) === C.accepts(cnf.grammar, w));
  const maxLen = Math.max(...words.map(w => w.length));
  const stepHtml = (steps) => steps.map((s, i) => `<details ${i === steps.length - 1 ? 'open' : ''}><summary><b>${i + 1}.</b> ${esc(s.title)} <span class="gs-dim">(${s.grammar.rules.length} rules)</span></summary>${grammarPre(s.grammar)}</details>`).join('');
  host.innerHTML = `
    <h3>Simplified grammar</h3>
    <p class="gs-lead">Useless symbols, ε-rules and unit rules removed (ε stays only as a rule of a fresh start symbol when ε is in the language).</p>
    ${stepHtml(simp.steps)}
    <div class="${sameS ? 'assist-ok' : 'assist-error'}">${sameS ? `Same language as the original on all ${words.length} strings up to length ${maxLen}.` : 'Check failed — please report this grammar.'}</div>
    <div class="gs-row"><button type="button" class="assist-btn" data-use="simp">Use the simplified grammar</button></div>
    <h3>Chomsky normal form</h3>
    <p class="gs-lead">Every rule is <code>A → BC</code> or <code>A → a</code> (plus <code>S₀ → ε</code> if needed). Steps in Sipser’s order: START, DEL, UNIT, TERM, BIN.</p>
    ${stepHtml(cnf.steps)}
    <div class="${sameC && C.isCnf(cnf.grammar) ? 'assist-ok' : 'assist-error'}">${sameC && C.isCnf(cnf.grammar) ? `Valid CNF, and the same language on all ${words.length} strings up to length ${maxLen}.` : 'Check failed — please report this grammar.'}</div>
    <div class="gs-row"><button type="button" class="assist-btn" data-use="cnf">Use the CNF grammar</button><button type="button" class="assist-btn" data-tab-go="cyk">Run CYK</button></div>`;
  host.querySelector('[data-use="simp"]').onclick = () => useGrammar(simp.grammar);
  host.querySelector('[data-use="cnf"]').onclick = () => useGrammar(cnf.grammar);
}

function useGrammar(g) {
  $('gsGrammar').value = C.grammarText(g).replace(/→/g, '->');
  $('gsStart').value = g.start;
  tab = 'overview';
  refresh();
}

// ------------------------------------------------------------------ CYK

function renderCyk() {
  const out = $('gsCykOut');
  const tokens = C.tokenize(G, $('gsInput').value);
  if (tokens === null) { out.innerHTML = '<div class="assist-error">The string uses symbols that are not terminals of this grammar.</div>'; return; }
  const cnf = C.isCnf(G) ? G : C.toCnf(G).grammar;
  const r = C.cyk(cnf, tokens);
  const n = tokens.length;
  if (!n) { out.innerHTML = `<div class="${r.accepted ? 'assist-ok' : 'assist-error'}">ε is ${r.accepted ? '' : 'not '}in the language (CNF has ${r.accepted ? 'the' : 'no'} rule ${esc(cnf.start)} → ε).</div>`; return; }
  let rows = '';
  for (let len = n; len >= 1; len--) {
    rows += `<tr><th>ℓ=${len}</th>${Array.from({ length: n }, (_, i) => (i + len <= n
      ? `<td class="${r.table[len - 1][i].has(cnf.start) && len === n ? 'gs-hit' : ''}">${r.table[len - 1][i].size ? [...r.table[len - 1][i]].map(esc).join(', ') : '∅'}</td>`
      : '<td class="gs-void"></td>')).join('')}</tr>`;
  }
  rows += `<tr><th></th>${tokens.map(t => `<th><code>${esc(t)}</code></th>`).join('')}</tr>`;
  out.innerHTML = `
    <div class="${r.accepted ? 'assist-ok' : 'assist-error'}">${r.accepted ? `<b>Accepted:</b> ${esc(cnf.start)} is in the top cell.` : `<b>Rejected:</b> ${esc(cnf.start)} is not in the top cell.`}</div>
    <div class="gs-scroll"><table class="gs-cyk">${rows}</table></div>
    <details><summary>CNF grammar used (${cnf.rules.length} rules)</summary>${grammarPre(cnf)}</details>`;
}

// ------------------------------------------------------------------ FIRST / FOLLOW / LL(1)

function renderLl1() {
  const host = $('tab-ll1');
  const a = analysis;
  const cols = [...G.terminals, '$'];
  const conflict = new Set(a.conflicts.map(c => `${c.nt}|${c.terminal}`));
  host.innerHTML = `
    <div class="${a.ll1 ? 'assist-ok' : 'assist-warn'}">${a.ll1 ? 'The grammar is <b>LL(1)</b>: every table cell has at most one rule.' : `<b>Not LL(1):</b> ${a.conflicts.length} cell${a.conflicts.length === 1 ? ' has' : 's have'} more than one rule (highlighted).${a.leftRecursive.length ? ` Left recursion in ${a.leftRecursive.join(', ')} is one cause — rewrite A → Aα | β as A → βA', A' → αA' | ε.` : ''}`}</div>
    <table class="gs-table"><thead><tr><th>Non-terminal</th><th>Nullable</th><th>FIRST</th><th>FOLLOW</th></tr></thead><tbody>
      ${G.nonterminals.map(A => `<tr><th><code>${esc(A)}</code></th><td>${a.nullable.has(A) ? 'yes' : 'no'}</td><td>{ ${[...a.FIRST.get(A)].map(esc).join(', ')}${a.nullable.has(A) ? (a.FIRST.get(A).size ? ', ' : '') + 'ε' : ''} }</td><td>{ ${[...a.FOLLOW.get(A)].map(esc).join(', ')} }</td></tr>`).join('')}
    </tbody></table>
    <h3>LL(1) parsing table</h3>
    <div class="gs-scroll"><table class="gs-table gs-ll1"><thead><tr><th></th>${cols.map(c => `<th><code>${esc(c)}</code></th>`).join('')}</tr></thead><tbody>
      ${G.nonterminals.map(A => `<tr><th><code>${esc(A)}</code></th>${cols.map(c => { const cell = a.table.get(A).get(c) || []; return `<td class="${conflict.has(`${A}|${c}`) ? 'gs-conflict' : ''}">${cell.map(i => esc(C.ruleStr(G.rules[i]))).join('<br>')}</td>`; }).join('')}</tr>`).join('')}
    </tbody></table></div>`;
}

// ------------------------------------------------------------------ conversions

function renderConvert() {
  const host = $('tab-convert');
  const pda = C.toPda(G);
  const reg = C.regularToNfa(G);
  const words = testWords(G, 5);
  let regCheck = '';
  if (reg.machine) {
    const d = FA.toMinimalDfa(reg.machine, G.terminals);
    const ok = words.every(w => FA.accepts(d, w.join('')) === C.accepts(G, w));
    regCheck = `<div class="${ok ? 'assist-ok' : 'assist-error'}">${ok ? `Same language as the grammar on all ${words.length} strings up to length 5.` : 'Check failed.'}</div>`;
  }
  host.innerHTML = `
    <h3>CFG → PDA</h3>
    ${pda.error ? `<div class="assist-warn">${esc(pda.error)}</div>` : `
      <p class="gs-lead">One working state <code>q1</code>: replace the non-terminal on top of the stack by a right-hand side (ε-move), or match the input symbol with the terminal on top. Accept in <code>q2</code> when only <code>Z</code> is left.</p>
      ${pda.renamed.length ? `<div class="gs-info">Stack symbols are single characters, so ${pda.renamed.map(([a, b]) => `${esc(a)} is written ${esc(b)}`).join(', ')}.</div>` : ''}
      <div class="gs-scroll"><table class="gs-table"><thead><tr><th>#</th><th>From</th><th>Input</th><th>Pop</th><th>Push</th><th>To</th></tr></thead><tbody>
        ${pda.machine.transitions.map((t, i) => `<tr><td>${i + 1}</td><td>${t.from}</td><td>${esc(t.symbol || 'ε')}</td><td>${esc(t.pop || 'ε')}</td><td>${esc(t.push || 'ε')}</td><td>${t.to}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="gs-row"><button type="button" class="assist-btn primary" id="cvPda"><i data-lucide="layers"></i> Open in the PDA studio</button><button type="button" class="assist-btn" id="cvPdaJson">Download JSON</button></div>`}
    <h3>Regular grammar → finite automaton</h3>
    ${reg.error ? `<div class="gs-info">${esc(reg.error)} This grammar is ${esc(analysis.classification.name)}.</div>` : `
      <p class="gs-lead">${reg.reversed ? 'Left-linear: build the automaton for the reversed rules, then reverse it.' : 'Right-linear: one state per non-terminal; A → aB becomes an a-move from A to B, A → a goes to the final state, A → ε makes A accepting.'}</p>
      ${regCheck}
      <div class="gs-row"><button type="button" class="assist-btn primary" id="cvFa"><i data-lucide="network"></i> Open the ${esc(reg.machine.type === 'ENFA' ? 'ε-NFA' : 'NFA')} in the FA studio</button></div>`}`;
  if (!pda.error) {
    $('cvPda').onclick = () => openInStudio('pda', pda.machine);
    $('cvPdaJson').onclick = () => {
      const blob = new Blob([JSON.stringify(pda.machine, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'grammar_pda.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
  }
  if (!reg.error) $('cvFa').onclick = () => openInStudio('fa', reg.machine);
}

// ------------------------------------------------------------------ pumping lemma

function runPumping() {
  const out = $('pmOut');
  const p = Math.max(1, Math.min(8, +$('pmP').value || 3));
  const mode = $('pmMode').value;
  const langText = $('pmLang').value.trim();
  let member, label;
  if (langText) {
    const spec = readSpec(langText);
    const oracle = spec && oracleFor(spec);
    if (!oracle) { out.innerHTML = '<div class="assist-error">I could not read that language. Try notation like {aⁿbⁿcⁿ | n ≥ 0}, {ww | w ∈ {a,b}*} or “equal number of a’s and b’s”, or leave it empty to use the grammar.</div>'; return; }
    member = oracle; label = spec.label;
  } else {
    if (!G?.isCfg) { out.innerHTML = '<div class="assist-error">Enter a language, or write a context-free grammar.</div>'; return; }
    member = (s) => { const t = C.tokenize(G, s); return t !== null && C.accepts(G, t); };
    label = 'the language of the grammar';
  }
  const w = C.expandWitness($('pmWitness').value, p);
  if (w === null) { out.innerHTML = '<div class="assist-error">Write the witness with powers of p, e.g. a^p b^p c^p or 0^(2p) 1^p.</div>'; return; }
  if (w.length > 40) { out.innerHTML = '<div class="assist-error">That witness is longer than 40 symbols; use a smaller p.</div>'; return; }
  const r = C.pumpingCheck(w, p, member, mode, 3);
  const fmt = (parts) => (mode === 'cfl' ? ['u', 'v', 'x', 'y', 'z'] : ['x', 'y', 'z']).map((n, i) => `${n} = <code>${esc(show(parts[i]))}</code>`).join(', ');
  let html = `<div class="gs-info">L = ${esc(label)}, p = ${p}, w = <code>${esc(show(w))}</code> (|w| = ${w.length}). ${r.total} legal decompositions (${mode === 'cfl' ? '|vxy| ≤ p, |vy| ≥ 1' : '|xy| ≤ p, |y| ≥ 1'}).</div>`;
  if (!r.inLanguage) html += '<div class="assist-error">w itself is not in L — a witness must be in the language.</div>';
  else if (w.length < p) html += '<div class="assist-error">The witness must be at least p symbols long.</div>';
  else if (r.survivor) html += `<div class="assist-warn"><b>This witness does not work.</b> The split ${fmt(r.survivor)} stays in L for i = 0, 1, 2, 3, so the lemma is not contradicted. Choose a different w.</div>`;
  else html += `<div class="assist-ok"><b>Every split fails.</b> For each of the ${r.total} decompositions some i ∈ {0, 2, 3} pumps w out of L. With the same argument for every p, this proves L is ${mode === 'cfl' ? 'not context-free' : 'not regular'}.</div>`;
  if (r.examples.length) html += `<h3>How some splits fail</h3><ul class="gs-list">${r.examples.map(e => `<li>${fmt(e.split)} → i = ${e.i} gives <code>${esc(show(e.pumped))}</code> ∉ L</li>`).join('')}</ul>`;
  out.innerHTML = html;
}

// ------------------------------------------------------------------ regex → FA

function regexOpen(kind) {
  const src = $('rxInput').value.trim();
  const out = $('rxOut');
  try {
    const alphabet = [...new Set(src.replace(/[()|*+?ε\s]/g, '').split(''))].sort();
    const machine = kind === 'enfa'
      ? { ...regexToEnfa(src), type: 'ENFA', alphabet, title: src }
      : FA.toAppMachine(regexToDfa(src, alphabet), { keepDead: true, title: src });
    out.innerHTML = `<div class="assist-ok">Built ${kind === 'enfa' ? 'the ε-NFA' : 'the minimal DFA'} with ${machine.states.length} states — opening the FA studio…</div>`;
    setTimeout(() => openInStudio('fa', machine), 300);
  } catch (e) {
    out.innerHTML = `<div class="assist-error">${esc(e.message)}</div>`;
  }
}

// ------------------------------------------------------------------ test box

function runTest() {
  if (!G || !parsed.ok || !G.isCfg) { $('gsTestOut').innerHTML = ''; return; }
  const tokens = C.tokenize(G, $('gsInput').value);
  if (tokens === null) { $('gsTestOut').innerHTML = '<span class="gs-no">✗ unknown symbols</span>'; return; }
  const P = C.parseCounts(G, tokens);
  const c = P.get(G.start, 0, tokens.length);
  $('gsTestOut').innerHTML = c ? `<span class="gs-yes">✓ in the language</span>${c >= 2 ? ' <span class="gs-amb">· ambiguous</span>' : ''}` : '<span class="gs-no">✗ not in the language</span>';
}

// ------------------------------------------------------------------ init

function init() {
  initializeShortcuts();
  // Automata Builder on this page: drawing a machine means opening its studio
  window.TocStudio = { route: () => null, mode: () => '', load: async (machine, route) => openInStudio(route, machine) };
  initBuilder();

  const ex = $('gsExamples');
  ex.innerHTML += C.EXAMPLES.map((e, i) => `<option value="${i}">${esc(e.name)}</option>`).join('');
  ex.addEventListener('change', () => {
    const e = C.EXAMPLES[+ex.value];
    if (!e) return;
    $('gsGrammar').value = e.text;
    $('gsStart').value = '';
    ex.value = '';
    refresh();
  });

  // restore: a grammar sent from another studio wins, then the last session
  const pending = consumePendingImportedMachine?.('grammar');
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch { /* ignore */ }
  if (pending?.grammarText) $('gsGrammar').value = pending.grammarText;
  else if (Array.isArray(pending?.rules)) {
    // grammar JSON files (rules: [{ lhs, rhs: [...] }], startSymbol)
    $('gsGrammar').value = pending.rules.map(r => `${r.lhs} -> ${r.rhs?.length ? r.rhs.join(' ') : 'ε'}`).join('\n');
    $('gsStart').value = pending.startSymbol || '';
  }
  else if (saved?.text) { $('gsGrammar').value = saved.text; $('gsStart').value = saved.start || ''; $('gsInput').value = saved.input || ''; }
  if (!$('gsInput').value) $('gsInput').value = 'aabb';

  let timer = null;
  $('gsGrammar').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { refresh(); runTest(); }, 250); });
  $('gsStart').addEventListener('change', () => { refresh(); runTest(); });
  $('gsInput').addEventListener('input', () => { runTest(); if (tab === 'parse' || tab === 'cyk') renderTab(); });
  $('gsInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') { tab = 'parse'; renderTab(); } });
  $('gsTestBtn').addEventListener('click', () => { tab = 'parse'; renderTab(); });
  document.querySelector('.gs-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; renderTab(); } });
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-try]');
    if (t) { $('gsInput').value = t.dataset.try; runTest(); tab = 'parse'; renderTab(); }
    const go = e.target.closest('[data-tab-go]');
    if (go) { tab = go.dataset.tabGo; renderTab(); }
  });
  $('pmRun').addEventListener('click', runPumping);
  $('rxEnfa').addEventListener('click', () => regexOpen('enfa'));
  $('rxDfa').addEventListener('click', () => regexOpen('dfa'));
  // deep links: grammar_studio.html#cyk
  const h = location.hash.slice(1);
  if (document.querySelector(`.gs-tabs [data-tab="${h}"]`)) tab = h;
  refresh();
  runTest();
}

init();
