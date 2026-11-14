// Grammar engine: parsing, classification, exact membership and ambiguity, normal forms, CYK,
// LL(1), conversions and the pumping-lemma checker — all checked against independent definitions.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/core/cfg.js';
import * as FA from '../src/core/fa.js';
import { pdaAccepts } from '../src/core/build/sim.js';
import { words } from './practice-truth.mjs';

const n = (w, c) => [...w].filter(x => x === c).length;
const rev = (s) => [...s].reverse().join('');
const dyck = (w) => { let d = 0; for (const c of w) { d += c === '(' ? 1 : -1; if (d < 0) return false; } return d === 0; };
const g = (text, start) => { const r = C.parseGrammar(text, start); assert.ok(r.ok, r.errors.join(' ')); return r.grammar; };

const LANGS = [
  ['S -> a S b | ε', (w) => /^a*b*$/.test(w) && n(w, 'a') === n(w, 'b'), 'ab'],
  ['S -> a S a | b S b | a | b | ε', (w) => w === rev(w), 'ab'],
  ['S -> ( S ) S | ε', dyck, '()'],
  ['S -> a S b S | b S a S | ε', (w) => n(w, 'a') === n(w, 'b'), 'ab'],
  ['S -> X C | A Y\nX -> a X b | ε\nC -> c C | ε\nA -> a A | ε\nY -> b Y c | ε', (w) => /^a*b*c*$/.test(w) && (n(w, 'a') === n(w, 'b') || n(w, 'b') === n(w, 'c')), 'abc'],
  ['S -> S S | ( S ) | ε', dyck, '()'],
  ['S -> A B | a C\nA -> a A | ε\nB -> b B | ε\nC -> C c\nD -> d', (w) => /^a*b*$/.test(w), 'abcd'],
];

test('cfg: membership is exact for grammars with ε-rules, left recursion and useless symbols', () => {
  for (const [text, pred, A] of LANGS) {
    const G = g(text);
    for (const w of words([...A], A.length > 3 ? 5 : 7)) assert.equal(C.accepts(G, [...w]), pred(w), `${text} on "${w}"`);
  }
});

test('cfg: simplification and Chomsky normal form keep the language; CYK agrees', () => {
  for (const [text, pred, A] of LANGS) {
    const G = g(text);
    const s = C.simplify(G).grammar;
    const cnf = C.toCnf(G).grammar;
    assert.ok(C.isCnf(cnf), `${text} → not CNF:\n${C.grammarText(cnf)}`);
    for (const w of words([...A], A.length > 3 ? 4 : 6)) {
      assert.equal(C.accepts(s, [...w]), pred(w), `simplified ${text} on "${w}"`);
      assert.equal(C.accepts(cnf, [...w]), pred(w), `CNF ${text} on "${w}"`);
      assert.equal(C.cyk(cnf, [...w]).accepted, pred(w), `CYK ${text} on "${w}"`);
    }
  }
});

test('cfg: ambiguity — two distinct trees, derivations that end in the string', () => {
  const G = g('E -> E + E | E * E | ( E ) | a');
  const r = C.parseTrees(G, C.tokenize(G, 'a+a*a'));
  assert.equal(r.count, 2);
  assert.equal(r.trees.length, 2);
  const yields = r.trees.map(t => C.derivation(G, t).at(-1).form.join(''));
  assert.deepEqual(yields, ['a+a*a', 'a+a*a']);
  assert.notEqual(C.derivation(G, r.trees[0])[1].form.join(''), C.derivation(G, r.trees[1])[1].form.join(''));
  const U = g('E -> E + T | T\nT -> T * F | F\nF -> ( E ) | a');
  assert.equal(C.parseTrees(U, C.tokenize(U, 'a+a*a')).count, 1);
  const cyc = g('S -> S | a');
  assert.equal(C.parseCounts(cyc, ['a']).get('S', 0, 1), 2, 'a cycle gives infinitely many trees');
});

test('cfg: classification, FIRST/FOLLOW and LL(1)', () => {
  assert.equal(C.classify(g('S -> a S | b')).type, 3);
  assert.equal(C.classify(g('S -> S a | b')).type, 3);
  assert.equal(C.classify(g('S -> a S b | ε')).type, 2);
  assert.equal(C.classify(g('S -> a S B C | a B C\nC B -> B C\na B -> a b\nb B -> b b\nb C -> b c\nc C -> c c')).type, 1);
  assert.equal(C.classify(g('S -> a\nA B -> ε')).type, 0);
  const L = g("E -> T E'\nE' -> + T E' | ε\nT -> F T'\nT' -> * F T' | ε\nF -> ( E ) | a");
  const a = C.analyse(L);
  assert.ok(a.ll1);
  assert.deepEqual([...a.FIRST.get('E')].sort(), ['(', 'a']);
  assert.deepEqual([...a.FOLLOW.get("E'")].sort(), ['$', ')']);
  assert.deepEqual([...a.FOLLOW.get('F')].sort(), ['$', ')', '*', '+']);
  const LR = C.analyse(g('E -> E + T | T\nT -> a'));
  assert.ok(!LR.ll1);
  assert.deepEqual(LR.leftRecursive, ['E']);
});

test('cfg: CFG → PDA and regular grammar → NFA accept the same language', () => {
  for (const [text, pred, A] of LANGS.slice(0, 5)) {
    const { machine } = C.toPda(g(text));
    for (const w of words([...A], 6)) assert.equal(pdaAccepts(machine, w), pred(w), `PDA of ${text} on "${w}"`);
  }
  for (const [text, pred] of [['S -> a S | b S | a B\nB -> b', (w) => w.endsWith('ab')], ['S -> S a | S b | B b\nB -> a', (w) => w.startsWith('ab')]]) {
    const { machine } = C.regularToNfa(g(text));
    const d = FA.toMinimalDfa(machine, ['a', 'b']);
    for (const w of words(['a', 'b'], 7)) assert.equal(FA.accepts(d, w), pred(w), `${text} on "${w}"`);
  }
});

test('cfg: pumping-lemma checker separates good and bad witnesses', () => {
  const anbncn = (w) => /^a*b*c*$/.test(w) && n(w, 'a') === n(w, 'b') && n(w, 'b') === n(w, 'c');
  const anbn = (w) => /^a*b*$/.test(w) && n(w, 'a') === n(w, 'b');
  for (const p of [2, 3, 4]) {
    assert.ok(C.pumpingCheck(C.expandWitness('a^p b^p c^p', p), p, anbncn, 'cfl').works, `aⁿbⁿcⁿ, p=${p}`);
    assert.ok(!C.pumpingCheck(C.expandWitness('a^p b^p', p), p, anbn, 'cfl').works, 'aⁿbⁿ is context-free');
    assert.ok(C.pumpingCheck(C.expandWitness('a^p b^p', p), p, anbn, 'regular').works, `aⁿbⁿ not regular, p=${p}`);
  }
  assert.equal(C.expandWitness('0^(2p) 1^p', 2), '000011');
});
