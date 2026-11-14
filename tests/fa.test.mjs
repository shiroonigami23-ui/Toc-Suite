import test from 'node:test';
import assert from 'node:assert/strict';
import * as FA from '../core/fa.js';
import { regexToDfa, regexToEnfa, parseRegex } from '../core/regex.js';

const lang = (dfa, maxLen = 6) => {
  const out = [];
  const rec = (w) => { if (FA.accepts(dfa, w)) out.push(w.join('')); if (w.length < maxLen) for (const a of dfa.alphabet) rec([...w, a]); };
  rec([]);
  return out.sort();
};
const brute = (alphabet, pred, maxLen = 6) => {
  const out = [];
  const rec = (w) => { if (pred(w)) out.push(w); if (w.length < maxLen) for (const a of alphabet) rec(w + a); };
  rec('');
  return out.sort();
};

test('NFA ending in 01 determinizes and minimizes to 3 states', () => {
  const nfa = { type: 'NFA', states: [{ id: 'q0', initial: true }, { id: 'q1' }, { id: 'q2', accepting: true }],
    transitions: [{ from: 'q0', to: 'q0', symbol: '0' }, { from: 'q0', to: 'q0', symbol: '1' }, { from: 'q0', to: 'q1', symbol: '0' }, { from: 'q1', to: 'q2', symbol: '1' }] };
  const d = FA.toMinimalDfa(nfa);
  assert.equal(d.delta.length, 3);
  assert.deepEqual(lang(d), brute('01', w => w.endsWith('01')));
});

test('comma-separated labels and ε-moves are understood', () => {
  const m = { type: 'ENFA', states: [{ id: 'A', initial: true }, { id: 'B' }, { id: 'C', accepting: true }],
    transitions: [{ from: 'A', to: 'B', symbol: 'ε' }, { from: 'B', to: 'B', symbol: 'a, b' }, { from: 'B', to: 'C', symbol: 'b' }] };
  assert.deepEqual(lang(FA.toMinimalDfa(m)), brute('ab', w => w.endsWith('b')));
});

test('regex parser + Thompson construction', () => {
  const cases = [
    ['(a+b)*abb', 'ab', w => w.endsWith('abb')],
    ['a*b*', 'ab', w => /^a*b*$/.test(w)],
    ['(0|1)*1(0|1)', '01', w => w.length >= 2 && w[w.length - 2] === '1'],
    ['(ab)?c*', 'abc', w => /^(ab)?c*$/.test(w)],
    ['a^+', 'a', w => w.length >= 1],
    ['ε+a', 'a', w => w === '' || w === 'a'],
  ];
  for (const [re, sigma, pred] of cases) assert.deepEqual(lang(regexToDfa(re, [...sigma])), brute(sigma, pred), re);
  assert.throws(() => parseRegex('(a+b'), /Missing/);
  assert.throws(() => parseRegex('a++b'), /Missing operand/);
  assert.equal(regexToEnfa('a').states.length, 2);
});

test('minimization gives the textbook sizes', () => {
  assert.equal(regexToDfa('(a+b)*abb').delta.length, 4);
  assert.equal(regexToDfa('(0+1)*1(0+1)(0+1)').delta.length, 8);
  assert.equal(regexToDfa('(aa)*', ['a']).delta.length, 2);
});

test('compare finds the shortest counterexample', () => {
  const a = regexToDfa('(a+b)*b', ['a', 'b']);
  const b = regexToDfa('(a+b)*bb*', ['a', 'b']);
  assert.equal(FA.compare(a, b).equivalent, true);
  const c = regexToDfa('(a+b)*bb', ['a', 'b']);
  const r = FA.compare(a, c);
  assert.equal(r.equivalent, false);
  assert.deepEqual(r.counterexample, ['b']);
  assert.equal(r.acceptedBy, 'a');
});

test('different alphabets are unified (missing symbols go to a dead state)', () => {
  const onlyA = regexToDfa('a*', ['a']);
  const withB = regexToDfa('a*', ['a', 'b']);
  assert.equal(FA.compare(onlyA, withB).equivalent, true);
});

test('boolean operations', () => {
  const evenA = regexToDfa('(b*ab*a)*b*', ['a', 'b']);
  const endsB = regexToDfa('(a+b)*b', ['a', 'b']);
  const both = FA.intersect(evenA, endsB);
  const count = (w, c) => [...w].filter(x => x === c).length;
  assert.deepEqual(lang(both), brute('ab', w => count(w, 'a') % 2 === 0 && w.endsWith('b')));
  assert.deepEqual(lang(FA.complement(endsB)), brute('ab', w => !w.endsWith('b')));
  assert.equal(FA.isEmpty(FA.intersect(endsB, regexToDfa('(a+b)*a', ['a', 'b']))), true);
});

test('toAppMachine drops the dead state and names states q0..', () => {
  const d = regexToDfa('ab', ['a', 'b']);
  const m = FA.toAppMachine(d);
  assert.deepEqual(m.states.map(s => s.id), ['q0', 'q1', 'q2']);
  assert.equal(m.states.filter(s => s.initial).length, 1);
  assert.deepEqual(FA.compare(FA.toMinimalDfa(m, ['a', 'b']), d).equivalent, true);
  const full = FA.toAppMachine(d, { keepDead: true });
  assert.equal(full.states.length, 4);
  assert.equal(full.transitions.length, 8);
});

test('structural issues', () => {
  const m = { type: 'DFA', alphabet: ['a', 'b'], states: [{ id: 'q0', initial: true }, { id: 'q1', accepting: true }, { id: 'q9' }],
    transitions: [{ from: 'q0', to: 'q1', symbol: 'a' }, { from: 'q0', to: 'q0', symbol: 'a' }, { from: 'q1', to: 'q1', symbol: 'a,b' }] };
  const kinds = FA.structuralIssues(m).map(i => i.kind).sort();
  assert.deepEqual(kinds, ['missing', 'missing', 'nondeterministic', 'unreachable']);
});

test('sampleWords in shortlex order', () => {
  assert.deepEqual(FA.sampleWords(regexToDfa('a(a+b)*', ['a', 'b']), { limit: 4 }), ['a', 'aa', 'ab', 'aaa']);
});

test('multi-character symbols tokenise greedily', () => {
  assert.deepEqual(FA.tokens('abcab', ['ab', 'c']), ['ab', 'c', 'ab']);
});
