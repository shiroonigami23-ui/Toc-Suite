// core/build/lang.js — reads descriptions of non-regular languages and machine tasks.
//
// Understands set-builder / exponent notation ("{a^n b^2n | n >= 1}", "aⁿbⁿcⁿ", "a^i b^j, i ≠ j"),
// English ("n a's followed by n b's", "as many 0s as 1s", "even-length palindromes over {a,b}",
// "balanced parentheses", "increment a binary number") and turns them into a structured spec
// plus an exact membership oracle. The compilers (pda.js, tm.js) build from the spec and every
// result is checked against the oracle before it is shown.

const SUP = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  'ⁿ': 'n', 'ᵐ': 'm', 'ⁱ': 'i', 'ʲ': 'j', 'ᵏ': 'k', 'ˡ': 'l', '⁺': '+', '⁻': '-', 'ᴿ': 'R', 'ʳ': 'R',
};
const WORDNUM = { one: 1, two: 2, three: 3, four: 4, five: 5, zero: 0, once: 1, twice: 2, thrice: 3, double: 2, triple: 3 };
const VARS = 'nmijklpqrst';

/** Unicode / spacing / comparator normalisation shared by every reader. */
export function normalize(text) {
  let t = String(text)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐⁱʲᵏˡ⁺⁻]+/g, m => '^{' + [...m].map(c => SUP[c]).join('') + '}')
    .replace(/[ᴿʳ]/g, '^R')
    .replace(/[“”‘’`"]/g, "'")
    .replace(/≥|=>|⩾/g, '>=').replace(/≤|=<|⩽/g, '<=').replace(/≠|=\/=|!==|<>/g, '!=').replace(/==/g, '=')
    .replace(/[−–—]/g, '-').replace(/×/g, '*').replace(/∈/g, ' in ').replace(/∣|∶/g, '|')
    .replace(/ε|ϵ|λ/g, 'ε')
    .replace(/\s+/g, ' ').trim();
  // keep ^R (reverse) upper-case, everything else lower-case
  t = t.replace(/\^\s*(?:\{\s*R\s*\}|R\b)/g, '^®').toLowerCase().replace(/\^®/g, '^R');
  t = t.replace(/\bto the (?:power (?:of )?)?([0-9]*[a-z]|\d+)\b/g, '^$1');
  t = t.replace(/\b(zeroe?s|zeros)\b/g, "0's").replace(/\bones\b/g, "1's");
  return t;
}

// ------------------------------------------------------------------ linear expressions

/** "2n+1" → { k: {n: 2}, c: 1 } ; returns null when it is not a linear expression. */
export function parseLin(src) {
  const s = String(src).replace(/\s+/g, '').replace(/^[({]|[)}]$/g, '');
  if (!s) return null;
  if (!/^[+-]?(\d*\*?[a-z]|\d+)([+-](\d*\*?[a-z]|\d+))*$/.test(s)) return null;
  const out = { k: {}, c: 0 };
  for (const m of s.matchAll(/([+-]?)(\d*)\*?([a-z]?)/g)) {
    if (!m[0]) continue;
    const sign = m[1] === '-' ? -1 : 1;
    if (m[3]) {
      if (!VARS.includes(m[3])) return null;
      out.k[m[3]] = (out.k[m[3]] || 0) + sign * (m[2] ? +m[2] : 1);
    } else if (m[2]) out.c += sign * +m[2];
  }
  return out;
}
export const linEval = (l, env) => l.c + Object.entries(l.k).reduce((a, [v, c]) => a + c * (env[v] ?? 0), 0);
const linVars = (l) => Object.keys(l.k).filter(v => l.k[v] !== 0);
export function linStr(l) {
  const parts = Object.entries(l.k).filter(([, c]) => c).map(([v, c]) => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`));
  if (l.c || !parts.length) parts.push(String(l.c));
  return parts.join('+').replace(/\+-/g, '-');
}

const OPS = { '=': (a, b) => a === b, '!=': (a, b) => a !== b, '<': (a, b) => a < b, '>': (a, b) => a > b, '<=': (a, b) => a <= b, '>=': (a, b) => a >= b };

/** English comparators → symbols. */
function comparators(t) {
  return t
    .replace(/\b(?:is|are|be) (?:greater than or equal to|at least|no less than|not less than)\b/g, ' >= ')
    .replace(/\b(?:is|are|be) (?:less than or equal to|at most|no more than|not more than|not greater than)\b/g, ' <= ')
    .replace(/\b(?:(?:is|are) )?(?:strictly )?(?:greater|bigger|larger|more) than\b|\bexceeds\b/g, ' > ')
    .replace(/\b(?:(?:is|are) )?(?:strictly )?(?:less|smaller|fewer) than\b/g, ' < ')
    .replace(/\b(?:is not equal to|is not the same as|does not equal|doesn't equal|not equal to|is different from|differs from|is unequal to)\b/g, ' != ')
    .replace(/\b(?:is equal to|equals|is the same as|is)\b(?=\s*[a-z0-9(]*\d*[a-z]?\b)/g, (m) => (m.trim() === 'is' ? m : ' = '))
    .replace(/\bat least\b/g, ' >= ').replace(/\bat most\b/g, ' <= ')
    .replace(/\bis positive\b|\bare positive\b/g, ' >= 1 ');
}

/** Constraint text → { mins: {var: min}, dnf: [[atom]] } where atom = {l, op, r}. */
export function parseConstraints(text, vars) {
  let t = comparators(' ' + text + ' ');
  // "n, m >= 1" / "n and m >= 0" → separate atoms
  t = t.replace(/\b([a-z](?:\s*(?:,|and)\s*[a-z])+)\s*(>=|<=|!=|=|<|>)\s*(-?\d+)/g, (m, list, op, num) =>
    list.split(/\s*(?:,|and)\s*/).map(v => `${v} ${op} ${num}`).join(' and '));
  // chains "0 < n < m"
  t = t.replace(/([a-z0-9+*]+)\s*(>=|<=|!=|<|>|=)\s*([a-z0-9+*]+)\s*(>=|<=|!=|<|>|=)\s*([a-z0-9+*]+)/g, '$1 $2 $3 and $3 $4 $5');
  const ATOM = /([0-9]*\*?[a-z](?:\s*[+-]\s*[0-9]*\*?[a-z0-9]+)*|-?\d+)\s*(>=|<=|!=|<|>|=)\s*([0-9]*\*?[a-z](?:\s*[+-]\s*[0-9]*\*?[a-z0-9]+)*|-?\d+)/g;
  const mins = {};
  const atomsOf = (s) => {
    const out = [];
    for (const m of s.matchAll(ATOM)) {
      const l = parseLin(m[1]), r = parseLin(m[3]);
      if (!l || !r) continue;
      const vs = [...linVars(l), ...linVars(r)];
      if (!vs.length || !vs.every(v => vars.has(v))) continue;
      out.push({ l, op: m[2], r });
    }
    return out;
  };
  // Lower bounds on single variables are global, whatever "or" structure surrounds them.
  const rest = t.replace(ATOM, (m, a, op, b) => {
    const l = parseLin(a), r = parseLin(b);
    if (l && r && linVars(l).length === 1 && !linVars(r).length && l.k[linVars(l)[0]] === 1 && l.c === 0 && (op === '>=' || op === '>') && vars.has(linVars(l)[0])) {
      const v = linVars(l)[0];
      mins[v] = Math.max(mins[v] ?? 0, r.c + (op === '>' ? 1 : 0));
      return ' ';
    }
    if (l && r && linVars(r).length === 1 && !linVars(l).length && r.k[linVars(r)[0]] === 1 && r.c === 0 && (op === '<=' || op === '<') && vars.has(linVars(r)[0])) {
      const v = linVars(r)[0];
      mins[v] = Math.max(mins[v] ?? 0, l.c + (op === '<' ? 1 : 0));
      return ' ';
    }
    return m;
  });
  const dnf = rest.split(/\bor\b/).map(atomsOf).filter(c => c.length);
  return { mins, dnf: dnf.length ? dnf : [[]] };
}

export const atomStr = (a) => `${linStr(a.l)} ${a.op === '!=' ? '≠' : a.op === '>=' ? '≥' : a.op === '<=' ? '≤' : a.op} ${linStr(a.r)}`;

// ------------------------------------------------------------------ alphabet helpers

export function alphabetIn(t) {
  for (const m of t.matchAll(/\{([^{}|:]*)\}/g)) {
    const syms = m[1].split(/[\s,]+/).map(s => s.replace(/'/g, '')).filter(Boolean);
    if (syms.length && syms.every(s => s.length === 1 && /^[a-z0-9#$]$/.test(s)) && /,/.test(m[1])) return [...new Set(syms)].sort();
  }
  const over = t.match(/\b(?:over|alphabet|sigma\s*=?)\s+(?:the\s+)?(?:alphabet\s+)?([a-z0-9](?:\s*(?:,|and)\s*[a-z0-9])+)\b/);
  if (over) return [...new Set(over[1].split(/\s*(?:,|and)\s*/))].sort();
  if (/\bbinary\b|\bbits?\b|\b0's and 1's\b/.test(t)) return ['0', '1'];
  return null;
}

// ------------------------------------------------------------------ English → exponent notation

const QTY = [
  [/^(?:the same number of|an equal number of|equal number of|equally many|as many|the same amount of|matching)$/, (base) => ({ k: { ...base.k }, c: base.c })],
  [/^(?:twice as many|double the number of|two times as many|2 times as many)$/, (base) => scale(base, 2)],
  [/^(?:three times as many|thrice as many|3 times as many|triple the number of)$/, (base) => scale(base, 3)],
];
const scale = (l, f) => ({ k: Object.fromEntries(Object.entries(l.k).map(([v, c]) => [v, c * f])), c: l.c * f });

/**
 * "n a's followed by 2n b's", "a's followed by the same number of b's then c's",
 * "some 0s followed by twice as many 1s" → "a^{n} b^{2n} …" (+ min hints).
 */
function englishBlocks(t) {
  // "n a's" / "2n b's"
  t = t.replace(/\b(\d*)([nmijk])\s+(?:copies of\s+|occurrences of\s+)?('?)([a-z0-9])\3('s|s)?\b(?!\^)/g, (m, c, v, q, s, pl) =>
    ((q || pl) && !/^(?:is|as|us)$/.test(s + (pl || '')) ? `${s}^{${c}${v}}` : m));
  const ITEM = "(?:(the same number of|an equal number of|equal number of|equally many|as many|the same amount of|twice as many|double the number of|two times as many|three times as many|thrice as many|one or more|zero or more|at least one|some|any number of|a positive number of)\\s+)?(?:a\\s+)?(?:(?:block|run|string|sequence|number) of\\s+)?'?([a-z0-9])'?(?:'s|s)\\b";
  const SEP = "\\s*,?\\s*(?:followed by|and then|then|before)\\s+";
  const re = new RegExp(`${ITEM}(?:${SEP}${ITEM})+`, 'g');
  let mins = {};
  t = t.replace(re, (whole) => {
    const items = [...whole.matchAll(new RegExp(ITEM, 'g'))];
    let fresh = 0;
    const names = ['n', 'm', 'k', 'l'];
    let prev = null;
    const out = [];
    for (const it of items) {
      const qty = it[1] || '';
      let exp;
      const rule = QTY.find(([r]) => r.test(qty));
      if (rule && prev) exp = rule[1](prev);
      else {
        const v = names[fresh++] || 'p';
        exp = { k: { [v]: 1 }, c: 0 };
        if (/one or more|at least one|positive/.test(qty)) mins[v] = 1;
      }
      prev = exp;
      out.push(`${it[2]}^{${linStr(exp)}}`);
    }
    return ' ' + out.join(' ') + ' ';
  });
  return { t, mins };
}

/** Count statements → atoms over symbol counts, written "#a". */
function countAtoms(t) {
  const S = "'?([a-z0-9])'?(?:'s|s)?";
  const atoms = [];
  const add = (a, op, b, f = 1) => atoms.push({ a, op, b, f });
  const rules = [
    [new RegExp(`\\b(?:an |the )?(?:equal|same) (?:number|count|amount|numbers) of ${S},? (?:and )?${S}(?:,? (?:and )?${S})?`, 'g'), (m) => { add(m[1], '=', m[2]); if (m[3]) add(m[2], '=', m[3]); }],
    [new RegExp(`\\b(?:the )?(?:number|count|no\\.?) of ${S} (?:is|are|=|equals?) (twice|double|thrice|triple|three times|(\\d+) times) (?:as many as )?(?:the )?(?:number|count|no\\.?) of ${S}`, 'g'), (m) => add(m[1], '=', m[4], m[3] ? +m[3] : WORDNUM[m[2].split(' ')[0]] || 2)],
    [new RegExp(`\\bequally many ${S} and ${S}`, 'g'), (m) => add(m[1], '=', m[2])],
    [new RegExp(`\\bat least (?:as many|twice as many) ${S} as ${S}`, 'g'), (m) => add(m[1], '>=', m[2], /twice/.test(m[0]) ? 2 : 1)],
    [new RegExp(`\\bat most as many ${S} as ${S}`, 'g'), (m) => add(m[1], '<=', m[2])],
    [new RegExp(`\\b(twice|three times|thrice) as many ${S} as ${S}`, 'g'), (m) => add(m[2], '=', m[3], m[1] === 'twice' ? 2 : 3)],
    [new RegExp(`\\bas many ${S} as ${S}`, 'g'), (m) => add(m[1], '=', m[2])],
    [new RegExp(`\\bmore ${S} than ${S}`, 'g'), (m) => add(m[1], '>', m[2])],
    [new RegExp(`\\b(?:fewer|less) ${S} than ${S}`, 'g'), (m) => add(m[1], '<', m[2])],
    [new RegExp(`\\b(?:a )?(?:different|unequal) (?:number|count|numbers) of ${S} and ${S}`, 'g'), (m) => add(m[1], '!=', m[2])],
    [new RegExp(`\\b(?:the )?(?:number|count|no\\.?) of ${S} (>=|<=|!=|=|<|>) (?:(\\d+) ?\\*? ?)?(?:times )?(?:the )?(?:number|count|no\\.?) of ${S}`, 'g'), (m) => add(m[1], m[2], m[4], m[3] ? +m[3] : 1)],
    [/(?<![a-z0-9])(?:n_?|#|count\(|\|w\|_?)\s*([a-z0-9])\)?(?:\s*\(w\))?\s*(>=|<=|!=|=|<|>)\s*(\d*)\s*\*?\s*(?:n_?|#|count\(|\|w\|_?)\s*([a-z0-9])\)?(?:\s*\(w\))?/g, (m) => add(m[1], m[2], m[4], m[3] ? +m[3] : 1)],
  ];
  let s = comparators(' ' + t + ' ');
  for (const [re, fn] of rules) s = s.replace(re, (...args) => { fn(args); return ' '; });
  return atoms;
}

// ------------------------------------------------------------------ block notation

const TOK = /([a-z0-9#$()[\]{}])\s*\^\s*(\{[^{}]*\}|\([^()]*\)|\d*[a-z](?:[+-]\d+)?(?![a-z0-9])|\d*[a-z]|\d+)/y;

/** Parse "a^n b^{2n} c a^m" starting at index i. Returns blocks or null. */
function readBlocks(t, start) {
  const blocks = [];
  let i = start;
  let fresh = 0;
  for (;;) {
    while (t[i] === ' ' || t[i] === '·' || t[i] === '.') i++;
    TOK.lastIndex = i;
    const m = TOK.exec(t);
    if (m) {
      const raw = m[2].replace(/^[{(]|[})]$/g, '');
      const exp = parseLin(raw);
      if (!exp) return null;
      blocks.push({ sym: m[1], exp });
      i = TOK.lastIndex;
      continue;
    }
    if (blocks.length) {
      const sep = /^,?\s*(?:followed by|and then|then|concatenated with)\s+(?=[a-z0-9#$]\s*\^)/.exec(t.slice(i));
      if (sep) { i += sep[0].length; continue; }
    }
    // Kleene star/plus inside notation: "a* b^n c^n"
    const k = /^([a-z0-9])([*+])(?=\s|$|[a-z0-9]\^)/.exec(t.slice(i));
    if (k && blocks.length < 6) {
      const v = 'pqrst'[fresh++];
      blocks.push({ sym: k[1], exp: { k: { [v]: 1 }, c: 0 }, freeMin: k[2] === '+' ? 1 : 0, freeVar: v });
      i += 2;
      continue;
    }
    // a single constant symbol between blocks: "a^n c b^n"
    const c = /^([a-z0-9#$])(?=\s+[a-z0-9#$]\s*\^|\s*[a-z0-9#$]\^)/.exec(t.slice(i));
    if (c && blocks.length) {
      blocks.push({ sym: c[1], exp: { k: {}, c: 1 } });
      i += 1;
      continue;
    }
    break;
  }
  return blocks.length ? { blocks, end: i } : null;
}

// ------------------------------------------------------------------ the reader

/**
 * @returns {null | {type, ...}} a structured spec, or null if the text is not one of the
 *   non-regular families (the caller then uses the regular-language reader).
 */
export function readSpec(text) {
  const t0 = normalize(text);
  const alpha = alphabetIn(t0);

  // ---- machine tasks (transducers) ----
  const op = readOp(t0);
  if (op) return op;

  // ---- palindromes / copies ----
  const pal = readPal(t0, alpha);
  if (pal) return pal;

  // ---- balanced brackets / Dyck ----
  const bal = readBalanced(t0);
  if (bal) return bal;

  // ---- powers of two, squares, primes ----
  const powSym = (t0.match(/\b([a-z0-9])\s*\^\s*\{?\s*2\s*\^\s*\{?([a-z])\}?\s*\}?/) || [])[1];
  if (powSym || /\blength (?:is )?(?:a )?power of (?:2|two)\b|\bpowers? of (?:2|two)\b/.test(t0)) {
    const sym = powSym || (alpha && alpha.length === 1 ? alpha[0] : /\b0\b|0's/.test(t0) ? '0' : 'a');
    return { type: 'pow2', alphabet: [sym], sym, label: `{ ${sym}^(2^n) | n ≥ 0 }` };
  }
  if (/\^\s*\{?\s*[a-z]\s*\^\s*\{?2|\b(?:perfect )?squares?\b.*\blength|\bprime\b/.test(t0)) {
    return { type: 'unsupported', reason: /prime/.test(t0) ? 'prime lengths' : 'square lengths', label: t0 };
  }

  // ---- exponent blocks ----
  const eng = englishBlocks(t0);
  const t = eng.t;
  let found = null;
  for (let i = 0; i < t.length; i++) {
    if (!/[a-z0-9#$]/.test(t[i]) || (i > 0 && /[a-z0-9]/.test(t[i - 1]))) continue;
    TOK.lastIndex = i;
    if (!TOK.test(t) && !/^[a-z0-9][*+]\s*[a-z0-9]\s*\^/.test(t.slice(i))) continue;
    const r = readBlocks(t, i);
    if (r && (!found || r.blocks.length > found.blocks.length)) found = { ...r, at: i };
    if (r) i = r.end;
  }
  const counts = countAtoms(t0);

  if (found && found.blocks.some(b => linVars(b.exp).length)) {
    const blocks = found.blocks;
    const vars = new Set(blocks.flatMap(b => linVars(b.exp)));
    const after = t.slice(0, found.at) + ' ' + t.slice(found.end);
    const { mins, dnf } = parseConstraints(after, vars);
    for (const [v, m] of Object.entries(eng.mins)) mins[v] = Math.max(mins[v] ?? 0, m);
    for (const b of blocks) if (b.freeVar) mins[b.freeVar] = Math.max(mins[b.freeVar] ?? 0, b.freeMin || 0);
    // count statements about block symbols become constraints on block exponents
    for (const c of counts) {
      const ia = blocks.findIndex(b => b.sym === c.a), ib = blocks.findIndex(b => b.sym === c.b);
      if (ia < 0 || ib < 0 || blocks.filter(b => b.sym === c.a).length > 1 || blocks.filter(b => b.sym === c.b).length > 1) continue;
      const atom = { l: blocks[ia].exp, op: c.op, r: scale(blocks[ib].exp, c.f) };
      for (const conj of dnf) conj.push(atom);
    }
    const alphabet = [...new Set([...(alpha || []), ...blocks.map(b => b.sym)])].sort();
    return { type: 'blocks', alphabet, blocks, mins, dnf, label: blocksLabel(blocks, mins, dnf) };
  }

  // ---- counts in any order ----
  if (counts.length) {
    const syms = [...new Set(counts.flatMap(c => [c.a, c.b]))];
    const alphabet = [...new Set([...(alpha || []), ...syms])].sort();
    const atoms = counts.map(c => ({ l: { k: { [c.a]: 1 }, c: 0 }, op: c.op, r: { k: { [c.b]: c.f }, c: 0 } }));
    const prefix = readPrefixRule(t0);
    if (prefix) return prefix;
    return { type: 'count', alphabet, atoms, label: `{ w ∈ {${alphabet.join(',')}}* : ${atoms.map(a => atomStr(a).replace(/\b([a-z0-9])\b/g, '#$1')).join(' and ')} }` };
  }
  const prefix = readPrefixRule(t0);
  if (prefix) return prefix;
  return null;
}

function blocksLabel(blocks, mins, dnf) {
  const body = blocks.map(b => {
    const e = linStr(b.exp);
    return e === '1' ? b.sym : e === '0' ? '' : `${b.sym}^${e.length > 1 ? `(${e})` : e}`;
  }).join(' ');
  const vars = [...new Set(blocks.flatMap(b => linVars(b.exp)))];
  const conds = [];
  const byMin = new Map();
  for (const v of vars) { const m = mins[v] ?? 0; if (!byMin.has(m)) byMin.set(m, []); byMin.get(m).push(v); }
  for (const [m, vs] of byMin) conds.push(`${vs.join(', ')} ≥ ${m}`);
  const rel = dnf.filter(c => c.length).map(c => c.map(atomStr).join(' and '));
  if (rel.length) conds.push(rel.join(' or '));
  return `{ ${body} | ${conds.join(', ')} }`;
}

function readPrefixRule(t) {
  const m = t.match(/\b(?:every|each|all|any) prefix(?:es)? (?:of (?:the string|w) )?(?:has|have|contains?) at least as many '?([a-z0-9()[\]])'?(?:'s|s)? as '?([a-z0-9()[\]])'?(?:'s|s)?/);
  if (!m) return null;
  const equal = /\b(?:equal|same) number\b|\bas many [^,]* as\b(?![^,]*prefix)/.test(t.replace(m[0], ''));
  return { type: 'balanced', pairs: [[m[1], m[2]]], alphabet: [m[1], m[2]].sort(), allowOpen: !equal,
    label: equal ? `Dyck words over {${m[1]}, ${m[2]}}` : `strings where every prefix has at least as many ${m[1]}'s as ${m[2]}'s` };
}

function readPal(t, alpha) {
  const marker = t.match(/\bw\s*([a-z0-9#$])\s*w\s*\^\s*r\b/i) || t.match(/\bw\s*([#$c])\s*(?:reverse\(w\)|w\s*reversed|reverse of w)/);
  const wwr = /\bw\s*w\s*\^\s*r\b/i.test(t) || /\bw\s*(?:followed by|concatenated with)\s*(?:its|the) reverse\b|\bw\s*reverse\(w\)/.test(t);
  const pal = /palindrom|reads? the same (?:forwards?|backwards?|both ways|from (?:left|right))|same (?:forwards? and backwards?|backwards? and forwards?)|equal to (?:its|their) (?:own )?reverse|equals? (?:its|their) reverse/.test(t);
  if (marker || wwr || pal) {
    const alphabet = alpha ? alpha.filter(s => !marker || s !== marker[1]) : (/\b[01]\b|0's|1's|binary/.test(t) ? ['0', '1'] : /\bc\b/.test(t) && !marker ? ['a', 'b', 'c'] : ['a', 'b']);
    if (marker) return { type: 'pal', alphabet: [...alphabet, marker[1]].sort(), sigma: alphabet, marker: marker[1], parity: 'marker', label: `{ w${marker[1]}wᴿ | w ∈ {${alphabet.join(',')}}* }` };
    const parity = wwr || /\beven[- ]?length\b|\bof even length\b/.test(t) ? 'even' : /\bodd[- ]?length\b|\bof odd length\b/.test(t) ? 'odd' : 'any';
    return { type: 'pal', alphabet, sigma: alphabet, parity, label: parity === 'even' ? `{ wwᴿ | w ∈ {${alphabet.join(',')}}* } (even-length palindromes)` : `${parity === 'odd' ? 'odd-length ' : ''}palindromes over {${alphabet.join(', ')}}` };
  }
  const copyMarker = t.match(/\bw\s*([#$c])\s*w\b(?!\s*\^)/);
  const copy = copyMarker || /\bw\s*w\b(?!\s*\^)|\bww\b(?!\s*\^|r)|\b(?:a )?string (?:followed by|concatenated with|repeated) (?:by )?itself|\bsquares? of strings\b|\btandem\b|\brepeated twice\b|\bcopy language\b/.test(t);
  if (copy) {
    const alphabet = (alpha || (/\b[01]\b|0's|1's|binary/.test(t) ? ['0', '1'] : ['a', 'b'])).filter(s => !copyMarker || s !== copyMarker[1]);
    return copyMarker
      ? { type: 'copy', alphabet: [...alphabet, copyMarker[1]].sort(), sigma: alphabet, marker: copyMarker[1], label: `{ w${copyMarker[1]}w | w ∈ {${alphabet.join(',')}}* }` }
      : { type: 'copy', alphabet, sigma: alphabet, label: `{ ww | w ∈ {${alphabet.join(',')}}* }` };
  }
  return null;
}

function readBalanced(t) {
  if (!/\bbalanced\b|\bwell[- ]?formed\b|\bproperly nested\b|\bmatched\b|\bmatching\b|\bdyck\b|\bnested (?:parenthes|bracket)/.test(t)) return null;
  if (!/parenthes|bracket|brace|\(\)|\[\]|\{\}|dyck/.test(t)) return null;
  const pairs = [];
  if (/parenthes|\(\)|round/.test(t)) pairs.push(['(', ')']);
  if (/square|\[\]/.test(t) || (/\bbrackets?\b/.test(t) && !/round brackets?|curly brackets?/.test(t))) pairs.push(['[', ']']);
  if (/curly|\bbraces?\b|\{\}/.test(t)) pairs.push(['{', '}']);
  if (/\b(?:all|three|mixed|different) (?:kinds|types)\b/.test(t)) for (const p of [['(', ')'], ['[', ']'], ['{', '}']]) if (!pairs.some(q => q[0] === p[0])) pairs.push(p);
  if (!pairs.length) pairs.push(['(', ')']);
  return { type: 'balanced', pairs, alphabet: pairs.flat(), allowOpen: false, label: `balanced ${pairs.map(p => p.join('')).join(' ')} strings` };
}

/** Machine tasks: increment, complement, unary addition, ... */
export function readOp(t) {
  const unary = /\bunary\b|\btally\b|1\s*\^\s*\{?[mn]/.test(t);
  const binary = /\bbinary\b|\bbits?\b/.test(t) || !unary;
  const sepM = t.match(/1\s*\^\s*\{?m\}?\s*([0#+])\s*1\s*\^\s*\{?n\}?/) || t.match(/separated by (?:a |an )?'?([0#+])'?/);
  const sep = sepM ? sepM[1] : '0';
  const mk = (op, base, label, extra = {}) => ({ type: 'op', op, base, label, ...extra });
  if (/\b(?:2's|two's|twos|2s) complement\b/.test(t)) return mk('twos', 'binary', "2's complement of a binary number");
  if (/\b(?:1's|one's|ones) complement\b|\b(?:complement|invert|flip|negate)(?:s|ing)? (?:of )?(?:each|every|all|the|its)? ?(?:input |given )?(?:bits?|binary)\b|\bcomplement of the (?:input|binary)\b|\bbit[- ]?(?:wise )?(?:inver|complement|flip)|\b(?:inverter|bit flipper)\b/.test(t)) return mk('complement', 'binary', 'complement every bit');
  const noExp = !/\^/.test(t);
  if (/\bincrement|\badd(?:s|ing)? (?:1|one)\b|\bplus one\b|\bsuccessor\b/.test(t) || (noExp && /\bn\s*\+\s*1\b/.test(t))) return mk('inc', unary && !/\bbinary\b/.test(t) ? 'unary' : 'binary', `${unary && !/\bbinary\b/.test(t) ? 'unary' : 'binary'} increment (n → n+1)`);
  if (/\bdecrement|\bsubtract(?:s|ing)? (?:1|one)\b|\bminus one\b|\bpredecessor\b/.test(t) || (noExp && /\bn\s*-\s*1\b/.test(t))) return mk('dec', unary && !/\bbinary\b/.test(t) ? 'unary' : 'binary', `${unary && !/\bbinary\b/.test(t) ? 'unary' : 'binary'} decrement (n → n−1, n ≥ 1)`);
  if (/\b(?:unary )?(?:addition|adder|sum)\b|\badd(?:s|ing)? (?:two|2) (?:unary )?numbers\b|1\s*\^\s*\{?m\}?\s*[0#+]\s*1\s*\^\s*\{?n\}?.*1\s*\^\s*\{?\(?m\s*\+\s*n/.test(t) && !/\bbinary addition|serial adder/.test(t)) return mk('add', 'unary', `unary addition 1^m${sep}1^n → 1^(m+n)`, { sep });
  if (/\b(?:unary )?(?:subtraction|subtractor|monus|proper subtraction)\b|\bsubtract(?:s|ing)? (?:two|2) (?:unary )?numbers\b|m\s*[∸-]\s*n/.test(t)) return mk('sub', 'unary', `unary subtraction 1^m${sep}1^n → 1^(m∸n)`, { sep });
  if (/\b(?:double|doubles|doubling|multipl(?:y|ies) by (?:2|two)|times (?:2|two))\b/.test(t)) return mk('double', unary && !/\bbinary\b/.test(t) ? 'unary' : 'binary', `${unary && !/\bbinary\b/.test(t) ? 'unary' : 'binary'} doubling (n → 2n)`);
  if (/\b(?:serial|binary) (?:adder|addition)\b|\badd(?:s|ing)? two binary numbers\b/.test(t)) return mk('serialadd', 'binary', 'serial binary adder (bit pairs, least significant first)');
  if (/\b(?:unit )?delay\b|\bprevious (?:input|symbol|bit)\b|\bshift(?:s|ed)? (?:right )?by one\b|\boutputs? the last (?:input|symbol|bit)\b/.test(t)) return mk('delay', 'binary', 'output the previous input (unit delay)');
  if (/\b(?:change|edge|transition) detector\b|\b(?:differs|different) from the previous\b|\boutputs? 1 (?:when|whenever|if) the input changes\b/.test(t)) return mk('change', 'binary', 'output 1 when the input differs from the previous one');
  if (/\bsame as the previous\b|\bequals? the previous\b|\brepeat(?:ed)? (?:input|symbol|bit)\b/.test(t)) return mk('same', 'binary', 'output 1 when the input equals the previous one');
  return null;
}

// ------------------------------------------------------------------ oracles

/** Exact membership test for a spec (null when the spec has none, e.g. ops). */
export function oracleFor(spec) {
  switch (spec.type) {
    case 'blocks': return blocksOracle(spec);
    case 'count': {
      return (w) => {
        if (![...w].every(c => spec.alphabet.includes(c))) return false;
        const env = Object.fromEntries(spec.alphabet.map(a => [a, [...w].filter(c => c === a).length]));
        return spec.atoms.every(a => OPS[a.op](linEval(a.l, env), linEval(a.r, env)));
      };
    }
    case 'pal': {
      const rev = (s) => [...s].reverse().join('');
      if (spec.parity === 'marker') return (w) => { const i = w.indexOf(spec.marker); return i >= 0 && w.indexOf(spec.marker, i + 1) < 0 && [...w].every(c => spec.alphabet.includes(c)) && w.slice(i + 1) === rev(w.slice(0, i)); };
      return (w) => [...w].every(c => spec.alphabet.includes(c)) && w === rev(w) && (spec.parity === 'any' || (w.length % 2 === 0) === (spec.parity === 'even'));
    }
    case 'copy': {
      if (spec.marker) return (w) => { const i = w.indexOf(spec.marker); return i >= 0 && w.indexOf(spec.marker, i + 1) < 0 && [...w].every(c => spec.alphabet.includes(c)) && w.slice(0, i) === w.slice(i + 1); };
      return (w) => [...w].every(c => spec.alphabet.includes(c)) && w.length % 2 === 0 && w.slice(0, w.length / 2) === w.slice(w.length / 2);
    }
    case 'balanced': {
      const open = new Map(spec.pairs.map(([o, c]) => [o, c]));
      const close = new Set(spec.pairs.map(p => p[1]));
      return (w) => {
        const st = [];
        for (const ch of w) {
          if (open.has(ch)) st.push(open.get(ch));
          else if (close.has(ch)) { if (st.pop() !== ch) return false; }
          else return false;
        }
        return spec.allowOpen || st.length === 0;
      };
    }
    case 'pow2': return (w) => w.length > 0 && [...w].every(c => c === spec.sym) && (w.length & (w.length - 1)) === 0;
    default: return null;
  }
}

function blocksOracle(spec) {
  const { blocks, mins, dnf } = spec;
  const vars = [...new Set(blocks.flatMap(b => linVars(b.exp)))];
  const syms = blocks.map(b => b.sym);
  return (w) => {
    if (![...w].every(c => spec.alphabet.includes(c))) return false;
    // all ways to cut w into the block runs (blocks may repeat symbols, e.g. a^n b a^n)
    const L = w.length;
    const cuts = [];
    const rec = (bi, pos, lens) => {
      if (bi === blocks.length) { if (pos === L) cuts.push(lens.slice()); return; }
      let k = 0;
      for (;;) {
        lens.push(k); rec(bi + 1, pos + k, lens); lens.pop();
        if (pos + k < L && w[pos + k] === syms[bi]) k++; else break;
      }
    };
    rec(0, 0, []);
    if (!cuts.length) return false;
    // brute force over variable values 0..L
    const env = {};
    const tryVars = (vi, lens) => {
      if (vi === vars.length) {
        if (!blocks.every((b, i) => linEval(b.exp, env) === lens[i])) return false;
        return dnf.some(conj => conj.every(a => OPS[a.op](linEval(a.l, env), linEval(a.r, env))));
      }
      const v = vars[vi];
      for (let x = mins[v] ?? 0; x <= L; x++) { env[v] = x; if (tryVars(vi + 1, lens)) return true; }
      return false;
    };
    return cuts.some(lens => tryVars(0, lens));
  };
}

/** Expected output of a transducer task on input w (null: input must be rejected). */
export function opFunction(spec) {
  const flip = (c) => (c === '0' ? '1' : c === '1' ? '0' : c);
  const sep = (spec.sep || '0').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  switch (spec.op) {
    case 'complement': return (w) => (/^[01]*$/.test(w) ? [...w].map(flip).join('') : null);
    case 'twos': return (w) => {
      if (!/^[01]*$/.test(w)) return null;
      const i = w.lastIndexOf('1');
      return i < 0 ? w : [...w.slice(0, i)].map(flip).join('') + w.slice(i);
    };
    case 'inc': return spec.base === 'unary'
      ? (w) => (/^1*$/.test(w) ? w + '1' : null)
      : (w) => {
        if (!/^[01]*$/.test(w)) return null;
        let i = w.length - 1; const a = [...w];
        while (i >= 0 && a[i] === '1') { a[i] = '0'; i--; }
        if (i < 0) return '1' + a.join('');
        a[i] = '1'; return a.join('');
      };
    case 'dec': return spec.base === 'unary'
      ? (w) => (/^1+$/.test(w) ? w.slice(1) : null)
      : (w) => {
        if (!/^[01]*1[01]*$/.test(w)) return null;
        let i = w.length - 1; const a = [...w];
        while (a[i] === '0') { a[i] = '1'; i--; }
        a[i] = '0'; return a.join('');
      };
    case 'add': return (w) => { const m = w.match(new RegExp(`^(1*)${sep}(1*)$`)); return m ? m[1] + m[2] : null; };
    case 'sub': return (w) => { const m = w.match(new RegExp(`^(1*)${sep}(1*)$`)); return m ? '1'.repeat(Math.max(0, m[1].length - m[2].length)) : null; };
    case 'double': return spec.base === 'unary'
      ? (w) => (/^1*$/.test(w) ? w + w : null)
      : (w) => (/^[01]*$/.test(w) ? (w === '' ? '0' : w + '0') : null);
    default: return null;
  }
}
