// Builds the FA conversion practice sets (ε-NFA→NFA, NFA→DFA, DFA→min DFA, NFA→min DFA) from the
// verified construction questions in data/practice/practice-bank.js. Every entry stores the machine
// to convert (`source`) and the expected answer (`machine`). Run: node tools/build-conversion-practice.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import * as FA from '../src/core/fa.js';
import { withLayout } from '../src/core/layout.js';

const file = new URL('../data/practice/practice-bank.js', import.meta.url);
globalThis.window = {};
await import(file.href);
const bank = window.PRACTICE_BANK;
const LEVELS = ['easy', 'basic', 'medium', 'hard'];
const plain = (q) => q.replace(/<[^>]+>/g, '').replace(/\s*\(Σ=\{[^}]*\}\)\s*$/, '').replace(/^(DFA|NFA|ε-NFA)\s+(for|accepting)\s+/i, '');
const sigmaOf = (q, m) => (q.match(/Σ=\{([^}]*)\}/)?.[1].split(',').map(s => s.trim()).filter(Boolean)) || FA.machineAlphabet(m);
const clone = (m) => JSON.parse(JSON.stringify(m));
let seed = 20261114;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

// Make a minimal DFA non-minimal without changing its language: duplicate a state and send some
// of its incoming edges to the copy (a classic "find the equivalent states" exercise).
function inflate(machine) {
  const m = clone(machine);
  const victims = m.states.filter(s => m.transitions.some(t => t.to === s.id && t.from !== s.id)).slice(0, 2);
  for (const v of victims) {
    const copy = { ...v, id: `${v.id}'`, initial: false, x: v.x + 70, y: v.y + 110 };
    m.states.push(copy);
    for (const t of m.transitions.filter(t => t.from === v.id)) m.transitions.push({ ...t, from: copy.id, to: t.to === v.id ? copy.id : t.to });
    const incoming = m.transitions.filter(t => t.to === v.id && t.from !== v.id && t.from !== copy.id);
    incoming.forEach((t, i) => { if (i % 2 === 0 || rnd() < 0.5) t.to = copy.id; });
  }
  return m;
}
// Give a machine some ε-moves without changing its language: route a few transitions q -a-> r
// through a fresh state, q -ε-> q~ -a-> r, and add an ε-shortcut into the start state's closure.
function withEpsilon(machine) {
  const m = clone(machine);
  const picks = m.transitions.filter((t, i) => i % 3 === 0).slice(0, 3);
  picks.forEach((t, i) => {
    const mid = { id: `e${i}`, initial: false, accepting: false, x: (m.states.find(s => s.id === t.from).x + m.states.find(s => s.id === t.to).x) / 2 + 30, y: 120 + 90 * i };
    m.states.push(mid);
    m.transitions.push({ from: t.from, to: mid.id, symbol: 'ε' }, { from: mid.id, to: t.to, symbol: t.symbol });
    m.transitions.splice(m.transitions.indexOf(t), 1);
  });
  return m;
}
// A deterministic "NFA" makes subset construction trivial. Add a twin of some state q (same
// accepting flag, same outgoing moves) and a second edge p -a-> q' next to p -a-> q: the language
// is unchanged but the machine is now genuinely nondeterministic.
function withNondeterminism(machine) {
  const m = clone(machine);
  const isNondet = FA.structuralIssues({ ...m, type: 'DFA' }).some(i => i.kind === 'nondeterministic' || i.kind === 'epsilon');
  if (isNondet || !m.transitions.length) return m;
  const t = m.transitions.find(x => x.from !== x.to) || m.transitions[0];
  const q = m.states.find(s => s.id === t.to);
  const twin = { ...q, id: `${q.id}'`, initial: false, x: q.x + 60, y: q.y + 120 };
  m.states.push(twin);
  for (const o of m.transitions.filter(x => x.from === q.id)) m.transitions.push({ ...o, from: twin.id, to: o.to === q.id ? twin.id : o.to });
  m.transitions.push({ ...t, to: twin.id });
  return m;
}
const dfaOf = (src, sigma, keepDead) => withLayout(FA.toAppMachine(FA.toMinimalDfa(src, sigma), { keepDead }));

const out = { ENFA_TO_NFA: {}, NFA_TO_DFA: {}, DFA_TO_MIN_DFA: {}, NFA_TO_MIN_DFA: {} };
for (const lvl of LEVELS) {
  for (const k of Object.keys(out)) out[k][lvl] = [];
  for (const e of bank.ENFA?.[lvl] || []) {
    const sigma = sigmaOf(e.q, e.machine);
    const src = e.machine.transitions.some(t => FA.isEpsilon(t.symbol)) ? clone(e.machine) : withEpsilon(e.machine);
    if (!src.transitions.some(t => FA.isEpsilon(t.symbol))) continue;   // e.g. L = {ε}: nothing to remove
    const target = withLayout(FA.removeEpsilon({ ...clone(src), alphabet: sigma }));
    out.ENFA_TO_NFA[lvl].push({ q: `Remove the ε-moves: convert the ε-NFA on the canvas (${plain(e.q)}) into an equivalent NFA with no ε-transitions.`,
      sol: `ε-closure construction: ${target.states.length} states, ${target.transitions.length} transitions.`, source: { ...src, type: 'ENFA' }, machine: { ...target, type: 'NFA' } });
  }
  for (const e of bank.NFA?.[lvl] || []) {
    const sigma = sigmaOf(e.q, e.machine);
    const nsrc = withNondeterminism(e.machine);
    const full = dfaOf(e.machine, sigma, true);
    out.NFA_TO_DFA[lvl].push({ q: `Subset construction: convert the NFA on the canvas (${plain(e.q)}) into an equivalent DFA.`,
      sol: `Any equivalent DFA is accepted; the smallest has ${full.states.length} states (including the trap state if needed).`, source: { ...nsrc, type: 'NFA' }, machine: { ...full, type: 'DFA' } });
    out.NFA_TO_MIN_DFA[lvl].push({ q: `Convert the NFA on the canvas (${plain(e.q)}) into the minimal DFA.`,
      sol: `Subset construction, then minimisation: ${full.states.length} states (a missing trap state is also accepted).`, source: { ...nsrc, type: 'NFA' }, machine: { ...full, type: 'DFA' } });
  }
  for (const e of bank.DFA?.[lvl] || []) {
    const sigma = sigmaOf(e.q, e.machine);
    const min = dfaOf(e.machine, sigma, true);
    let source = { ...clone(e.machine), type: 'DFA' };
    if (source.states.length <= min.states.length) source = { ...inflate(withLayout({ ...min })), type: 'DFA' };
    if (source.states.length <= min.states.length) continue;
    out.DFA_TO_MIN_DFA[lvl].push({ q: `Minimise the DFA on the canvas (${plain(e.q)}): merge the equivalent states.`,
      sol: `${source.states.length} states → ${min.states.length} states after partition refinement.`, source, machine: { ...min, type: 'DFA' } });
  }
}
for (const k of Object.keys(out)) bank[k] = out[k];
writeFileSync(file, `// Practice questions and reference solutions. Construction answers are checked by tests/audit-fa.test.mjs;\n// conversion sets are generated from them by tools/build-conversion-practice.mjs.\nwindow.PRACTICE_BANK = ${JSON.stringify(bank, null, 2)};\n`);
for (const [k, v] of Object.entries(out)) console.log(k, Object.fromEntries(Object.entries(v).map(([l, a]) => [l, a.length])));
