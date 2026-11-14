// The Automata Builder: many phrasings → the right machine type, the right language, and a
// machine that the studios' own simulators run correctly (not just the builder's checker).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { words } from './practice-truth.mjs';

globalThis.window = globalThis.window || {};
globalThis.document = globalThis.document || { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
const { buildFromText, detectKind } = await import('../src/core/build/index.js');
const FA = await import('../src/core/fa.js');
const { runPdaSimulation } = await import('../src/pda/pda_simulation.js');
const { runTmSimulation } = await import('../src/tm/tm_simulation.js');
const { runSimulation } = await import('../src/mm/moore_mealy_simulation.js');
const model = JSON.parse(readFileSync(new URL('../src/core/nl-model.json', import.meta.url)));

const n = (w, c) => [...w].filter(x => x === c).length;
const rev = (s) => [...s].reverse().join('');
const anbn = (w) => /^a*b*$/.test(w) && n(w, 'a') === n(w, 'b');
const dyck = (open, close) => (w) => { let d = 0; for (const c of w) { d += c === open ? 1 : c === close ? -1 : NaN; if (!(d >= 0)) return false; } return d === 0; };

// [text, studio, mode, expected kind, language predicate, alphabet]
const ACCEPTORS = [
  ['{a^n b^n | n ≥ 0}', 'FA', 'DFA', 'PDA', anbn, 'ab'],
  ['L = { aⁿbⁿ : n >= 0 }', 'FA', 'DFA', 'PDA', anbn, 'ab'],
  ["n a's followed by n b's", 'FA', 'DFA', 'PDA', anbn, 'ab'],
  ["some a's followed by the same number of b's", 'TM', '', 'TM', anbn, 'ab'],
  ['construct a pda that accepts a^n b^n where n is at least 1', 'FA', 'DFA', 'PDA', (w) => anbn(w) && w.length > 0, 'ab'],
  ['design a PDA for the language {0^n 1^n | n > 0}', 'FA', 'DFA', 'PDA', (w) => /^0+1+$/.test(w) && n(w, '0') === n(w, '1'), '01'],
  ['PDA for a^n b^2n', 'FA', 'DFA', 'PDA', (w) => /^a*b*$/.test(w) && 2 * n(w, 'a') === n(w, 'b'), 'ab'],
  ['a^i b^j with i ≠ j', 'FA', 'DFA', 'PDA', (w) => /^a*b*$/.test(w) && n(w, 'a') !== n(w, 'b'), 'ab'],
  ['a^n b^m with n greater than m', 'FA', 'DFA', 'PDA', (w) => /^a*b*$/.test(w) && n(w, 'a') > n(w, 'b'), 'ab'],
  ['a^i b^j c^k where i + j = k', 'FA', 'DFA', 'PDA', (w) => /^a*b*c*$/.test(w) && n(w, 'a') + n(w, 'b') === n(w, 'c'), 'abc'],
  ['a^n b^{n+m} c^m', 'PDA', 'NPDA', 'PDA', (w) => /^a*b*c*$/.test(w) && n(w, 'b') === n(w, 'a') + n(w, 'c'), 'abc'],
  ['a^i b^j c^k with i = j or j = k', 'PDA', '', 'PDA', (w) => /^a*b*c*$/.test(w) && (n(w, 'a') === n(w, 'b') || n(w, 'b') === n(w, 'c')), 'abc'],
  ['a^n b^m c^m d^n', 'FA', 'DFA', 'PDA', (w) => { const m = w.match(/^(a*)(b*)(c*)(d*)$/); return !!m && m[1].length === m[4].length && m[2].length === m[3].length; }, 'abcd'],
  ["strings with an equal number of a's and b's", 'FA', 'DFA', 'PDA', (w) => n(w, 'a') === n(w, 'b'), 'ab'],
  ["more a's than b's", 'FA', 'DFA', 'PDA', (w) => n(w, 'a') > n(w, 'b'), 'ab'],
  ['#a(w) = 2#b(w)', 'FA', 'DFA', 'PDA', (w) => n(w, 'a') === 2 * n(w, 'b'), 'ab'],
  ['palindromes over {a,b}', 'FA', 'DFA', 'PDA', (w) => w === rev(w), 'ab'],
  ['strings that read the same forwards and backwards over {0,1}', 'FA', 'DFA', 'PDA', (w) => w === rev(w), '01'],
  ['{ww^R | w ∈ {a,b}*}', 'FA', 'DFA', 'PDA', (w) => w === rev(w) && w.length % 2 === 0, 'ab'],
  ['w c w^R where w in {a,b}*', 'FA', 'DFA', 'PDA', (w) => { const i = w.indexOf('c'); return i >= 0 && w.lastIndexOf('c') === i && w.slice(i + 1) === rev(w.slice(0, i)); }, 'abc'],
  ['balanced parentheses', 'FA', 'DFA', 'PDA', dyck('(', ')'), '()'],
  ["every prefix has at least as many a's as b's and an equal number of a's and b's", 'FA', 'DFA', 'PDA', dyck('a', 'b'), 'ab'],
  ['PDA accepting by empty stack a^n b^2n', 'FA', 'DFA', 'PDA', (w) => /^a*b*$/.test(w) && 2 * n(w, 'a') === n(w, 'b'), 'ab'],
  ['aⁿbⁿcⁿ', 'FA', 'DFA', 'TM', (w) => /^a*b*c*$/.test(w) && n(w, 'a') === n(w, 'b') && n(w, 'b') === n(w, 'c'), 'abc'],
  ['PDA for a^n b^n c^n where n ≥ 1', 'FA', 'DFA', 'TM', (w) => /^a+b+c+$/.test(w) && n(w, 'a') === n(w, 'b') && n(w, 'b') === n(w, 'c'), 'abc'],
  ['TM that accepts palindromes', 'FA', 'DFA', 'TM', (w) => w === rev(w), 'ab'],
  ['{ww | w ∈ {0,1}*}', 'FA', 'DFA', 'TM', (w) => w.length % 2 === 0 && w.slice(0, w.length / 2) === w.slice(w.length / 2), '01'],
  ['TM for w#w over {a,b}', 'FA', 'DFA', 'TM', (w) => { const i = w.indexOf('#'); return i >= 0 && w.lastIndexOf('#') === i && w.slice(0, i) === w.slice(i + 1); }, 'ab#'],
  ["equal number of a's, b's and c's", 'FA', 'DFA', 'TM', (w) => n(w, 'a') === n(w, 'b') && n(w, 'b') === n(w, 'c'), 'abc'],
  ['a^{2^n}', 'FA', 'DFA', 'TM', (w) => w.length > 0 && /^a*$/.test(w) && (w.length & (w.length - 1)) === 0, 'a'],
  ['balanced brackets', 'TM', '', 'TM', dyck('[', ']'), '[]'],
  ["DFA for strings over {a,b} with an even number of a's", 'PDA', '', 'DFA', (w) => n(w, 'a') % 2 === 0, 'ab'],
  ['NFA for strings containing 101', 'FA', 'DFA', 'NFA', (w) => w.includes('101'), '01'],
  ['strings where the third symbol from the end is 1', 'FA', 'NFA', 'NFA', (w) => w.length >= 3 && w[w.length - 3] === '1', '01'],
  ['ε-NFA for a*b*', 'FA', 'DFA', 'ENFA', (w) => /^a*b*$/.test(w), 'ab'],
  ['binary numbers divisible by 3', 'FA', 'DFA', 'DFA', (w) => w === '' || parseInt(w, 2) % 3 === 0, '01'],
  ['strings ending in ab', 'PDA', '', 'PDA', (w) => w.endsWith('ab'), 'ab'],
  ["strings with at least two b's", 'TM', '', 'TM', (w) => n(w, 'b') >= 2, 'ab'],
  ['a^n b^m where n and m are at least 1', 'FA', 'DFA', 'DFA', (w) => /^a+b+$/.test(w), 'ab'],
];

const studioAccepts = (r, alphabet) => {
  if (r.kind === 'PDA') return (w) => runPdaSimulation(w, r.machine, { silent: true }).success;
  if (r.kind === 'TM') return (w) => runTmSimulation(w, { ...r.machine, type: 'STANDARD' }, 5000).success;
  const d = FA.toMinimalDfa(r.machine, [...alphabet]);
  return (w) => FA.accepts(d, w);
};

test('builder: phrasings give the right machine type and exactly the described language (studio simulators)', () => {
  for (const [text, studio, mode, kind, pred, A] of ACCEPTORS) {
    const r = buildFromText(text, { model, studio, mode });
    assert.ok(r.ok, `${text}: ${r.problems?.join(' | ')}`);
    assert.equal(r.kind, kind, text);
    const acc = studioAccepts(r, A);
    const L = A.length > 3 ? 5 : A.length > 2 ? 6 : A.length === 1 ? 16 : 8;
    for (const w of words([...A], L)) assert.equal(acc(w), pred(w), `${text} on "${w}"`);
  }
});

// [text, studio, mode, kind, expected output function, alphabet]
const flip = (w) => [...w].map(c => (c === '0' ? '1' : '0')).join('');
const TRANSDUCERS = [
  ['Moore machine that outputs 1 if the input so far ends with 11, otherwise 0', 'FA', 'DFA', 'MOORE', (w) => [...Array(w.length + 1).keys()].map(i => (w.slice(0, i).endsWith('11') ? '1' : '0')).join(''), '01'],
  ['mealy machine that outputs 1 whenever the last three bits are 101', 'FA', 'DFA', 'MEALY', (w) => [...w].map((_, i) => (w.slice(0, i + 1).endsWith('101') ? '1' : '0')).join(''), '01'],
  ['mealy machine to complement the input bits', 'FA', 'DFA', 'MEALY', flip, '01'],
  ["Mealy machine for 2's complement", 'MM', 'MOORE', 'MEALY', (w) => { let s = false, o = ''; for (const c of w) { o += s ? (c === '0' ? '1' : '0') : c; if (c === '1') s = true; } return o; }, '01'],
  ['Moore machine for the residue mod 5 of a binary number', 'FA', 'DFA', 'MOORE', (w) => { let r = 0, o = '0'; for (const c of w) { r = (2 * r + +c) % 5; o += r; } return o; }, '01'],
  ['sequence detector for 110, non-overlapping', 'MM', 'MEALY', 'MEALY', (w) => { let b = '', o = ''; for (const c of w) { b += c; if (b.endsWith('110')) { o += '1'; b = ''; } else o += '0'; } return o; }, '01'],
  ['output Y when the input contains aa, else N', 'MM', 'MOORE', 'MOORE', (w) => [...Array(w.length + 1).keys()].map(i => (w.slice(0, i).includes('aa') ? 'y' : 'n')).join(''), 'ab'],
  ['strings ending with 01', 'MM', 'MOORE', 'MOORE', (w) => [...Array(w.length + 1).keys()].map(i => (w.slice(0, i).endsWith('01') ? '1' : '0')).join(''), '01'],
];

test('builder: Moore / Mealy machines produce the right outputs in the studio simulator', () => {
  for (const [text, studio, mode, kind, f, A] of TRANSDUCERS) {
    const r = buildFromText(text, { model, studio, mode });
    assert.ok(r.ok, `${text}: ${r.problems?.join(' | ')}`);
    assert.equal(r.kind, kind, text);
    for (const w of words([...A], 7)) assert.equal(runSimulation(w, r.machine, true).output.toLowerCase(), f(w).toLowerCase(), `${text} on "${w}"`);
  }
});

const TM_TASKS = [
  ['TM to add 1 to a binary number', (w) => { if (!/^[01]*$/.test(w)) return null; return (BigInt('0b' + (w || '0')) + 1n).toString(2).padStart(w.length, '0'); }, '01'],
  ["Turing machine that computes the 2's complement", (w) => { let s = false, o = ''; for (let i = w.length - 1; i >= 0; i--) { o = (s ? (w[i] === '0' ? '1' : '0') : w[i]) + o; if (w[i] === '1') s = true; } return o; }, '01'],
  ['TM for unary addition 1^m 0 1^n', (w) => { const m = w.match(/^(1*)0(1*)$/); return m ? m[1] + m[2] : null; }, '10'],
  ['subtract two unary numbers', (w) => { const m = w.match(/^(1*)0(1*)$/); return m ? '1'.repeat(Math.max(0, m[1].length - m[2].length)) : null; }, '10'],
  ['TM that doubles a unary number', (w) => (/^1*$/.test(w) ? w + w : null), '1'],
];

test('builder: Turing-machine tasks leave the right tape in the studio simulator', () => {
  for (const [text, f, A] of TM_TASKS) {
    const r = buildFromText(text, { model, studio: 'FA', mode: 'DFA' });
    assert.ok(r.ok, `${text}: ${r.problems?.join(' | ')}`);
    assert.equal(r.kind, 'TM', text);
    for (const w of words([...A], A.length === 1 ? 12 : 7)) {
      const want = f(w);
      const res = runTmSimulation(w, { ...r.machine, type: 'STANDARD' }, 20000);
      if (want === null) assert.ok(!res.success, `${text} should reject "${w}"`);
      else {
        assert.ok(res.success, `${text} should accept "${w}"`);
        assert.equal(res.finalTape.replace(/^B+|B+$/g, ''), want, `${text} on "${w}"`);
      }
    }
  }
});

test('builder: explicit machine names win, otherwise the studio mode decides', () => {
  assert.equal(detectKind('construct a minimal DFA for ...').kind, 'DFA');
  assert.equal(detectKind('ε-NFA for ...').kind, 'ENFA');
  assert.equal(detectKind('pushdown automaton accepting by empty stack').kind, 'PDA');
  assert.equal(detectKind('Turing machine').kind, 'TM');
  assert.equal(detectKind('Mealy machine').kind, 'MEALY');
  assert.equal(buildFromText('strings ending with ab', { model, studio: 'FA', mode: 'NFA' }).kind, 'NFA');
  assert.equal(buildFromText('strings ending with ab', { model, studio: 'MM', mode: 'MEALY' }).kind, 'MEALY');
  assert.equal(buildFromText('strings ending with ab', { model, studio: 'TM' }).kind, 'TM');
});

test('builder: impossible requests are refused, never drawn wrong', () => {
  const r = buildFromText('Moore machine that outputs 1 when the input so far has an equal number of 0s and 1s', { model, studio: 'MM', mode: 'MOORE' });
  assert.equal(r.ok, false);
  assert.match(r.problems.join(' '), /finitely many states/);
  const p = buildFromText('strings whose length is prime', { model, studio: 'FA', mode: 'DFA' });
  assert.equal(p.ok, false);
});
