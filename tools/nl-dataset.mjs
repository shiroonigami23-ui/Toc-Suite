// Synthetic training data for the clause-intent classifier (core/nl.js).
// Each template is a phrasing a student or textbook might use. Slots are filled at random,
// filler prefixes/suffixes are added, so the model learns the *cue words*, not the slots.

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

const SUBJECT = ['', 'strings', 'all strings', 'the strings', 'words', 'binary strings', 'strings over {a,b}', 'strings over {0,1}',
  'the set of strings', 'language of all strings', 'all words', 'those strings', 'every string', 'the language', 'inputs', 'the string'];
const VERB_PREFIX = ['', 'that', 'which', 'whose', 'it', 'they', 'such that it', 'such that'];

export const TEMPLATES = {
  STARTS: ['start with {W}', 'starts with {W}', 'starting with {W}', 'begin with {W}', 'begins with {W}', 'beginning with {W}',
    'prefix {W}', 'having prefix {W}', 'with prefix {W}', 'whose prefix is {W}', 'first symbols are {W}', 'that start with the substring {W}',
    'start with a {W}', 'commence with {W}', 'starts from {W}', '{W} as a prefix', 'begin with the string {W}', 'do not start with {W}',
    'does not begin with {W}'],
  ENDS: ['end with {W}', 'ends with {W}', 'ending with {W}', 'ending in {W}', 'end in {W}', 'ends in {W}', 'suffix {W}', 'having suffix {W}',
    'with suffix {W}', 'whose suffix is {W}', 'last symbols are {W}', '{W} as a suffix', 'terminate with {W}', 'finishing with {W}',
    'finish with {W}', 'do not end with {W}', 'that does not end in {W}', 'end with the substring {W}'],
  CONTAINS: ['contain {W}', 'contains {W}', 'containing {W}', 'contain the substring {W}', 'contains substring {W}', 'having substring {W}',
    'have {W} as a substring', 'with substring {W}', '{W} appears somewhere', 'include {W}', 'includes {W}', 'has {W} in it',
    'contain at least one occurrence of {W}', 'somewhere contains {W}', 'have {W} somewhere', '{W} occurs as a substring', 'containing the pattern {W}'],
  NOT_CONTAINS: ['do not contain {W}', 'does not contain {W}', "don't contain {W}", "doesn't contain {W}", 'not containing {W}',
    'without {W}', 'without the substring {W}', 'avoid {W}', 'never contain {W}', 'contain no {W}', 'free of {W}', 'no occurrence of {W}',
    'not having {W} as a substring', '{W} never appears', '{W} does not appear', 'excluding substring {W}'],
  EXACT: ['exactly the string {W}', 'is exactly {W}', 'only the string {W}', 'equal to {W}', 'is {W}', 'just {W}', 'the single string {W}', 'consisting of exactly {W}'],
  LEN_EQ: ['length {N}', 'of length {N}', 'length exactly {N}', 'exactly {N} symbols long', 'length equal to {N}', 'have length {N}',
    'with exactly {N} symbols', 'whose length is {N}', 'are {N} characters long', 'size {N}', 'exactly {N} letters', 'of length equal to {N}'],
  LEN_GE: ['length at least {N}', 'at least {N} symbols long', 'length greater than {N}', 'length more than {N}', 'minimum length {N}',
    'length {N} or more', 'longer than {N}', 'have at least {N} symbols', 'whose length is at least {N}', 'of length at least {N}', 'length >= {N}'],
  LEN_LE: ['length at most {N}', 'at most {N} symbols long', 'length less than {N}', 'maximum length {N}', 'length {N} or less',
    'shorter than {N}', 'have at most {N} symbols', 'whose length is at most {N}', 'of length at most {N}', 'no longer than {N}', 'length <= {N}'],
  LEN_MOD: ['even length', 'odd length', 'of even length', 'of odd length', 'length is even', 'length is odd', 'length divisible by {N}',
    'length is a multiple of {N}', 'whose length is divisible by {N}', 'length mod {N} is {N}', 'length leaves remainder {N} when divided by {N}',
    'have an even length', 'have odd length', 'length congruent to {N} mod {N}', 'length multiple of {N}'],
  COUNT_MOD: ['even number of {C}', 'odd number of {C}', "an even number of {C}'s", "odd number of {C}'s", 'number of {C} is even',
    'number of {C} is odd', 'number of {C} divisible by {N}', 'number of {C}s is a multiple of {N}', 'count of {C} is even', '{C}s occur an even number of times',
    'even count of {C}', 'number of {C} mod {N} is {N}', 'number of {C} leaves remainder {N} when divided by {N}', 'even occurrences of {C}',
    'odd occurrences of {C}', "the number of {C}'s is divisible by {N}", 'have an even number of {C}'],
  COUNT_EQ: ['exactly {N} {C}', "exactly {N} {C}'s", 'exactly {N} occurrences of {C}', 'number of {C} is {N}', 'number of {C} equals {N}',
    'contain exactly {N} {C}s', 'have exactly {N} {C}', 'exactly one {C}', 'with exactly {N} {C}s', '{C} appears exactly {N} times', 'only one {C}'],
  COUNT_GE: ['at least {N} {C}', "at least {N} {C}'s", 'at least one {C}', 'at least {N} occurrences of {C}', 'number of {C} is at least {N}',
    'more than {N} {C}', 'minimum {N} {C}s', '{C} appears at least {N} times', 'contain at least {N} {C}s', 'have {N} or more {C}', 'contains at least one {C}'],
  COUNT_LE: ['at most {N} {C}', "at most {N} {C}'s", 'at most one {C}', 'no more than {N} {C}', 'number of {C} is at most {N}',
    'fewer than {N} {C}', 'less than {N} {C}s', 'maximum {N} {C}s', '{C} appears at most {N} times', 'have {N} or fewer {C}'],
  NTH_END: ['{O} symbol from the end is {C}', '{O} symbol from the right is {C}', '{O} last symbol is {C}', '{O} from last is {C}',
    'the {O} last character is {C}', '{C} in the {O} position from the end', '{O} from the end is a {C}', 'second last symbol is {C}',
    'the {O} symbol from the right end is {C}', 'symbol at position {N} from the end is {C}'],
  NTH_START: ['{O} symbol is {C}', 'the {O} symbol is {C}', '{O} character is {C}', '{O} letter is {C}', '{C} in the {O} position',
    'the {O} symbol from the left is {C}', 'symbol at position {N} is {C}', '{O} symbol from the start is {C}', 'has {C} as its {O} symbol'],
  DIVISIBLE: ['divisible by {N}', 'binary number divisible by {N}', 'represent numbers divisible by {N}', 'value is divisible by {N}',
    'multiple of {N}', 'binary representation of a multiple of {N}', 'decimal value divisible by {N}', 'interpreted as binary is divisible by {N}',
    'number mod {N} is {N}', 'value mod {N} equals {N}', 'leaves remainder {N} when divided by {N}', 'numbers that are multiples of {N}',
    'binary numbers divisible by {N}', 'integer value divisible by {N}', 'divisible by {N} when read as a binary number'],
  SAME_ENDS: ['start and end with the same symbol', 'begin and end with the same letter', 'first and last symbols are the same',
    'first symbol equals last symbol', 'same first and last symbol', 'starts and ends with same character', 'begin and end with same symbol'],
  DIFF_ENDS: ['start and end with different symbols', 'begin and end with different letters', 'first and last symbols differ',
    'first and last symbols are different', 'different first and last symbol', 'starts and ends with different characters'],
  FOLLOWED: ['every {C} is followed by {D}', 'each {C} is immediately followed by a {D}', 'every {C} is immediately followed by {D}',
    'any {C} must be followed by {D}', 'after every {C} comes a {D}', 'each {C} followed by {D}', 'every occurrence of {C} is followed by {D}'],
  NO_CONSEC: ['no two consecutive {C}', "no two consecutive {C}'s", 'no consecutive {C}s', 'never two {C} in a row', 'no {N} consecutive {C}',
    'do not have two adjacent {C}', 'no adjacent {C}s', 'without consecutive {C}', '{C}s are never adjacent', 'no three consecutive {C}s',
    'no run of {N} {C}s'],
  SUBSEQ: ['some {C} appears before some {D}', 'contains {C} followed later by {D}', 'a {C} that comes somewhere before a {D}',
    '{C} eventually followed by {D}', 'has {C} and later {D}', 'contains the subsequence {C}{D}', 'an {C} occurs before a {D}',
    'has a {C} with a {D} somewhere after it'],
  ALL: ['all strings', 'every string', 'any string', 'all possible strings', 'sigma star', 'all words over the alphabet', 'accept everything'],
  NONE: ['no strings', 'empty language', 'accept nothing', 'reject everything', 'the empty set', 'no string at all'],
  FILLER: ['strings over {a,b}', 'over the alphabet {0,1}', 'binary strings', 'the language', 'design a dfa', 'construct a dfa for', 'dfa accepting',
    'build an automaton', 'the set of all strings', 'strings', 'words', 'over a and b', 'language l', 'given alphabet', 'draw a dfa',
    'make a dfa', 'a minimal dfa', 'accepting the language', 'the alphabet is {a,b,c}', 'over sigma', 'inputs', 'recognize', 'for the language of',
    'create a machine', 'the automaton should accept'],
};

const NUMS = ['2', '3', '4', '5', 'two', 'three', 'one', '1', '0', '6', 'four', '7', 'five'];
const ORDS = ['second', 'third', '2nd', '3rd', 'first', 'fourth', '4th', '5th', 'fifth'];
const SYMS = ['a', 'b', '0', '1', 'c'];
const WORDS = ['ab', 'ba', 'aba', 'abb', '01', '10', '101', '110', 'aa', 'bb', '00', '11', 'abab', 'a', 'b', '0', '1', '001', 'bab', "'ab'", "'101'", '"aab"', "'0'"];

export function generate(perTemplate = 18, seed = 7) {
  let s = seed >>> 0;
  const rng = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const data = [];
  for (const [intent, temps] of Object.entries(TEMPLATES)) {
    for (const t of temps) {
      for (let i = 0; i < perTemplate; i++) {
        let body = t.replace(/\{W\}/g, () => pick(rng, WORDS)).replace(/\{C\}/g, () => pick(rng, SYMS)).replace(/\{D\}/g, () => pick(rng, SYMS))
          .replace(/\{N\}/g, () => pick(rng, NUMS)).replace(/\{O\}/g, () => pick(rng, ORDS));
        const r = rng();
        if (intent !== 'FILLER' && r < 0.55) body = [pick(rng, SUBJECT), pick(rng, VERB_PREFIX), body].filter(Boolean).join(' ');
        else if (intent !== 'FILLER' && r < 0.7) body = `${pick(rng, ['accept', 'accepts', 'accepting', 'recognize', 'recognizes'])} strings ${pick(rng, ['that', 'which', ''])} ${body}`;
        if (rng() < 0.1) body = body.toUpperCase();
        data.push({ text: body.replace(/\s+/g, ' ').trim(), intent });
      }
    }
  }
  return data;
}
