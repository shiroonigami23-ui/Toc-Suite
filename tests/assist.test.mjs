import test from 'node:test';
import assert from 'node:assert/strict';
import * as FA from '../core/fa.js';
import { regexToDfa } from '../core/regex.js';
import { learnDfa, parseExamples } from '../core/learn.js';
import { autoLayout, crossings, minSeparation } from '../core/layout.js';
import { diagnose, trace } from '../core/diagnose.js';

const all = (sigma, n) => { const o = ['']; for (let i = 0; i < o.length; i++) if (o[i].length < n) for (const a of sigma) o.push(o[i] + a); return o; };

test('RPNI recovers "ends with ab" from a characteristic sample', () => {
  const target = regexToDfa('(a+b)*ab', ['a', 'b']);
  const words = all('ab', 4);
  const pos = words.filter(w => FA.accepts(target, w)), neg = words.filter(w => !FA.accepts(target, w));
  const r = learnDfa(pos, neg, ['a', 'b']);
  assert.ok(r.ok);
  assert.equal(FA.compare(r.dfa, target).equivalent, true);
  assert.equal(r.dfa.delta.length, 3);
});

test('RPNI learns even number of a from few examples and is always consistent', () => {
  const r = learnDfa(['', 'aa', 'b', 'aab', 'aba', 'bb', 'aaaa'], ['a', 'ab', 'ba', 'aaa', 'bab'], ['a', 'b']);
  assert.ok(r.ok);
  for (const w of ['', 'aa', 'b', 'aab', 'aba', 'bb', 'aaaa']) assert.equal(FA.accepts(r.dfa, w), true, w);
  for (const w of ['a', 'ab', 'ba', 'aaa', 'bab']) assert.equal(FA.accepts(r.dfa, w), false, w);
  assert.equal(FA.compare(r.dfa, regexToDfa('(b*ab*a)*b*', ['a', 'b'])).equivalent, true);
});

test('contradictory examples are reported', () => {
  assert.equal(learnDfa(['ab'], ['ab']).ok, false);
});

test('example parser understands several formats', () => {
  const { positive, negative } = parseExamples('+ ab\n- ba\naab ✓\nbb ✗\naccept: ε\nreject: b\n abb, yes');
  assert.deepEqual(positive, ['ab', 'aab', '', 'abb']);
  assert.deepEqual(negative, ['ba', 'bb', 'b']);
});

test('auto-layout: inside canvas, well separated, few crossings', () => {
  const m = FA.toAppMachine(regexToDfa('(0+1)*1(0+1)(0+1)', ['0', '1']));   // 8 states, dense
  const pos = autoLayout(m);
  for (const p of Object.values(pos)) { assert.ok(p.x >= 60 && p.x <= 1340); assert.ok(p.y >= 60 && p.y <= 840); }
  assert.ok(minSeparation(pos) >= 90, `min separation ${minSeparation(pos)}`);
  const chain = FA.toAppMachine(regexToDfa('abababab', ['a', 'b']));
  assert.equal(crossings(chain, autoLayout(chain)), 0);
  const trap = FA.toAppMachine(regexToDfa('ab', ['a', 'b']), { keepDead: true });
  const tp = autoLayout(trap);
  const deadId = trap.states.find(s => !s.accepting && !s.initial && trap.transitions.filter(t => t.from === s.id).every(t => t.to === s.id)).id;
  assert.ok(tp[deadId].y > 600, 'trap state goes to the bottom');
});

test('diagnosis: correct machine', () => {
  const target = regexToDfa('(a+b)*b', ['a', 'b']);
  const m = { type: 'DFA', states: [{ id: 'A', initial: true }, { id: 'B', accepting: true }],
    transitions: [{ from: 'A', to: 'A', symbol: 'a' }, { from: 'A', to: 'B', symbol: 'b' }, { from: 'B', to: 'B', symbol: 'b' }, { from: 'B', to: 'A', symbol: 'a' }] };
  const r = diagnose(m, target);
  assert.equal(r.correct, true);
  assert.equal(r.hints.at(-1).level, 'success');
});

test('diagnosis: wrong accepting flag is pinpointed with a witness', () => {
  const target = regexToDfa('(a+b)*b', ['a', 'b']);
  const m = { type: 'DFA', states: [{ id: 'A', initial: true, accepting: true }, { id: 'B', accepting: true }],
    transitions: [{ from: 'A', to: 'A', symbol: 'a' }, { from: 'A', to: 'B', symbol: 'b' }, { from: 'B', to: 'B', symbol: 'b' }, { from: 'B', to: 'A', symbol: 'a' }] };
  const r = diagnose(m, target);
  assert.equal(r.correct, false);
  assert.ok(r.hints.some(h => /A is marked accepting, but "ε"/.test(h.message)), JSON.stringify(r.hints));
});

test('diagnosis: a state doing two jobs is found with a distinguishing string', () => {
  const target = regexToDfa('(a+b)*ab', ['a', 'b']);   // needs 3 states
  const m = { type: 'DFA', states: [{ id: 'P', initial: true }, { id: 'Q', accepting: true }],
    transitions: [{ from: 'P', to: 'P', symbol: 'a' }, { from: 'P', to: 'Q', symbol: 'b' }, { from: 'Q', to: 'P', symbol: 'a' }, { from: 'Q', to: 'P', symbol: 'b' }] };
  const r = diagnose(m, target);
  const two = r.hints.find(h => /two different situations/.test(h.message));
  assert.ok(two, JSON.stringify(r.hints, null, 1));
  assert.ok(two.states.includes('P') || two.states.includes('Q'));
});

test('diagnosis: missing transitions → counterexample with the stuck point', () => {
  const target = regexToDfa('a*', ['a']);
  const m = { type: 'DFA', states: [{ id: 'S', initial: true, accepting: true }], transitions: [] };
  const r = diagnose(m, target);
  assert.ok(r.hints.some(h => /Rejects "a".*no move on 'a' from S/.test(h.message)), JSON.stringify(r.hints));
});

test('guided mode: only certain mistakes, plus progress and a next step', () => {
  const target = regexToDfa('(a+b)*ab', ['a', 'b']);
  const step1 = { type: 'DFA', states: [{ id: 'q0', initial: true }], transitions: [] };
  let r = diagnose(step1, target, { mode: 'guided' });
  assert.ok(!r.hints.some(h => h.level === 'error'));
  assert.ok(r.hints.some(h => /1\/3 required states/.test(h.message) && /Next:/.test(h.message)), JSON.stringify(r.hints));
  const step2 = { type: 'DFA', states: [{ id: 'q0', initial: true }, { id: 'q1', accepting: true }], transitions: [{ from: 'q0', to: 'q1', symbol: 'a' }] };
  r = diagnose(step2, target, { mode: 'guided' });
  assert.ok(r.hints.some(h => /q1 should|q1 is marked accepting/.test(h.message)), JSON.stringify(r.hints));
});

test('trace follows the drawn machine', () => {
  const m = { states: [{ id: 'x', initial: true }, { id: 'y', accepting: true }], transitions: [{ from: 'x', to: 'y', symbol: 'a,b' }] };
  assert.deepEqual(trace(m, ['b']).path, ['x', 'y']);
  assert.equal(trace(m, ['b', 'a']).stuck, true);
});
