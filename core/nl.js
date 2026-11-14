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
import { regexToDfa } from './regex.js';

export const INTENTS = [
  'STARTS', 'ENDS', 'CONTAINS', 'NOT_CONTAINS', 'EXACT',
  'LEN_EQ', 'LEN_GE', 'LEN_LE', 'LEN_MOD',
  'COUNT_MOD', 'COUNT_EQ', 'COUNT_GE', 'COUNT_LE',
  'NTH_END', 'NTH_START', 'DIVISIBLE', 'SAME_ENDS', 'DIFF_ENDS',
  'FOLLOWED', 'NO_CONSEC', 'ALL', 'NONE', 'FILLER', 'SUBSEQ',
];

const NUM_WORDS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, once: 1, twice: 2, thrice: 3, single: 1 };
const ORDINALS = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, last: 1 };

// ------------------------------------------------------------------ text normalisation

/** Lower-case, unify quotes and symbols, keep braces for alphabet parsing. */
export function clean(text) {
  return String(text)
    .toLowerCase()
    .replace(/[“”‘’`"]/g, "'")
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

/** Rewrites that make clause boundaries and meanings explicit. */
export function normalizePhrasing(text) {
  return clean(text)
    .replace(/\(?\s*(?:sigma|alphabet)\s*=\s*\{[^}]*\}\s*\)?/g, ' ')                       // "(Σ={a, b})"
    .replace(/\b(?:over|on|from)\s+(?:the\s+)?(?:alphabet\s+)?(?:sigma\s*=\s*)?\{[^}]*\}/g, ' ')
    .replace(/\b(second|third|fourth|fifth|\d+(?:st|nd|rd|th))[\s-]+(?:to[\s-]+)?last\b/g, '$1 from the end')
    .replace(/\bpenultimate\b/g, 'second from the end')
    .replace(/'(epsilon|ε|eps|empty string)'/g, '$1')
    .replace(/('[^']+') (?:which |that )?(?:is )?followed (?:later )?(?:at some point |somewhere |eventually )?(?:later )?by (?:an? |some )?('[^']+')(?! immediately)/g, (m, x, y) => (/later|some point|somewhere|eventually/.test(m) ? `${x} before ${y}` : m))
    .replace(/\blength\s*(?:=|is|==)\s*(\d+)\s*mod\s*(\d+)/g, 'length mod $2 is $1')
    .replace(/('[^']+') (?:that |which )?(?:appears? |occurs? |comes? )?(?:somewhere )?before (?:some |an? |any )?('[^']+')/g, '$1 before $2')
    .replace(/\|\s*w\s*\|/g, ' length ')
    .replace(/\beither ('[^']+'|[a-z0-9]+) or ('[^']+'|[a-z0-9]+)/g, '$1 or $2')
    .replace(/\b(start|starts|begin|begins)\s+and\s+(end|ends)\s+with\s+(?!the\b|same\b|different\b|a different\b|a same\b)('?[a-z0-9]+'?)/g, '$1 with $3 and $2 with $3')
    .replace(/\b(?:non-?empty|except (?:the )?(?:empty string|epsilon|ε)|other than (?:the )?(?:empty string|epsilon|ε))\b/g, ' of length at least 1 ');
}

/** Returns disjuncts → conjuncts: [[clause, clause], [clause]]. */
export function splitClauses(text) {
  let t = normalizePhrasing(text)
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
      // Textbook convention: the start state is remainder 0, so ε (value 0) is accepted.
      return D(A, k, 0, q => q === (s.r ?? 0) % k, (q, a) => ((q * base + digits.get(a)) % k));
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
    case 'SUBSEQ': {
      const w = s.w, m = w.length;           // greedy subsequence matcher
      return D(A, m + 1, 0, q => q === m, (q, a) => (q < m && a === w[q] ? q + 1 : q));
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
    case 'SUBSEQ': {
      // "<x> … before … <y>": x is the last symbol on the left of the keyword, y the last on the right.
      const parts = clause.split(/\b(?:before|later|eventually|then)\b/);
      if (parts.length >= 2) {
        const left = stringsIn(parts[0], alphabet).filter(x => !/^an?$/.test(x) || alphabet.includes(x));
        const right = stringsIn(parts.slice(1).join(' '), alphabet);
        const lw = left.at(-1), rw = right.at(-1);
        if (lw && rw) return { w: lw + rw };
      }
      if (strs.length >= 2 && strs.every(x => x.length === 1)) return { w: strs.slice(0, 2).join('') };
      return word !== undefined ? { w: word } : null;
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
    SUBSEQ: () => `contains ${s.w.split('').map(q).join(' … ')} in that order (not necessarily adjacent)`,
  }[intent]();
  return neg ? `NOT (${txt})` : txt;
}
const ord = n => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');

const INHERENTLY_NEG = new Set(['NOT_CONTAINS', 'NO_CONSEC', 'NONE', 'DIFF_ENDS']);

/**
 * Parse an English description. Returns
 *   { ok, dfa, alphabet, explanation, clauses: [{text, intent, confidence, slots, negated}], problems }
 */
function parseLowercase(text, model, { minConfidence = 0.35 } = {}) {
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
  // A regular expression typed inside the description wins: "(0|1)*01", "L = (a+b)*abb".
  const re = findRegex(text, alphabet, det.explicit);
  if (re) {
    const sigma = [...new Set([...alphabet, ...re.symbols])].sort();
    if (!det.explicit || re.symbols.every(c => alphabet.includes(c))) {
      const dfa = regexToDfa(re.compiled, sigma);
      return { ok: true, dfa, alphabet: sigma, regex: re.src,
        explanation: `Σ = {${sigma.join(', ')}}; accept exactly the strings matching the regular expression ${re.src}.`,
        clauses: [{ text: re.src, intent: 'REGEX', confidence: 1, slots: {} }], problems: [] };
    }
  }
  // A finite list of words: "only strings '00' or '11'", "language a or b", "the strings ab, ba".
  const fin = normalizePhrasing(text).trim().match(/\b(?:only (?:the )?(?:strings?|words?)|language|exactly the strings?|just the strings?)\s+((?:'[^']*'|[a-z0-9ε]+)(?:\s*(?:,|or|and)\s*(?:'[^']*'|[a-z0-9ε]+))*)$/);
  if (fin) {
    const words = fin[1].split(/\s*(?:,|\bor\b|\band\b)\s*/).map(w => w.replace(/'/g, '')).filter(w => w !== '');
    const toks = words.map(w => (/^(ε|epsilon|eps)$/.test(w) ? [] : FA.tokens(w, alphabet)));
    if (words.length && toks.every(t => t.every(c => alphabet.includes(c)))) {
      const dfa = toks.map(t => primitiveDfa('EXACT', { w: t.join('') }, alphabet)).reduce((x, y) => FA.union(x, y));
      return { ok: true, dfa: FA.minimize(dfa), alphabet,
        explanation: `Σ = {${alphabet.join(', ')}}; accept exactly the strings ${toks.map(t => `'${t.join('') || 'ε'}'`).join(', ')}.`,
        clauses: [{ text: fin[0], intent: 'EXACT', confidence: 1, slots: { w: words.join('|') } }], problems: [] };
    }
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
      // Deterministic readings for phrasings where position words matter more than verbs.
      const fl = clause.match(/\b(first|last|final|leading|trailing) (?:symbol|character|letter|bit|digit)s? (?:is|are|=|must be|should be) (not )?'?([a-z0-9]+)'?/);
      const nthEnd = clause.match(/\b(second|third|fourth|fifth|sixth|\d+(?:st|nd|rd|th)) (?:symbol |character |letter |bit |digit )?from the (?:end|right)\b/);
      if (fl && FA.tokens(fl[3], alphabet).every(x => alphabet.includes(x)) && !nthEnd && !/\bfrom\b/.test(clause)) {
        intent = /first|leading/.test(fl[1]) ? 'STARTS' : 'ENDS';
        pred.confidence = 1;
        pred.ranked = [[intent, 1], ...pred.ranked];
        if (fl[2]) {
          // "the last symbol is not 0": some *other* symbol is last (so ε is rejected).
          const others = alphabet.filter(c => c !== fl[3]);
          const dfa = others.map(c => primitiveDfa(intent, { w: c }, alphabet)).reduce((x, y) => FA.union(x, y));
          clausesOut.push({ text: clause, intent, confidence: 1, slots: { w: others.join('|') }, negated: false });
          descs.push({ dfa, text: `${intent === 'STARTS' ? 'starts' : 'ends'} with ${others.map(c => `'${c}'`).join(' or ')}` });
          last = { intent, neg: false };
          continue;
        }
      } else if (/\b(before|later|eventually|somewhere after|subsequence)\b/.test(clause) && stringsIn(clause, alphabet).length >= 1 && !/\bimmediately\b/.test(clause)) {
        intent = 'SUBSEQ';
        pred.confidence = 1;
      } else if (nthEnd && intent !== 'NTH_END' && (/\b(is|be|=|equals?)\b/.test(clause))) {
        intent = 'NTH_END';
        pred.confidence = Math.max(pred.confidence, 0.9);
      }
      // Ellipsis: "contain aa or bb", "both aa and bb" -> the bare "bb" reuses the previous verb.
      if (isBareOperand(clause, alphabet) && (last || stringsIn(clause, alphabet).length)) {
        const inherit = last || { intent: 'CONTAINS', neg: false };
        const slots = slotsFor(inherit.intent, clause, alphabet);
        if (!last && slots) { clausesOut.push({ text: clause, intent: 'CONTAINS', confidence: pred.confidence, slots, negated: false, inherited: true }); descs.push({ intent: 'CONTAINS', slots, neg: false }); last = inherit; continue; }
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
      let neg = !INHERENTLY_NEG.has(intent) && negated(clause.replace(/\b(no|not) (more|less|fewer|greater|longer|shorter) than\b/g, '')) && !/\bnot only\b/.test(clause);
      if (neg && intent === 'SAME_ENDS') { intent = 'DIFF_ENDS'; neg = false; }   // "last is NOT the same as first"
      clausesOut.push({ text: clause, intent, confidence: pred.confidence, slots, negated: neg, ranked: pred.ranked.slice(0, 3) });
      descs.push({ intent, slots, neg });
      last = { intent, neg };
    }
    for (const d of descs) {
      let dfa = d.dfa || primitiveDfa(d.intent, d.slots, alphabet);
      dfa = FA.withAlphabet(dfa, alphabet);
      if (d.neg) dfa = FA.complement(dfa, alphabet);
      acc = acc ? FA.intersect(acc, dfa) : FA.minimize(dfa);
    }
    if (descs.length) {
      parts.push(descs.map(d => d.text || describe(d.intent, d.slots, d.neg)).join(' AND '));
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

const BARE_OK = new Set(['both', 'also', 'either', 'the', 'substring', 'substrings', 'string', 'strings', 'too', 'as', 'well', 'an', 'then', 'pattern', 'one', 'of', 'symbols', 'characters', 'letters']);
function isBareOperand(clause, alphabet) {
  const sigma = new Set(alphabet);
  const ws = clause.replace(/'[^']*'|"[^"]*"/g, ' zqzq ').replace(/[^a-z0-9 ]/g, ' ').split(' ').filter(Boolean);
  if (!ws.length) return false;
  return ws.every(w => w === 'zqzq' || BARE_OK.has(w) || /^\d+$/.test(w) || w in NUM_WORDS || FA.tokens(w, alphabet).every(x => sigma.has(x)));
}

/**
 * Find a regular expression written inside the description. Letters must be alphabet symbols,
 * and it needs an operator (*, +, |, ∪, parentheses) so plain words are never mistaken for one.
 */
function findRegex(text, alphabet, explicit) {
  let t = clean(text).replace(/\(?\s*(?:sigma|alphabet)\s*=\s*\{[^}]*\}\s*\)?/g, ' ').replace(/\bl\s*=\s*/g, ' ');
  const sigmaRe = '(' + alphabet.join('|') + ')';
  t = t.replace(/\bsigma\b|σ/g, '§');
  const symOk = new Set(alphabet);
  const isTok = (w) => /^[()|¦+*?.·∪§εϵλ^⁺0-9a-z]+$/.test(w) && [...w.replace(/[()|¦+*?.·∪§εϵλ^⁺]/g, '')].every(c => symOk.has(c) || (!explicit && /[a-c0-1]/.test(c)));
  // "(ab or ba)*" → "(ab|ba)*": 'or' between two regex pieces is union
  t = t.replace(/([a-z0-9)*ε]) (?:or|\|) (?=[a-z0-9(ε])/g, '$1¦').replace(/ ?\. ?/g, '.');
  // postfix plus written "a+ b*": a '+' glued to its operand and followed by a space is Kleene plus
  t = t.replace(/([a-z0-9])\+(?= |$)/g, '$1$1⁺');
  // with '|' already used for union, a '+' after ')' is Kleene plus: (a|b)+a
  if (/[|¦]/.test(t)) t = t.replace(/\)\+/g, ')⁺⁺');
  const words = t.split(/\s+/);
  let best = null;
  for (let i = 0; i < words.length; i++) {
    let j = i;
    while (j < words.length && isTok(words[j])) j++;
    if (j > i) {
      let cand = words.slice(i, j).join('');
      // trim unbalanced parentheses at the ends
      for (let k = 0; k < 3; k++) {
        const bal = [...cand].reduce((b, c) => b + (c === '(' ? 1 : c === ')' ? -1 : 0), 0);
        if (bal > 0 && cand.endsWith('(')) cand = cand.slice(0, -1);
        else if (bal < 0 && cand.startsWith(')')) cand = cand.slice(1);
        else if (bal > 0 && cand.startsWith('(')) cand = cand.slice(1);
        else if (bal < 0 && cand.endsWith(')')) cand = cand.slice(0, -1);
      }
      if (/[*|+?()∪§⁺]/.test(cand) && cand.replace(/[^a-z0-9§]/g, '').length >= 2 && (!best || cand.length > best.length)) best = cand;
      i = j;
    }
  }
  if (!best) return null;
  // ")⁺⁺": Kleene plus on a group → (G)(G)*
  while (best.includes(')⁺⁺')) {
    const end = best.indexOf(')⁺⁺');
    let depth = 0, start = end;
    for (; start >= 0; start--) { if (best[start] === ')') depth++; else if (best[start] === '(' && --depth === 0) break; }
    const g = best.slice(start, end + 1);
    best = best.slice(0, start) + g + g + '*' + best.slice(end + 3);
  }
  best = best.replace(/⁺/g, '*').replace(/¦/g, '|');
  const src = best.replace(/§/g, sigmaRe);
  try {
    regexToDfa(src);
    const symbols = [...new Set(src.replace(/[^a-z0-9]/g, ''))];
    return { src: best.replace(/§/g, 'Σ'), symbols, compiled: src };
  } catch { return null; }
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
    FOLLOWED: 'two symbols', NO_CONSEC: 'symbol', SUBSEQ: 'symbols',
  }[intent] || 'details';
}


/**
 * Parse an English description into a DFA. Text is matched case-insensitively, but symbols
 * written in capitals in the description (Σ = {P, R}, "RR") keep their case in the result.
 */
export function parseDescription(text, model, opts) {
  const r = parseLowercase(text, model, opts);
  if (!r || !r.alphabet) return r;
  const src = String(text);
  const written = [...(src.match(/\{[^}]*\}/g) || []), ...(src.match(/'[^']*'|"[^"]*"|“[^”]*”/g) || [])].join(' ');
  const map = new Map();
  for (const a of r.alphabet) {
    const up = a.toUpperCase();
    if (up !== a && written.includes(up) && !new RegExp(`(^|[^a-z])${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(written.replace(/[A-Z]/g, ''))) map.set(a, up);
  }
  if (!map.size) return r;
  const fix = (x) => map.get(x) ?? x;
  const fixText = (t) => t && t.replace(/'([^']*)'/g, (m, w) => `'${[...w].map(fix).join('')}'`).replace(/Σ = \{([^}]*)\}/, (m, l) => `Σ = {${l.split(', ').map(fix).join(', ')}}`);
  return {
    ...r,
    alphabet: r.alphabet.map(fix),
    dfa: r.dfa && { ...r.dfa, alphabet: r.dfa.alphabet.map(fix) },
    explanation: fixText(r.explanation),
  };
}
