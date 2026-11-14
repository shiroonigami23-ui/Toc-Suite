// Fresh phrasings written after the model and rules were tuned on nl.test.mjs.
// Reported as a score; must stay at or above the floor below.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as FA from '../core/fa.js';
import { parseDescription } from '../core/nl.js';

const model = JSON.parse(readFileSync(new URL('../core/nl-model.json', import.meta.url)));
const cnt = (w, c) => [...w].filter(x => x === c).length;

const UNSEEN = [
  ['Design a DFA that accepts all strings over {0,1} ending with 11', '01', w => w.endsWith('11')],
  ['L = { w in {a,b}* : w begins with b }', 'ab', w => w.startsWith('b')],
  ['construct a dfa accepting binary strings having 010 as a substring', '01', w => w.includes('010')],
  ['strings over {a,b} in which aab never appears', 'ab', w => !w.includes('aab')],
  ['words over a and b with an even count of b', 'ab', w => cnt(w, 'b') % 2 === 0],
  ['binary strings whose length is a multiple of 3', '01', w => w.length % 3 === 0],
  ['strings over {a,b} that have at least 2 b', 'ab', w => cnt(w, 'b') >= 2],
  ['strings with no more than two a', 'ab', w => cnt(w, 'a') <= 2],
  ['binary strings representing multiples of 4', '01', w => w.length > 0 && parseInt(w, 2) % 4 === 0],
  ['strings where the 2nd last symbol is a', 'ab', w => w.length >= 2 && w[w.length - 2] === 'a'],
  ['the first symbol is 0 and the last symbol is 1', '01', w => w.startsWith('0') && w.endsWith('1')],
  ['strings that begin with ab or end with ba', 'ab', w => w.startsWith('ab') || w.endsWith('ba')],
  ['strings over {a,b} which contain abab', 'ab', w => w.includes('abab')],
  ['strings with exactly 3 a', 'ab', w => cnt(w, 'a') === 3],
  ['all binary strings of length 2', '01', w => w.length === 2],
  ['binary strings with odd number of 1s', '01', w => cnt(w, '1') % 2 === 1],
  ['strings not ending in b', 'ab', w => !w.endsWith('b')],
  ['strings having suffix 10 and prefix 1', '01', w => w.endsWith('10') && w.startsWith('1')],
  ['strings where each a is followed by b', 'ab', w => !/a(?!b)/.test(w)],
  ['strings over {a,b} of length less than 3', 'ab', w => w.length < 3],
  ['binary strings that contain 00 and do not contain 11', '01', w => w.includes('00') && !w.includes('11')],
  ['strings that start with the same symbol they end with', 'ab', w => w.length > 0 && w[0] === w[w.length - 1]],
  ['strings with at least one 1', '01', w => cnt(w, '1') >= 1],
  ['the language of all strings over {a,b} that end in aa', 'ab', w => w.endsWith('aa')],
  ['strings over {0,1} such that the number of 1s is divisible by 3', '01', w => cnt(w, '1') % 3 === 0],
];

const words = (alphabet, maxLen) => {
  const out = [''];
  for (let i = 0; i < out.length; i++) if (out[i].length < maxLen) for (const a of alphabet) out.push(out[i] + a);
  return out;
};

test('unseen phrasings', () => {
  const misses = [];
  for (const [desc, sigma, pred] of UNSEEN) {
    const r = parseDescription(desc, model);
    const ok = r.ok && r.alphabet.join('') === sigma && words(sigma, 7).every(w => FA.accepts(r.dfa, w) === !!pred(w));
    if (!ok) misses.push(`${desc} -> ${r.ok ? r.explanation : r.problems.join('; ')}`);
  }
  const score = (UNSEEN.length - misses.length) / UNSEEN.length;
  console.log(`unseen-phrasing accuracy: ${(score * 100).toFixed(0)}% (${UNSEEN.length - misses.length}/${UNSEEN.length})`);
  if (misses.length) console.log(misses.join('\n'));
  assert.ok(score >= 0.8, `accuracy ${score} below floor`);
});
