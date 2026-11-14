import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as FA from '../src/core/fa.js';
import { parseDescription } from '../src/core/nl.js';

const model = JSON.parse(readFileSync(new URL('../src/core/nl-model.json', import.meta.url)));
const cnt = (w, c) => [...w].filter(x => x === c).length;
const bin = (w) => (w.length ? parseInt(w, 2) : 0);

// [description, alphabet, predicate]  — predicate checked on every string up to length 7.
export const CASES = [
  ['strings over {a,b} ending with ab', 'ab', w => w.endsWith('ab')],
  ['all strings that start with a', 'ab', w => w.startsWith('a')],
  ['binary strings that end in 01', '01', w => w.endsWith('01')],
  ['strings over {a,b} containing the substring aba', 'ab', w => w.includes('aba')],
  ['strings that do not contain aa', 'ab', w => !w.includes('aa')],
  ['strings with no two consecutive b', 'ab', w => !w.includes('bb')],
  ['binary strings with no two consecutive 1s', '01', w => !w.includes('11')],
  ['strings over {a,b} with an even number of a', 'ab', w => cnt(w, 'a') % 2 === 0],
  ["strings with an odd number of b's", 'ab', w => cnt(w, 'b') % 2 === 1],
  ['binary strings with even number of 0s and odd number of 1s', '01', w => cnt(w, '0') % 2 === 0 && cnt(w, '1') % 2 === 1],
  ['strings of even length', 'ab', w => w.length % 2 === 0],
  ['strings over {a,b} of odd length', 'ab', w => w.length % 2 === 1],
  ['strings whose length is divisible by 3', 'ab', w => w.length % 3 === 0],
  ['strings of length at least 3', 'ab', w => w.length >= 3],
  ['strings of length at most 2', 'ab', w => w.length <= 2],
  ['strings of length exactly 4', 'ab', w => w.length === 4],
  ['strings with at least two a', 'ab', w => cnt(w, 'a') >= 2],
  ["strings containing exactly one b", 'ab', w => cnt(w, 'b') === 1],
  ['strings with at most one a', 'ab', w => cnt(w, 'a') <= 1],
  ['strings where the number of a is divisible by 3', 'ab', w => cnt(w, 'a') % 3 === 0],
  ['strings over {a,b} with an a somewhere before a b', 'ab', w => /a.*b/.test(w)],
  ['strings where some b comes before some a', 'ab', w => /b.*a/.test(w)],
  ['binary strings where a 1 is followed later by a 0', '01', w => /1.*0/.test(w)],
  ['strings that contain either aa or bb', 'ab', w => w.includes('aa') || w.includes('bb')],
  ['only the strings ab, ba and aab', 'ab', w => ['ab', 'ba', 'aab'].includes(w)],
  ['DFA for L = (a+b)*abb', 'ab', w => w.endsWith('abb')],
  ['strings where the last symbol is not 0', '01', w => w.endsWith('1')],
  ['strings that start and end with a over {a,b}', 'ab', w => w.startsWith('a') && w.endsWith('a')],
  ['binary numbers divisible by 3', '01', w => bin(w) % 3 === 0   /* textbook: ε is value 0 */],
  ['binary strings divisible by 5', '01', w => bin(w) % 5 === 0],
  ['strings that start with a and end with b', 'ab', w => w.startsWith('a') && w.endsWith('b')],
  ['strings that start with 1 or end with 0', '01', w => w.startsWith('1') || w.endsWith('0')],
  ['strings that start and end with the same symbol', 'ab', w => w.length > 0 && w[0] === w[w.length - 1]],
  ['strings that begin and end with different letters', 'ab', w => w.length > 0 && w[0] !== w[w.length - 1]],
  ['the second symbol from the end is 1', '01', w => w.length >= 2 && w[w.length - 2] === '1'],
  ['strings over {0,1} where the third symbol from the right is 0', '01', w => w.length >= 3 && w[w.length - 3] === '0'],
  ['strings whose second symbol is b', 'ab', w => w.length >= 2 && w[1] === 'b'],
  ['every a is immediately followed by b', 'ab', w => !/a(?!b)/.test(w)],
  ['strings that contain 101 but do not end with 1', '01', w => w.includes('101') && !w.endsWith('1')],
  ['strings that do not start with ab', 'ab', w => !w.startsWith('ab')],
  ['strings that contain both aa and bb', 'ab', w => w.includes('aa') && w.includes('bb')],
  ['strings that contain aa or bb', 'ab', w => w.includes('aa') || w.includes('bb')],
  ['strings over {a,b,c} containing abc', 'abc', w => w.includes('abc')],
  ['strings over {a,b} with even number of a and ending in b', 'ab', w => cnt(w, 'a') % 2 === 0 && w.endsWith('b')],
  ['binary strings with at least three 1s', '01', w => cnt(w, '1') >= 3],
  ['strings having the substring 0011', '01', w => w.includes('0011')],
  ['strings with prefix ba', 'ab', w => w.startsWith('ba')],
  ['strings with suffix abb', 'ab', w => w.endsWith('abb')],
  ["the number of b's is a multiple of 4", 'ab', w => cnt(w, 'b') % 4 === 0],
  ['strings with length greater than 2', 'ab', w => w.length > 2],
  ['strings with fewer than 3 a', 'ab', w => cnt(w, 'a') < 3],
  ['all strings over {a,b}', 'ab', () => true],
  ["strings in which every 0 is followed by 1", '01', w => !/0(?!1)/.test(w)],
  ['strings with no three consecutive a', 'ab', w => !w.includes('aaa')],
  ['strings that contain at least one a and at least one b', 'ab', w => w.includes('a') && w.includes('b')],
  ['strings ending in 00 or 11', '01', w => w.endsWith('00') || w.endsWith('11')],
  ['accept strings that start with 01', '01', w => w.startsWith('01')],
  ['strings over {a,b} such that number of a mod 3 is 1', 'ab', w => cnt(w, 'a') % 3 === 1],
  ['strings whose length leaves remainder 2 when divided by 3', 'ab', w => w.length % 3 === 2],
  ['the string is exactly aba', 'ab', w => w === 'aba'],
  ['strings that do not end with ba', 'ab', w => !w.endsWith('ba')],
  ['strings where every b is followed by a', 'ab', w => !/b(?!a)/.test(w)],
  ["strings that have exactly two 1's", '01', w => cnt(w, '1') === 2],
];

const words = (alphabet, maxLen) => {
  const out = [''];
  for (let i = 0; i < out.length; i++) if (out[i].length < maxLen) for (const a of alphabet) out.push(out[i] + a);
  return out;
};

test('English descriptions produce exactly the right DFA', () => {
  const failures = [];
  for (const [desc, sigma, pred] of CASES) {
    const r = parseDescription(desc, model);
    if (!r.ok) { failures.push(`${desc}: ${r.problems.join('; ')}`); continue; }
    if (r.alphabet.join('') !== sigma) { failures.push(`${desc}: alphabet ${r.alphabet} (want ${sigma}) — ${r.explanation}`); continue; }
    const bad = words(sigma, 7).find(w => FA.accepts(r.dfa, w) !== !!pred(w));
    if (bad !== undefined) failures.push(`${desc}: wrong on "${bad}" — read as: ${r.explanation}`);
  }
  assert.equal(failures.length, 0, `\n${failures.join('\n')}\n(${CASES.length - failures.length}/${CASES.length} correct)`);
});

test('nonsense is reported, not guessed', () => {
  const r = parseDescription('please make it look pretty', model);
  assert.equal(r.ok, false);
  assert.ok(r.problems.length > 0);
});

test('explicit alphabet is enforced', () => {
  const r = parseDescription('strings over {a,b} containing c', model);
  assert.ok(!r.ok || r.problems.some(p => /not in the alphabet/.test(p)));
});
