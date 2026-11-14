// core/nl.js — English description → exact minimal DFA.
//
// Pipeline:
//   1. alphabet detection ("over {a,b}", "binary", ...)
//   2. split into clauses on and / or / but / with / that ... (or binds loosest)
//   3. each clause → intent by a small trained classifier (logistic regression over word
//      uni/bigrams, weights in nl-model.json, trained by tools/train-nl-model.mjs)
//   4. slots (strings, symbols, numbers) extracted by rules
//   5. each clause → exact DFA; clauses combined with product constructions; minimised.
// The classifier only decides *what kind* of condition a clause is; the automaton itself
// is always built exactly, so the result is correct whenever the reading is.

import * as FA from './fa.js';

export const INTENTS = [
  'STARTS', 'ENDS', 'CONTAINS', 'NOT_CONTAINS', 'EXACT',
  'LEN_EQ', 'LEN_GE', 'LEN_LE', 'LEN_MOD',
  'COUNT_MOD', 'COUNT_EQ', 'COUNT_GE', 'COUNT_LE',
  'NTH_END', 'NTH_START', 'DIVISIBLE', 'SAME_ENDS', 'DIFF_ENDS',
  'FOLLOWED', 'NO_CONSEC', 'ALL', 'NONE', 'FILLER',
];

const NUM_WORDS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, once: 1, twice: 2, thrice: 3, single: 1 };
const ORDINALS = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, last: 1 };

// ------------------------------------------------------------------ text normalisation

/** Lower-case, unify quotes and symbols, keep braces for alphabet parsing. */
export function clean(text) {
  return String(text)
    .toLowerCase()
    .replace(/[“”‘’`]/g, "'")
    .replace(/σ|∑/g, 'sigma')
    .replace(/≥|>=/g, ' at least ')
    .replace(/≤|<=/g, ' at most ')
    .replace(/≡/g, ' mod ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokens for the classifier: numbers → NUM, ordinals → ORD, short symbol strings → SYM. */
export function featureTokens(clause) {
  const raw = clean(clause)
    .replace(/'([^']*)'|"([^"]*)"/g, ' SYM ')
    .replace(/\b(\w)'s\b/g, ' $1 s ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(' ').filter(Boolean);
  return raw.map(t => {
    if (t === 'SYM' || t === 'sym') return 'SYM';
    if (/^\d+$/.test(t) && t.length > 1 && /^[01]+$/.test(t)) return 'SYM';
    if (/^\d+(st|nd|rd|th)$/.test(t) || t in ORDINALS) return 'ORD';
    if (/^\d+$/.test(t)) return 'NUM';
    if (t in NUM_WORDS) return 'NUM';
    if (/^[abc01]{1,6}$/.test(t)) return 'SYM';
    if (/^[abc01]+s$/.test(t) && t.length <= 3) return 'SYM';   // "as", "bs", "0s", "1s"
    return t;
  });
}

export function features(clause) {
  const t = featureTokens(clause);
  const f = new Set();
  for (let i = 0; i < t.length; i++) {
    f.add('u:' + t[i]);
    if (i + 1 < t.length) f.add('b:' + t[i] + '_' + t[i + 1]);
  }
  f.add('len:' + Math.min(t.length, 8));
  return [...f];
}

// ------------------------------------------------------------------ classifier

export function predict(model, clause) {
  const feats = features(clause);
  const k = model.intents.length;
  const z = [...model.bias];
  for (const f of feats) {
    const w = model.weights[f];
    if (!w) continue;
    for (const [j, v] of w) z[j] += v;
  }
  const m = Math.max(...z);
  const e = z.map(v => Math.exp(v - m));
  const s = e.reduce((a, b) => a + b, 0);
  const p = e.map(v => v / s);
  let best = 0;
  for (let j = 1; j < k; j++) if (p[j] > p[best]) best = j;
  const ranked = p.map((v, j) => [model.intents[j], v]).sort((a, b) => b[1] - a[1]);
  return { intent: model.intents[best], confidence: p[best], ranked };
}

// ------------------------------------------------------------------ alphabet + splitting

export function detectAlphabet(text) {
  const t = clean(text);
  // Innermost {...} groups; the alphabet is the one made of short comma-separated symbols
  // (so set-builder notation like { w in {a,b}* : ... } works).
  for (const m of t.matchAll(/\{([^{}]*)\}/g)) {
    const syms = m[1].split(/[\s,]+/).map(s => s.replace(/['"]/g, '')).filter(Boolean);
    if (syms.length >= 1 && syms.every(s => s.length <= 3 && /^[a-z0-9]+$/.test(s)) && /,|^\s*\S+\s*$/.test(m[1])) {
      return { alphabet: [...new Set(syms)].sort(), explicit: true };
    }
  }
  const over = t.match(/(?:over|alphabet|sigma\s*=?)\s+(?:the\s+)?(?:alphabet\s+)?([a-z0-9](?:\s*(?:,|and)\s*[a-z0-9])+)/);
  if (over) return { alphabet: [...new Set(over[1].split(/\s*(?:,|and)\s*/))].sort(), explicit: true };
  if (/\bbinary\b|\bbits?\b|\b0s and 1s\b/.test(t)) return { alphabet: ['0', '1'], explicit: true };
  if (/\bdecimal\b|\bdigits\b/.test(t)) return { alphabet: '0123456789'.split(''), explicit: true };
  if (/\bternary\b/.test(t)) return { alphabet: ['0', '1', '2'], explicit: true };
  return { alphabet: null, explicit: false };
}

const SPLIT_AND = /\s*(?:,|;|\band also\b|\band\b|\bbut\b|\bwith\b|\bwhich\b|\bthat\b|\bsuch that\b|\bwhere\b|\bwhose\b|\bhaving\b|\bwhile\b|\bin which\b|\bplus\b)\s*/;

// Phrases whose "with"/"and" must not be treated as clause boundaries.
const PROTECT = [
  [/\b(start|starts|starting|begin|begins|beginning|end|ends|ending|finish|finishes|finishing|terminate|terminates|terminating|commence|commences|prefixed|suffixed|filled) with\b/g, '$1_WITH'],
  [/\b(start|starts|starting|begin|begins|beginning)( |_)and (end|ends|ending)\b/g, '$1_AND_$3'],
  [/\bfirst and last\b/g, 'first_AND_last'],
  [/\b(0s|1s|a's|b's|as|bs) and (0s|1s|a's|b's|as|bs)\b/g, '$1_AND_$2'],
];

/** Returns disjuncts → conjuncts: [[clause, clause], [clause]]. */
export function splitClauses(text) {
  let t = clean(text)
    .replace(/\b[a-z]\s+in\s+\{[^{}]*\}\s*\*?/g, ' ')   // set-builder: "w in {a,b}*"
    .replace(/\{([^{}]*)\}\*?/g, (m, inner) => (/^\s*[a-z0-9'"]{1,3}(\s*,\s*[a-z0-9'"]{1,3})*\s*$/.test(inner) ? ' ALPHA ' : ` , ${inner} , `))
    .replace(/[{}:|]/g, ' , ').replace(/\bl\s*=\s*/g, ' ');
  const quoted = [];
  t = t.replace(/'[^']*'|"[^"]*"/g, m => { quoted.push(m); return ` Q${quoted.length - 1}Q `; });
  for (const [re, rep] of PROTECT) t = t.replace(re, rep);
  const restore = s => s.replace(/Q(\d+)Q/g, (_, i) => quoted[+i]).replace(/_WITH/g, ' with').replace(/_AND_/g, ' and ')
    .replace(/\bALPHA\b/g, '').replace(/\s+/g, ' ').trim();
  return t.split(/\s*\bor\b\s*/).map(part => part.replace(/\beither\b/g, ' ')
    .split(SPLIT_AND).map(restore).filter(c => c.length > 0));
}

// ------------------------------------------------------------------ slot extraction

function numberIn(text, which = 0) {
  const nums = [];
  const re = /\b(\d+|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|once|twice|thrice|single)\b/g;
  let m;
  while ((m = re.exec(text))) nums.push(/^\d+$/.test(m[1]) ? +m[1] : NUM_WORDS[m[1]]);
  return nums.length > which ? nums[which] : null;
}

function ordinalIn(text) {
  const m = text.match(/\b(\d+)(?:st|nd|rd|th)\b/) || text.match(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|last)\b/);
  if (!m) return null;
  return /^\d+$/.test(m[1]) ? +m[1] : ORDINALS[m[1]];
}

const ARTICLE_NEXT = new Set(['string', 'strings', 'substring', 'symbol', 'letter', 'number', 'multiple', 'length', 'word', 'single',
  'total', 'prefix', 'suffix', 'sequence', 'binary', 'decimal', 'even', 'odd', 'minimum', 'maximum', 'remainder', 'run', 'block', 'pair', 'count']);

/** Candidate strings over the alphabet mentioned in the clause, in order. */
function stringsIn(text, alphabet) {
  const out = [];
  const q = /'([^']*)'|"([^"]*)"/g;
  let m;
  while ((m = q.exec(text))) out.push(m[1] ?? m[2]);
  if (out.length) return out;
  const sigma = new Set(alphabet);
  const words = text.replace(/[^a-z0-9 ]/g, ' ').split(' ').filter(Boolean);
  words.forEach((w, i) => {
    if (w === 'a' && ARTICLE_NEXT.has(words[i + 1])) return;   // the English article
    const toks = FA.tokens(w, alphabet);
    if (toks.length && toks.every(x => sigma.has(x))) out.push(w);
  });
  return out;
}

/** Symbol counted in "number of a's", "even 0s", "occurrences of b". */
function countedSymbol(text, alphabet) {
  const sigma = new Set(alphabet);
  const pats = [/(?:number of|no\. of|count of|occurrences? of|many|no of)\s+'?([a-z0-9])'?(?:'?s)?\b/, /\b([a-z0-9])'?s\b/, /'([a-z0-9])'/, /\b(?:the symbol|symbol|letter)\s+([a-z0-9])\b/];
  for (const p of pats) {
    const m = text.match(p);
    if (m && sigma.has(m[1])) return m[1];
  }
  const sym = stringsIn(text, alphabet).find(s => s.length === 1 && sigma.has(s) && s !== 'a');
  if (sym) return sym;
  return stringsIn(text, alphabet).find(s => s.length === 1 && sigma.has(s)) || null;
}

function modSlots(text) {
  if (/\beven\b/.test(text)) return { k: 2, r: 0 };
  if (/\bodd\b/.test(text)) return { k: 2, r: 1 };
  const rem = text.match(/remainder (?:of )?(\d+|\w+)(?: when divided by| mod| modulo| on division by)? (\d+|\w+)/);
  if (rem) return { k: toNum(rem[2]), r: toNum(rem[1]) };
  const modEq = text.match(/mod(?:ulo)? (\d+)\s*(?:is|=|equals?|equal to|==)?\s*(\d+)/);
  if (modEq) return { k: +modEq[1], r: +modEq[2] };
  const eqMod = text.match(/(?:is|=|equals?|congruent to)\s*(\d+)\s*\(?\s*mod(?:ulo)? (\d+)/);
  if (eqMod) return { k: +eqMod[2], r: +eqMod[1] };
  const div = text.match(/(?:divisible by|multiple of|multiples of|divided by) (\d+|\w+)/);
  if (div) return { k: toNum(div[1]), r: 0 };
  const k = numberIn(text);
  return k ? { k, r: 0 } : null;
}

function toNum(s) { return /^\d+$/.test(s) ? +s : NUM_WORDS[s] ?? null; }

function negated(text) {
  return /\b(not|never|no longer|isn't|doesn't|don't|does not|do not|cannot|can't|without|fails? to)\b/.test(text);
}

// ------------------------------------------------------------------ primitive DFAs

const D = (alphabet, n, start, accept, fn) => ({
  alphabet, start, accept: Array.from({ length: n }, (_, q) => accept(q)),
  delta: Array.from({ length: n }, (_, q) => alphabet.map(a => fn(q, a))),
});

/** KMP-style automaton tracking the longest suffix that is a prefix of w (states 0..|w|). */
function patternDfa(alphabet, w, mode) {
  const m = w.length;
  const step = (q, a) => {
    if (q === m && mode !== 'ends') return m;  // absorbing once found (contains / starts)
    let s = (w.slice(0, q) + a);
    for (let len = Math.min(m, s.length); len >= 0; len--) if (w.startsWith(s.slice(s.length - len))) return len;
    return 0;
  };
  return D(alphabet, m + 1, 0, q => q === m, step);
}

export function primitiveDfa(intent, s, alphabet) {
  const A = alphabet;
  switch (intent) {
    case 'STARTS': {
      const w = s.w, m = w.length;           // states 0..m, m+1 = dead
      return D(A, m + 2, 0, q => q === m, (q, a) => (q === m ? m : q === m + 1 ? m + 1 : a === w[q] ? q + 1 : m + 1));
    }
    case 'ENDS': return patternDfa(A, s.w, 'ends');
    case 'CONTAINS': return patternDfa(A, s.w, 'contains');
    case 'NOT_CONTAINS': return FA.complement(patternDfa(A, s.w, 'contains'));
    case 'NO_CONSEC': return FA.complement(patternDfa(A, s.c.repeat(s.n || 2), 'contains'));
    case 'EXACT': {
      const w = s.w, m = w.length;
      return D(A, m + 2, 0, q => q === m, (q, a) => (q < m && a === w[q] ? q + 1 : m + 1));
    }
    case 'LEN_EQ': case 'LEN_GE': case 'LEN_LE': {
      const n = s.n, cap = n + 1;
      const ok = intent === 'LEN_EQ' ? q => q === n : intent === 'LEN_GE' ? q => q >= n : q => q <= n;
      return D(A, cap + 1, 0, ok, q => Math.min(q + 1, cap));
    }
    case 'LEN_MOD': return D(A, s.k, 0, q => q === s.r % s.k, q => (q + 1) % s.k);
    case 'COUNT_MOD': return D(A, s.k, 0, q => q === s.r % s.k, (q, a) => (a === s.c ? (q + 1) % s.k : q));
    case 'COUNT_EQ': case 'COUNT_GE': case 'COUNT_LE': {
      const n = s.n, cap = n + 1;
      const ok = intent === 'COUNT_EQ' ? q => q === n : intent === 'COUNT_GE' ? q => q >= n : q => q <= n;
      return D(A, cap + 1, 0, ok, (q, a) => (a === s.c ? Math.min(q + 1, cap) : q));
    }
    case 'NTH_END': {
      // remember the last n symbols as a bitmask over "is it c?"
      const n = s.n, size = 1 << n;
      // state = (bits, filled) encoded; filled saturates at n
      const enc = (bits, f) => f * size + bits;
      return D(A, size * (n + 1), 0, q => Math.floor(q / size) === n && ((q % size) >> (n - 1)) & 1,
        (q, a) => {
          const bits = q % size, f = Math.floor(q / size);
          return enc(((bits << 1) | (a === s.c ? 1 : 0)) & (size - 1), Math.min(f + 1, n));
        });
    }
    case 'NTH_START': {
      const n = s.n;                          // states 0..n-1 counting, n = accept-sink, n+1 = dead
      return D(A, n + 2, 0, q => q === n, (q, a) => (q >= n ? q : q === n - 1 ? (a === s.c ? n : n + 1) : q + 1));
    }
    case 'DIVISIBLE': {
      const base = s.base || A.length, k = s.k;
      const digits = new Map(A.map((a, i) => [a, /^\d$/.test(a) ? +a : i]));
      // state k = empty string (not a number) -> reject, then value mod k
      return D(A, k + 1, k, q => q === (s.r ?? 0) % k, (q, a) => (((q === k ? 0 : q) * base + digits.get(a)) % k));
    }
    case 'SAME_ENDS': case 'DIFF_ENDS': {
      // 0 = start; 1+2i = first was a_i & last == a_i; 2+2i = first a_i & last != a_i
      const same = intent === 'SAME_ENDS';
      return D(A, 1 + 2 * A.length, 0,
        q => q !== 0 && (same ? (q - 1) % 2 === 0 : (q - 1) % 2 === 1),
        (q, a) => {
          const j = A.indexOf(a);
          if (q === 0) return 1 + 2 * j;
          const first = Math.floor((q - 1) / 2);
          return 1 + 2 * first + (A[first] === a ? 0 : 1);
        });
    }
    case 'FOLLOWED': {
      // every c is immediately followed by d: 0 ok, 1 just saw c (need d), 2 dead
      return D(A, 3, 0, q => q === 0, (q, a) => (q === 2 ? 2 : q === 1 ? (a === s.d ? (a === s.c ? 1 : 0) : 2) : (a === s.c ? 1 : 0)));
    }
    case 'ALL': return D(A, 1, 0, () => true, () => 0);
    case 'NONE': return D(A, 1, 0, () => false, () => 0);
    default: throw new Error('no builder for ' + intent);
  }
}

// ------------------------------------------------------------------ slots per intent

function slotsFor(intent, clause, alphabet) {
  const strs = stringsIn(clause, alphabet);
  const word = strs.find(s => s.length >= 1);
  switch (intent) {
    case 'STARTS': case 'ENDS': case 'CONTAINS': case 'NOT_CONTAINS': case 'EXACT':
      return word !== undefined ? { w: word } : null;
    case 'LEN_EQ': case 'LEN_GE': case 'LEN_LE': {
      let n = numberIn(clause);
      if (n === null) return null;
      if (/\b(more|greater|longer) than\b/.test(clause) && !/\b(no|not) (more|greater|longer) than\b/.test(clause)) n += 1;
      if (/\b(less|fewer|shorter) than\b/.test(clause) && !/\b(no|not) (less|fewer|shorter) than\b/.test(clause)) n -= 1;
      return n >= 0 ? { n } : null;
    }
    case 'LEN_MOD': return modSlots(clause);
    case 'COUNT_MOD': { const c = countedSymbol(clause, alphabet); const m = modSlots(clause); return c && m ? { c, ...m } : null; }
    case 'COUNT_EQ': case 'COUNT_GE': case 'COUNT_LE': {
      const c = countedSymbol(clause, alphabet);
      let n = numberIn(clause.replace(/\b[01]'?s\b/g, ' '));
      if (n === null && /\b(an?|one|single)\b/.test(clause)) n = 1;
      if (c === null || n === null) return null;
      if (/\b(more|greater) than\b/.test(clause) && !/\b(no|not) (more|greater) than\b/.test(clause)) n += 1;
      if (/\b(less|fewer) than\b/.test(clause) && !/\b(no|not) (less|fewer) than\b/.test(clause)) n -= 1;
      return n >= 0 ? { c, n } : null;
    }
    case 'NTH_END': case 'NTH_START': {
      const n = ordinalIn(clause) ?? numberIn(clause);
      const sym = (clause.match(/\b(?:is|be|=|equals?)\s+'?([a-z0-9])'?\b/) || [])[1];
      const c = sym && alphabet.includes(sym) ? sym : strs.find(s => s.length === 1 && alphabet.includes(s));
      return n && c ? { n: Math.min(n, 10), c } : null;
    }
    case 'DIVISIBLE': {
      const m = modSlots(clause);
      if (!m || !m.k) return null;
      const base = /\bdecimal\b/.test(clause) ? 10 : /\bternary\b/.test(clause) ? 3 : alphabet.length;
      return { ...m, base };
    }
    case 'FOLLOWED': {
      const syms = strs.filter(s => s.length === 1);
      return syms.length >= 2 ? { c: syms[0], d: syms[1] } : null;
    }
    case 'NO_CONSEC': {
      const c = countedSymbol(clause, alphabet) || strs.find(s => s.length === 1);
      if (!c) { const w = strs.find(s => s.length >= 2 && new Set(s).size === 1); return w ? { c: w[0], n: w.length } : null; }
      const n = numberIn(clause);
      return { c, n: n && n >= 2 ? n : 2 };
    }
    default: return {};
  }
}

// ------------------------------------------------------------------ description → DFA

function describe(intent, s, neg) {
  const q = (w) => `'${w}'`;
  const txt = {
    STARTS: () => `starts with ${q(s.w)}`, ENDS: () => `ends with ${q(s.w)}`,
    CONTAINS: () => `contains ${q(s.w)}`, NOT_CONTAINS: () => `does not contain ${q(s.w)}`,
    EXACT: () => `is exactly ${q(s.w)}`, LEN_EQ: () => `has length exactly ${s.n}`,
    LEN_GE: () => `has length at least ${s.n}`, LEN_LE: () => `has length at most ${s.n}`,
    LEN_MOD: () => (s.k === 2 ? `has ${s.r ? 'odd' : 'even'} length` : `has length ≡ ${s.r} (mod ${s.k})`),
    COUNT_MOD: () => (s.k === 2 ? `has an ${s.r ? 'odd' : 'even'} number of ${q(s.c)}` : `number of ${q(s.c)} ≡ ${s.r} (mod ${s.k})`),
    COUNT_EQ: () => `has exactly ${s.n} ${q(s.c)}`, COUNT_GE: () => `has at least ${s.n} ${q(s.c)}`,
    COUNT_LE: () => `has at most ${s.n} ${q(s.c)}`,
    NTH_END: () => `has ${q(s.c)} as the ${ord(s.n)} symbol from the end`,
    NTH_START: () => `has ${q(s.c)} as the ${ord(s.n)} symbol`,
    DIVISIBLE: () => `is a base-${s.base} number ≡ ${s.r || 0} (mod ${s.k})`,
    SAME_ENDS: () => 'starts and ends with the same symbol', DIFF_ENDS: () => 'starts and ends with different symbols',
    FOLLOWED: () => `every ${q(s.c)} is immediately followed by ${q(s.d)}`,
    NO_CONSEC: () => `has no ${s.n} consecutive ${q(s.c)}`, ALL: () => 'any string', NONE: () => 'no string at all',
  }[intent]();
  return neg ? `NOT (${txt})` : txt;
}
const ord = n => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');

const INHERENTLY_NEG = new Set(['NOT_CONTAINS', 'NO_CONSEC', 'NONE', 'DIFF_ENDS']);

/**
 * Parse an English description. Returns
 *   { ok, dfa, alphabet, explanation, clauses: [{text, intent, confidence, slots, negated}], problems }
 */
export function parseDescription(text, model, { minConfidence = 0.35 } = {}) {
  const det = detectAlphabet(text);
  const disjuncts = splitClauses(text);
  // Infer the alphabet from mentioned symbols when not given.
  let alphabet = det.alphabet;
  if (!alphabet) {
    const body = clean(text);
    const digits = /\b[01]+\b|\b[01]'?s\b|'[01]+'/.test(body);
    const letters = /'[abc]+'|\b(?:[abc]{2,})\b|\b[bc]'?s\b|\b(?:of|with|by|is|from) [abc]\b|\b[abc]'s\b/.test(body);
    alphabet = digits && !letters ? ['0', '1'] : /\bc\b|'c'|[abc]*c[abc]*'/.test(body) ? ['a', 'b', 'c'] : ['a', 'b'];
  }
  const problems = [];
  const clausesOut = [];
  let total = null;
  let last = null;
  const parts = [];
  for (const conj of disjuncts) {
    let acc = null;
    const descs = [];
    for (const clause of conj) {
      const pred = predict(model, clause);
      let intent = pred.intent;
      // "the last symbol is 1" / "the first symbol is 0" are ends/starts conditions.
      const fl = clause.match(/\b(first|last|final|leading|trailing) (?:symbol|character|letter|bit|digit)s? (?:is|are|=|must be|should be) '?([a-z0-9]+)'?/);
      if (fl && FA.tokens(fl[2], alphabet).every(x => alphabet.includes(x)) && !/\bfrom\b/.test(clause)
          && !/\b(\d+(st|nd|rd|th)|second|third|fourth|fifth|sixth) (last|final)\b/.test(clause)) {
        intent = /first|leading/.test(fl[1]) ? 'STARTS' : 'ENDS';
        pred.confidence = 1;
        pred.ranked = [[intent, 1], ...pred.ranked];
      }
      // Ellipsis: "contain aa or bb", "both aa and bb" -> the bare "bb" reuses the previous verb.
      if ((intent === 'FILLER' || pred.confidence < minConfidence) && last && isBareOperand(clause, alphabet)) {
        const slots = slotsFor(last.intent, clause, alphabet);
        if (slots) {
          clausesOut.push({ text: clause, intent: last.intent, confidence: pred.confidence, slots, negated: last.neg, inherited: true, ranked: pred.ranked.slice(0, 3) });
          descs.push({ intent: last.intent, slots, neg: last.neg });
          continue;
        }
      }
      if (intent === 'FILLER' || pred.confidence < minConfidence) {
        if (intent !== 'FILLER' && pred.confidence < minConfidence) problems.push(`Not sure what “${clause}” means (best guess: ${intent}, ${(pred.confidence * 100).toFixed(0)}%).`);
        clausesOut.push({ text: clause, intent: 'FILLER', confidence: pred.confidence, ranked: pred.ranked.slice(0, 3) });
        continue;
      }
      // Fall back to the next-best intent whose slots can be filled.
      let slots = slotsFor(intent, clause, alphabet);
      if (!slots) {
        const alt = pred.ranked.slice(1, 4).find(([i, p]) => i !== 'FILLER' && p > 0.08 && slotsFor(i, clause, alphabet));
        if (alt) { intent = alt[0]; slots = slotsFor(intent, clause, alphabet); }
      }
      if (!slots) {
        problems.push(`Understood “${clause}” as ${intent} but couldn't find the ${needs(intent)}.`);
        clausesOut.push({ text: clause, intent, confidence: pred.confidence, slots: null, ranked: pred.ranked.slice(0, 3) });
        continue;
      }
      const missing = symbolsOf(intent, slots).filter(c => !alphabet.includes(c));
      if (missing.length) {
        if (det.explicit) { problems.push(`“${clause}” uses ${missing.join(', ')}, which is not in the alphabet {${alphabet.join(',')}}.`); continue; }
        alphabet = [...new Set([...alphabet, ...missing])].sort();
      }
      const neg = !INHERENTLY_NEG.has(intent) && negated(clause.replace(/\b(no|not) (more|less|fewer|greater|longer|shorter) than\b/g, '')) && !/\bnot only\b/.test(clause);
      clausesOut.push({ text: clause, intent, confidence: pred.confidence, slots, negated: neg, ranked: pred.ranked.slice(0, 3) });
      descs.push({ intent, slots, neg });
      last = { intent, neg };
    }
    for (const d of descs) {
      let dfa = primitiveDfa(d.intent, d.slots, alphabet);
      dfa = FA.withAlphabet(dfa, alphabet);
      if (d.neg) dfa = FA.complement(dfa, alphabet);
      acc = acc ? FA.intersect(acc, dfa) : FA.minimize(dfa);
    }
    if (descs.length) {
      parts.push(descs.map(d => describe(d.intent, d.slots, d.neg)).join(' AND '));
      total = total ? FA.union(total, acc) : acc;
    }
  }
  if (!total) {
    if (/\ball (strings|words)\b|\bevery string\b|\bany string\b|sigma\s*\*/.test(clean(text)) && problems.length === 0) {
      total = primitiveDfa('ALL', {}, alphabet);
      parts.push('any string');
    } else {
      return { ok: false, alphabet, clauses: clausesOut, problems: problems.length ? problems : ['No condition on the strings was found. Try e.g. “strings over {a,b} ending with ab”.'] };
    }
  }
  const dfa = FA.minimize(FA.withAlphabet(total, alphabet));
  return {
    ok: true, dfa, alphabet,
    explanation: `Σ = {${alphabet.join(', ')}}; accept a string iff it ${parts.map(p => (parts.length > 1 ? `(${p})` : p)).join(' OR ')}.`,
    clauses: clausesOut, problems,
  };
}

const BARE_OK = new Set(['both', 'also', 'either', 'the', 'substring', 'substrings', 'string', 'strings', 'too', 'as', 'well', 'an', 'then', 'pattern', 'one', 'of']);
function isBareOperand(clause, alphabet) {
  if (!stringsIn(clause, alphabet).length) return false;
  const sigma = new Set(alphabet);
  return clause.replace(/'[^']*'|"[^"]*"/g, ' ').replace(/[^a-z0-9 ]/g, ' ').split(' ').filter(Boolean)
    .every(w => BARE_OK.has(w) || FA.tokens(w, alphabet).every(x => sigma.has(x)));
}

function symbolsOf(intent, s) {
  if (s.w !== undefined) return [...new Set(s.w.split(''))];
  if (s.c !== undefined) return [s.c, ...(s.d ? [s.d] : [])];
  return [];
}

function needs(intent) {
  return {
    STARTS: 'string', ENDS: 'string', CONTAINS: 'substring', NOT_CONTAINS: 'substring', EXACT: 'string',
    LEN_EQ: 'length', LEN_GE: 'length', LEN_LE: 'length', LEN_MOD: 'modulus', COUNT_MOD: 'symbol and modulus',
    COUNT_EQ: 'symbol and count', COUNT_GE: 'symbol and count', COUNT_LE: 'symbol and count',
    NTH_END: 'position and symbol', NTH_START: 'position and symbol', DIVISIBLE: 'divisor',
    FOLLOWED: 'two symbols', NO_CONSEC: 'symbol',
  }[intent] || 'details';
}
