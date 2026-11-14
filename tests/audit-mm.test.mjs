// Mealy/Moore studio: practice solutions vs independent output specifications, conversions in
// both directions on random machines, and the exact equivalence checker vs brute force.
import test from 'node:test';
import assert from 'node:assert/strict';
import { words } from './practice-truth.mjs';

const el = () => ({ innerHTML: '', textContent: '', style: {}, classList: { add() {}, remove() {} } });
globalThis.window = globalThis.window || {};
globalThis.document = globalThis.document || { getElementById: el, querySelector: () => null, querySelectorAll: () => [] };
await import('../data/practice/moore_mealy_practice_bank.js');
const { runSimulation } = await import('../src/mm/moore_mealy_simulation.js');
const { convertMooreToMealy, convertMealyToMoore } = await import('../src/mm/moore_mealy_automata.js');
const { compareTransducers } = await import('../src/mm/moore_mealy_equivalence.js');

const run = (w, m) => runSimulation(w, m, true).output;
const prefixes = (w) => [...w].map((_, i) => w.slice(0, i + 1));
const n = (w, c) => [...w].filter(x => x === c).length;
// Each spec maps an input to the full output string (Moore specs include λ(q0)).
const SPEC = [
  [/length is even/, w => '1' + prefixes(w).map(p => (p.length % 2 ? '0' : '1')).join('')],
  [/at least one "a"/, w => 'B' + prefixes(w).map(p => (p.includes('a') ? 'A' : 'B')).join('')],
  [/only after the exact sequence "10"/, w => 'N' + prefixes(w).map(p => (p.endsWith('10') ? 'X' : 'N')).join('')],
  [/odd number of "0"s/, w => 'N' + prefixes(w).map(p => (n(p, '0') % 2 ? 'Y' : 'N')).join('')],
  [/modulo 3 remainder of the number of "a"s/, w => '0' + prefixes(w).map(p => String(n(p, 'a') % 3)).join('')],
  [/detecting the sequence "11"/, w => 'N' + prefixes(w).map(p => (p.endsWith('11') ? 'Y' : 'N')).join('')],
  [/consecutive "a"s/, w => '0' + prefixes(w).map(p => String(Math.min(2, p.length - p.replace(/a+$/, '').length))).join('')],
  [/modulo 4 of the binary number/, w => '0' + prefixes(w).map(p => String(parseInt(p, 2) % 4)).join('')],
  [/input changes/, w => [...w].map((c, i) => ((i ? w[i - 1] : '0') !== c ? 'X' : 'S')).join('')],
  [/current input is "0" and the previous input was "1"/, w => [...w].map((c, i) => (c === '0' && w[i - 1] === '1' ? '1' : '0')).join('')],
  [/identity function/, w => w],
  [/1-bit binary adder/, null],
  [/even number of "0"s has been read/, w => prefixes(w).map(p => (n(p, '0') % 2 ? 'I' : 'P')).join('')],
  [/ends with "110"/, w => prefixes(w).map(p => (p.endsWith('110') ? 'R' : 'N')).join('')],
  [/echoes the most recent input/, w => '-' + w],
  [/binary number read so far is divisible by 3/, w => 'Y' + prefixes(w).map(p => (parseInt(p, 2) % 3 ? 'N' : 'Y')).join('')],
  [/last three inputs were "aba"/, w => '0' + prefixes(w).map(p => (p.endsWith('aba') ? '1' : '0')).join('')],
  [/one's complement/, w => [...w].map(c => (c === '0' ? '1' : '0')).join('')],
  [/delays its input by one step/, w => [...w].map((c, i) => (i ? w[i - 1] : '0')).join('')],
  [/equals the input two steps earlier/, w => [...w].map((c, i) => (i >= 2 && w[i - 2] === c ? '1' : '0')).join('')],
  [/two's complement of a binary number fed least-significant bit first/, w => { const k = w.indexOf('1'); return k < 0 ? w : w.slice(0, k + 1) + [...w.slice(k + 1)].map(c => (c === '0' ? '1' : '0')).join(''); }],
];

function entries() {
  const out = [];
  for (const [kind, v] of Object.entries(globalThis.window.MM_PRACTICE_BANK)) {
    if (Array.isArray(v)) v.forEach(e => out.push({ kind, ...e }));
    else for (const [lvl, list] of Object.entries(v)) list.forEach(e => out.push({ kind: `${kind}/${lvl}`, ...e }));
  }
  return out;
}

test('Mealy/Moore practice solutions produce exactly the specified output', () => {
  const bad = [];
  for (const e of entries()) {
    if (e.kind.startsWith('MOORE_TO_MEALY')) continue;              // these are the source machines of conversions
    const hit = SPEC.find(([re]) => re.test(e.q));
    assert.ok(hit, `no spec for: ${e.q}`);
    if (!hit[1]) continue;
    const sigma = [...new Set(e.machine.transitions.map(t => t.symbol))].sort();
    for (const w of words(sigma, 6)) if (run(w, e.machine) !== hit[1](w)) { bad.push(`${e.q.slice(0, 50)} on "${w}": ${run(w, e.machine)} ≠ ${hit[1](w)}`); break; }
  }
  assert.deepEqual(bad, []);
});

test('the binary adder reads two-character input symbols (00/01/10/11)', () => {
  const adder = entries().find(e => /1-bit binary adder/.test(e.q)).machine;
  // LSB-first serial addition: 3 + 1 → pairs (1,1),(1,0) → sum bits 0,0 with carry out
  assert.equal(run('1110', adder), '00');
  assert.equal(run('11,10', adder), '00');
  assert.equal(run('0101', adder), '11');
});

function randomMachine(type, rnd, nStates, sigma, gamma) {
  const states = Array.from({ length: nStates }, (_, i) => ({ id: `q${i}`, x: 0, y: 0, initial: i === 0, ...(type === 'MOORE' ? { output: gamma[Math.floor(rnd() * gamma.length)] } : {}) }));
  const transitions = [];
  for (const s of states) for (const a of sigma) if (rnd() < 0.9) transitions.push({ from: s.id, to: `q${Math.floor(rnd() * nStates)}`, symbol: a, ...(type === 'MEALY' ? { output: gamma[Math.floor(rnd() * gamma.length)] } : {}) });
  return { type, states, transitions, alphabet: sigma };
}
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

test('Moore → Mealy and Mealy → Moore conversions preserve the output on random machines', async () => {
  const rnd = mulberry32(7);
  for (let k = 0; k < 150; k++) {
    const sigma = ['0', '1'], gamma = ['x', 'y', 'z'];
    const moore = randomMachine('MOORE', rnd, 2 + (k % 4), sigma, gamma);
    const mealy = await convertMooreToMealy(moore);
    const mealy2 = randomMachine('MEALY', rnd, 2 + (k % 4), sigma, gamma);
    const moore2 = await convertMealyToMoore(mealy2);
    assert.equal(moore2.states.filter(s => s.initial).length, 1, 'converted Moore machine needs exactly one start state');
    for (const w of words(sigma, 5)) {
      assert.equal(run(w, mealy), run(w, moore).slice(1), `Moore→Mealy #${k} on "${w}"`);
      assert.equal(run(w, moore2).slice(1), run(w, mealy2), `Mealy→Moore #${k} on "${w}"`);
    }
  }
});

test('exact Mealy/Moore equivalence agrees with brute force and returns a shortest counterexample', async () => {
  const rnd = mulberry32(11);
  for (let k = 0; k < 200; k++) {
    const a = randomMachine('MEALY', rnd, 2 + (k % 3), ['0', '1'], ['x', 'y']);
    const b = randomMachine('MEALY', rnd, 2 + (k % 3), ['0', '1'], ['x', 'y']);
    const r = await compareTransducers(a, b);
    const first = [...words(['0', '1'], 7)].find(w => run(w, a) !== run(w, b));
    assert.equal(r.equivalent, first === undefined, `pair #${k}`);
    if (first !== undefined) assert.equal(r.counterexample.length, first.length, `pair #${k} counterexample not shortest`);
    const self = await compareTransducers(a, await convertMealyToMoore(a));
    assert.ok(self.equivalent, `machine #${k} not equivalent to its own Moore conversion`);
  }
});

test('moore_mealy_library.json machines match their descriptions', async () => {
  const { readFileSync } = await import('node:fs');
  const lib = JSON.parse(readFileSync(new URL('../data/libraries/moore_mealy_library.json', import.meta.url)));
  const spec = {
    'Even Ones Detector': w => '1' + prefixes(w).map(p => (n(p, '1') % 2 ? '0' : '1')).join(''),
    "Moore: Detect '10' Sequence": w => '0' + prefixes(w).map(p => (p.endsWith('10') ? '1' : '0')).join(''),
  };
  for (const e of lib) {
    const m = e.machine || e;
    assert.ok(spec[e.title], `no spec for ${e.title}`);
    for (const w of words(['0', '1'], 6)) assert.equal(run(w, m), spec[e.title](w), `${e.title} on "${w}"`);
  }
});
