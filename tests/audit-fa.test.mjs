// Differential tests: the studio's original FA code vs the verified core, on random machines.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as FA from '../src/core/fa.js';
import { regexToDfa } from '../src/core/regex.js';

globalThis.window = globalThis.window || {};

let seed = 12345;
const rnd = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);
const ri = (n) => Math.floor(rnd() * n);

function randomMachine(type, n = 2 + ri(4), sigma = ['a', 'b']) {
  const states = Array.from({ length: n }, (_, i) => ({ id: 'q' + i, initial: i === 0, accepting: rnd() < 0.4 }));
  const transitions = [];
  for (const s of states) for (const a of sigma) {
    if (type === 'DFA') { if (rnd() < 0.85) transitions.push({ from: s.id, to: 'q' + ri(n), symbol: a }); }
    else { const k = ri(3); for (let j = 0; j < k; j++) transitions.push({ from: s.id, to: 'q' + ri(n), symbol: a }); }
  }
  if (type === 'ENFA') for (let j = 0; j < ri(3); j++) transitions.push({ from: 'q' + ri(n), to: 'q' + ri(n), symbol: 'ε' });
  return { type, states, transitions, alphabet: sigma };
}
const words = (sigma, n) => { const o = ['']; for (let i = 0; i < o.length; i++) if (o[i].length < n) for (const a of sigma) o.push(o[i] + a); return o; };

test('simulation.js runSimulation agrees with the core on random DFA/NFA/ε-NFA', async () => {
  const { runSimulation } = await import('../src/fa/simulation.js');
  for (const type of ['DFA', 'NFA', 'ENFA']) for (let k = 0; k < 60; k++) {
    const m = randomMachine(type);
    const d = FA.toMinimalDfa(m, ['a', 'b']);
    for (const w of words('ab', 5)) {
      const r = await runSimulation(w, m);
      assert.equal(r.isAccepted, FA.accepts(d, w), `${type} #${k} on "${w}": ${JSON.stringify(m)}`);
    }
  }
});

test('automata.js convertNfaToDfa + minimizeDfa preserve the language', async () => {
  const { convertNfaToDfa, minimizeDfa, convertEnfaToNfa } = await import('../src/fa/automata.js');
  for (const type of ['NFA', 'ENFA']) for (let k = 0; k < 60; k++) {
    const m = randomMachine(type);
    const ref = FA.toMinimalDfa(m, ['a', 'b']);
    const nfa = type === 'ENFA' ? await convertEnfaToNfa(m) : m;
    const dfa = await convertNfaToDfa(nfa);
    assert.equal(FA.compare(FA.toMinimalDfa(dfa, ['a', 'b']), ref).equivalent, true, `subset #${k} ${JSON.stringify(m)}`);
    const min = await minimizeDfa(dfa);
    assert.equal(FA.compare(FA.toMinimalDfa(min, ['a', 'b']), ref).equivalent, true, `minimize #${k} ${JSON.stringify(m)}`);
    assert.ok(min.states.length <= ref.delta.length, `minimize #${k}: ${min.states.length} states, minimal is ${ref.delta.length} (incl. dead)`);
  }
});

test('regex-converter.js (Grammar studio) agrees with core regex on random expressions', async () => {
  const { parseRegexAndBuildEnfa } = await import('../src/grammar/regex-converter.js');
  const gen = (d) => {
    const r = rnd();
    if (d <= 0 || r < 0.3) return ['a', 'b'][ri(2)];
    if (r < 0.5) return `(${gen(d - 1)}+${gen(d - 1)})`;
    if (r < 0.8) return gen(d - 1) + gen(d - 1);
    return `(${gen(d - 1)})*`;
  };
  for (let k = 0; k < 150; k++) {
    const re = gen(3);
    const out = parseRegexAndBuildEnfa(re);
    const m = out.machine || out;
    const mine = FA.toMinimalDfa({ ...m, type: 'ENFA' }, ['a', 'b']);
    assert.equal(FA.compare(mine, regexToDfa(re, ['a', 'b'])).equivalent, true, `regex ${re}`);
  }
});

test('equivalence.js areEquivalent handles alphabet differences', async () => {
  const { areEquivalent } = await import('../src/fa/equivalence.js');
  const onlyA = { type: 'DFA', states: [{ id: 'x', initial: true, accepting: true }], transitions: [{ from: 'x', to: 'x', symbol: 'a' }] };
  const withB = { type: 'DFA', alphabet: ['a', 'b'], states: [{ id: 'p', initial: true, accepting: true }, { id: 'd' }],
    transitions: [{ from: 'p', to: 'p', symbol: 'a' }, { from: 'p', to: 'd', symbol: 'b' }, { from: 'd', to: 'd', symbol: 'a' }, { from: 'd', to: 'd', symbol: 'b' }] };
  assert.equal(await areEquivalent(onlyA, withB), true);
  assert.equal(await areEquivalent(onlyA, { ...withB, states: [{ id: 'p', initial: true, accepting: true }, { id: 'd', accepting: true }] }), false);
});

test('practice bank solutions are valid machines', async () => {
  globalThis.window = globalThis.window || {};
  await import('../data/practice/practice-bank.js');
  const bank = globalThis.window.PRACTICE_BANK;
  let n = 0;
  const problems = [];
  for (const [mode, levels] of Object.entries(bank)) for (const [lvl, qs] of Object.entries(levels)) for (const q of (Array.isArray(qs) ? qs : [qs])) {
    if (!q.machine) continue;
    n++;
    const ids = new Set(q.machine.states.map(s => s.id));
    if (!q.machine.states.some(s => s.initial)) problems.push(`${mode}/${lvl}: "${q.q.slice(0, 50)}" has no initial state`);
    for (const t of q.machine.transitions) if (!ids.has(t.from) || !ids.has(t.to)) problems.push(`${mode}/${lvl}: "${q.q.slice(0, 50)}" dangling ${t.from}->${t.to}`);
    if (mode === 'DFA') {
      const iss = FA.structuralIssues({ ...q.machine, type: 'DFA' }).filter(i => i.kind === 'nondeterministic');
      if (iss.length) problems.push(`${mode}/${lvl}: "${q.q.slice(0, 50)}" nondeterministic`);
    }
  }
  assert.ok(n > 10);
  assert.deepEqual(problems, []);
});

test('practice bank: every listed question matches its brute-force ground truth', async () => {
  const { TRUTH, words } = await import('./practice-truth.mjs');
  const bank = await loadBank();
  for (const [key, t] of Object.entries(TRUTH)) {
    const [mode, level, i] = key.split('/');
    const dfa = FA.toMinimalDfa(bank[mode][level][+i].machine, [...t.sigma]);
    for (const w of words([...t.sigma], 8)) assert.equal(FA.accepts(dfa, [...w]), t.pred(w), `${key} on "${w || 'ε'}"`);
  }
});

test('practice bank: the English reader agrees with every stored solution it understands', async () => {
  const { readFileSync } = await import('node:fs');
  const { parseDescription } = await import('../src/core/nl.js');
  const { TRUTH } = await import('./practice-truth.mjs');
  const model = JSON.parse(readFileSync(new URL('../src/core/nl-model.json', import.meta.url)));
  const bank = await loadBank();
  const plain = (q) => q.replace(/<[^>]+>/g, ' ').replace(/\$/g, '').replace(/\\Sigma/g, 'Σ').replace(/\\[a-z]+/g, ' ');
  let understood = 0;
  const bad = [];
  for (const mode of ['DFA', 'NFA', 'ENFA']) for (const [level, qs] of Object.entries(bank[mode])) (Array.isArray(qs) ? qs : []).forEach((q, i) => {
    const key = `${mode}/${level}/${i}`;
    if (TRUTH[key]) return;                                   // checked independently above
    const r = parseDescription(plain(q.q), model);
    if (!r.ok || r.problems.length) return;
    understood++;
    const sigma = [...new Set([...r.alphabet, ...FA.machineAlphabet(q.machine)])].sort();
    const c = FA.compare(FA.toMinimalDfa(q.machine, sigma), FA.minimize(FA.withAlphabet(r.dfa, sigma)));
    if (!c.equivalent) bad.push(`${key} differs on "${c.counterexample.join('') || 'ε'}": ${q.q}`);
  });
  assert.ok(understood >= 80, `only ${understood} questions understood`);
  assert.deepEqual(bad, []);
});

async function loadBank() {
  globalThis.window = globalThis.window || {};
  await import('../data/practice/practice-bank.js');
  return globalThis.window.PRACTICE_BANK;
}

test('library.json automata accept exactly what their titles say', async () => {
  const { readFileSync } = await import('node:fs');
  const { parseDescription } = await import('../src/core/nl.js');
  const model = JSON.parse(readFileSync(new URL('../src/core/nl-model.json', import.meta.url)));
  const lib = JSON.parse(readFileSync(new URL('../data/libraries/library.json', import.meta.url)));
  const bad = [];
  for (const e of lib) {
    const m = e.machine || e;
    const sigma0 = FA.machineAlphabet(m);
    const r = parseDescription(`${e.title} over {${sigma0.join(',')}}`, model);
    assert.ok(r.ok, `could not read "${e.title}"`);
    const sigma = [...new Set([...r.alphabet, ...sigma0])].sort();
    const c = FA.compare(FA.toMinimalDfa(m, sigma), FA.minimize(FA.withAlphabet(r.dfa, sigma)));
    if (!c.equivalent) bad.push(`${e.title}: differs on "${c.counterexample.join('') || 'ε'}"`);
  }
  assert.deepEqual(bad, []);
});

test('conversion practice: every source converts to its answer, and the checker accepts the answer', async () => {
  globalThis.document = globalThis.document || { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
  const { conversionProblems } = await import('../src/fa/practice.js');
  const bank = await loadBank();
  let n = 0;
  const bad = [];
  for (const kind of ['ENFA_TO_NFA', 'NFA_TO_DFA', 'DFA_TO_MIN_DFA', 'NFA_TO_MIN_DFA']) {
    for (const [level, list] of Object.entries(bank[kind])) list.forEach((e, i) => {
      n++;
      const key = `${kind}/${level}/${i}`;
      const sigma = [...new Set([...FA.machineAlphabet(e.source), ...FA.machineAlphabet(e.machine)])].sort();
      if (!FA.compare(FA.toMinimalDfa(e.source, sigma), FA.toMinimalDfa(e.machine, sigma)).equivalent) bad.push(`${key}: answer ≠ source language`);
      const probs = conversionProblems(kind, e.machine, e.machine);
      if (probs.length) bad.push(`${key}: reference answer rejected: ${probs[0]}`);
      if (kind === 'ENFA_TO_NFA' && !e.source.transitions.some(t => FA.isEpsilon(t.symbol))) bad.push(`${key}: source has no ε-moves`);
      if (kind === 'DFA_TO_MIN_DFA' && !conversionProblems(kind, e.source, e.machine).length) bad.push(`${key}: source is already minimal`);
      if ((kind === 'NFA_TO_DFA' || kind === 'NFA_TO_MIN_DFA') && !FA.structuralIssues({ ...e.source, type: 'DFA' }).some(x => x.kind === 'nondeterministic' || x.kind === 'epsilon')) bad.push(`${key}: source NFA is already deterministic`);
    });
  }
  assert.ok(n >= 150, `only ${n} conversion questions`);
  assert.deepEqual(bad, []);
});
