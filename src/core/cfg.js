// core/cfg.js — context-free grammar engine for the Grammar Studio (DOM-free, unit-tested).
//
//   parse        "S -> aSb | ε" (→, ::=, |, ε/eps/λ, multi-character symbols when spaced)
//   classify     Chomsky type 0–3, right/left-linear detection
//   analyse      nullable / generating / reachable, useless symbols, left recursion,
//                FIRST / FOLLOW, LL(1) table with conflicts
//   parse trees  exact for any CFG (ε-rules, left recursion, cycles): saturating parse counts
//                over all spans, up to two distinct trees (ambiguity witness), derivations
//   transform    remove useless / ε / unit rules, Chomsky normal form (each step recorded), CYK
//   convert      CFG → PDA, right/left-linear grammar → NFA
//   pumping      exhaustive check of a pumping-lemma witness for a fixed p (regular and CFL)

export const EPS = 'ε';
const EPS_WORDS = new Set(['ε', 'eps', 'epsilon', 'λ', 'lambda', 'lamda', 'e', '']);

// ------------------------------------------------------------------ parsing

const isNtToken = (t) => /^[A-Z][0-9']*$/.test(t) || /^<[^<>\s]+>$/.test(t) || /^[A-Z][A-Za-z0-9_']*$/.test(t);
const EPS_TOKENS = new Set(['ε', 'eps', 'epsilon', 'λ', 'lambda']);

function splitAlternative(alt, ntSet) {
  const s = alt.trim();
  if (s === '' || s === 'e' || EPS_TOKENS.has(s.toLowerCase())) return [];
  if (/\s/.test(s)) {
    return s.split(/\s+/).filter(t => !EPS_TOKENS.has(t.toLowerCase()));
  }
  // compact form: aSb, A1bB', <expr>+<term>
  const out = [];
  for (let i = 0; i < s.length;) {
    if (s[i] === '<') { const j = s.indexOf('>', i); if (j > i) { out.push(s.slice(i, j + 1)); i = j + 1; continue; } }
    if (/[A-Z]/.test(s[i])) { let j = i + 1; while (j < s.length && /[0-9']/.test(s[j])) j++; out.push(s.slice(i, j)); i = j; continue; }
    if (s[i] === 'ε') { i++; continue; }
    out.push(s[i]); i++;
  }
  return out;
}

/**
 * @returns {{ ok, grammar?, errors: string[], warnings: string[] }}
 * grammar = { start, nonterminals, terminals, rules: [{ lhs: string[], rhs: string[] }], isCfg }
 */
export function parseGrammar(text, startHint = '') {
  const errors = [];
  const warnings = [];
  const lines = String(text || '').split(/\r?\n|;/).map(l => l.replace(/\/\/.*$|#.*$/, '').trim()).filter(Boolean);
  const raw = [];
  for (const [n, line] of lines.entries()) {
    const m = line.match(/^(.+?)\s*(?:->|→|::=|=>|=|:)\s*(.*)$/);
    if (!m) { errors.push(`Line ${n + 1}: expected “A -> …”, got “${line}”.`); continue; }
    raw.push({ lhs: m[1].trim(), alts: m[2].split('|'), line: n + 1 });
  }
  // Non-terminals: every single-symbol left-hand side, plus capitalised / <angle> tokens
  const ntSet = new Set();
  for (const r of raw) { const t = splitAlternative(r.lhs, ntSet); if (t.length === 1) ntSet.add(t[0]); }
  const rules = [];
  for (const r of raw) {
    const lhs = splitAlternative(r.lhs, ntSet);
    if (!lhs.length) { errors.push(`Line ${r.line}: empty left-hand side.`); continue; }
    for (const alt of r.alts) {
      const rhs = splitAlternative(alt, ntSet);
      if (alt.trim() === '' && r.alts.length > 1) warnings.push(`Line ${r.line}: an empty alternative was read as ε.`);
      rules.push({ lhs, rhs });
    }
  }
  if (!rules.length && !errors.length) errors.push('Write at least one rule, e.g. “S -> a S b | ε”.');
  const isNt = (t) => ntSet.has(t) || isNtToken(t);
  for (const r of rules) for (const t of [...r.lhs, ...r.rhs]) if (isNt(t)) ntSet.add(t);
  const start = startHint && ntSet.has(startHint) ? startHint : rules[0]?.lhs.length === 1 ? rules[0].lhs[0] : [...ntSet][0];
  if (startHint && !ntSet.has(startHint)) warnings.push(`Start symbol “${startHint}” has no rules; using “${start}”.`);
  const terminals = [...new Set(rules.flatMap(r => [...r.lhs, ...r.rhs]).filter(t => !ntSet.has(t)))];
  const nonterminals = [start, ...[...ntSet].filter(x => x !== start)].filter(Boolean);
  const isCfg = rules.every(r => r.lhs.length === 1 && ntSet.has(r.lhs[0]));
  for (const nt of nonterminals) if (isCfg && !rules.some(r => r.lhs[0] === nt)) warnings.push(`“${nt}” is used but has no rules, so it derives nothing.`);
  return { ok: !errors.length, grammar: { start, nonterminals, terminals, rules, isCfg }, errors, warnings };
}

export const ruleStr = (r) => `${r.lhs.join(' ')} → ${r.rhs.length ? r.rhs.join(r.rhs.some(s => s.length > 1) ? ' ' : '') : EPS}`;

export function grammarText(g) {
  const by = new Map();
  for (const r of g.rules) { const k = r.lhs.join(' '); if (!by.has(k)) by.set(k, []); by.get(k).push(r.rhs); }
  const order = [...by.keys()].sort((a, b) => (a === g.start ? -1 : b === g.start ? 1 : 0));
  const spaced = g.rules.some(r => [...r.lhs, ...r.rhs].some(s => s.length > 1));
  return order.map(k => `${k} → ${by.get(k).map(rhs => (rhs.length ? rhs.join(spaced ? ' ' : '') : EPS)).join(' | ')}`).join('\n');
}

const rulesOf = (g, A) => g.rules.filter(r => r.lhs[0] === A);
const isNT = (g, s) => g.nonterminals.includes(s);

// ------------------------------------------------------------------ classification

export function classify(g) {
  const nts = new Set(g.nonterminals);
  const rightLinear = g.isCfg && g.rules.every(r => r.rhs.slice(0, -1).every(s => !nts.has(s)));
  const leftLinear = g.isCfg && g.rules.every(r => r.rhs.slice(1).every(s => !nts.has(s)));
  if (rightLinear || leftLinear) return { type: 3, name: 'Type 3 — regular grammar', rightLinear, leftLinear, detail: rightLinear ? 'right-linear (A → wB | w)' : 'left-linear (A → Bw | w)' };
  if (g.isCfg) return { type: 2, name: 'Type 2 — context-free grammar', detail: 'every left side is a single non-terminal' };
  const cs = g.rules.every(r => r.rhs.length >= r.lhs.length || (r.rhs.length === 0 && r.lhs.length === 1 && r.lhs[0] === g.start));
  return cs ? { type: 1, name: 'Type 1 — context-sensitive grammar', detail: 'no rule shortens the sentential form' } : { type: 0, name: 'Type 0 — unrestricted grammar', detail: 'some rule shortens the sentential form' };
}

// ------------------------------------------------------------------ analyses

export function nullableSet(g) {
  const N = new Set();
  for (let ch = true; ch;) { ch = false; for (const r of g.rules) if (!N.has(r.lhs[0]) && r.rhs.every(s => N.has(s))) { N.add(r.lhs[0]); ch = true; } }
  return N;
}
export function generatingSet(g) {
  const G = new Set();
  const ok = (s) => !isNT(g, s) || G.has(s);
  for (let ch = true; ch;) { ch = false; for (const r of g.rules) if (!G.has(r.lhs[0]) && r.rhs.every(ok)) { G.add(r.lhs[0]); ch = true; } }
  return G;
}
export function reachableSet(g) {
  const R = new Set([g.start]);
  for (let ch = true; ch;) { ch = false; for (const r of g.rules) if (R.has(r.lhs[0])) for (const s of r.rhs) if (isNT(g, s) && !R.has(s)) { R.add(s); ch = true; } }
  return R;
}

export function leftRecursive(g) {
  const N = nullableSet(g);
  const edges = new Map(g.nonterminals.map(A => [A, new Set()]));
  for (const r of g.rules) for (const s of r.rhs) { if (isNT(g, s)) edges.get(r.lhs[0])?.add(s); if (!N.has(s)) break; }
  const out = [];
  for (const A of g.nonterminals) {
    const seen = new Set(); const st = [...(edges.get(A) || [])];
    while (st.length) { const x = st.pop(); if (x === A) { out.push(A); break; } if (seen.has(x)) continue; seen.add(x); st.push(...(edges.get(x) || [])); }
  }
  return out;
}

export function firstFollow(g) {
  const N = nullableSet(g);
  const FIRST = new Map(g.nonterminals.map(A => [A, new Set()]));
  const firstOfSeq = (seq) => {
    const out = new Set();
    for (const s of seq) {
      if (!isNT(g, s)) { out.add(s); return { set: out, nullable: false }; }
      for (const x of FIRST.get(s) || []) out.add(x);
      if (!N.has(s)) return { set: out, nullable: false };
    }
    return { set: out, nullable: true };
  };
  for (let ch = true; ch;) {
    ch = false;
    for (const r of g.rules) { const f = FIRST.get(r.lhs[0]); for (const x of firstOfSeq(r.rhs).set) if (!f.has(x)) { f.add(x); ch = true; } }
  }
  const FOLLOW = new Map(g.nonterminals.map(A => [A, new Set()]));
  FOLLOW.get(g.start)?.add('$');
  for (let ch = true; ch;) {
    ch = false;
    for (const r of g.rules) r.rhs.forEach((s, i) => {
      if (!isNT(g, s)) return;
      const rest = firstOfSeq(r.rhs.slice(i + 1));
      const f = FOLLOW.get(s);
      for (const x of rest.set) if (!f.has(x)) { f.add(x); ch = true; }
      if (rest.nullable) for (const x of FOLLOW.get(r.lhs[0])) if (!f.has(x)) { f.add(x); ch = true; }
    });
  }
  // LL(1) table
  const table = new Map(g.nonterminals.map(A => [A, new Map()]));
  const conflicts = [];
  g.rules.forEach((r, ri) => {
    const fs = firstOfSeq(r.rhs);
    const put = (a) => {
      const row = table.get(r.lhs[0]);
      if (!row.has(a)) row.set(a, []);
      row.get(a).push(ri);
      if (row.get(a).length === 2) conflicts.push({ nt: r.lhs[0], terminal: a });
    };
    for (const a of fs.set) put(a);
    if (fs.nullable) for (const b of FOLLOW.get(r.lhs[0])) put(b);
  });
  return { FIRST, FOLLOW, nullable: N, table, conflicts, ll1: !conflicts.length, firstOfSeq };
}

/** Everything the overview panel shows. */
export function analyse(g) {
  const nullable = nullableSet(g), generating = generatingSet(g), reachable = reachableSet(g);
  const useless = g.isCfg ? g.nonterminals.filter(A => !generating.has(A) || !reachable.has(A)) : [];
  return {
    classification: classify(g), nullable, generating, reachable, useless,
    leftRecursive: g.isCfg ? leftRecursive(g) : [],
    emptyLanguage: g.isCfg && !generating.has(g.start),
    ...(g.isCfg ? firstFollow(g) : {}),
  };
}

// ------------------------------------------------------------------ parsing strings (any CFG)

export function tokenize(g, input) {
  const s = String(input ?? '').trim();
  if (s === '' || EPS_WORDS.has(s) && s !== 'e') return [];
  if (/\s/.test(s) || g.terminals.some(t => t.length > 1)) {
    if (/\s/.test(s)) return s.split(/\s+/);
    // greedy longest-match on the terminal set
    const ts = [...g.terminals].sort((a, b) => b.length - a.length);
    const out = [];
    for (let i = 0; i < s.length;) { const t = ts.find(x => s.startsWith(x, i)); if (!t) return null; out.push(t); i += t.length; }
    return out;
  }
  return [...s];
}

/**
 * Saturating parse-tree counts (0, 1 or 2 = "two or more") for every non-terminal and span.
 * Same-span dependencies (unit rules, nullable neighbours, cycles) are solved by a fixpoint.
 */
export function parseCounts(g, w) {
  const n = w.length;
  const NTs = g.nonterminals;
  const C = new Map();        // key `${A}|${i}|${j}` → count
  const key = (A, i, j) => A + '|' + i + '|' + j;
  const get = (A, i, j) => C.get(key(A, i, j)) || 0;
  const sat = (x) => (x > 2 ? 2 : x);
  const symCount = (s, i, j) => (isNT(g, s) ? get(s, i, j) : j === i + 1 && w[i] === s ? 1 : 0);
  const seqCount = (rhs, i, j) => {
    // f[p] = ways rhs[0..k) derives w[i..p)
    let f = new Array(j - i + 1).fill(0);
    f[0] = 1;
    for (const s of rhs) {
      const nf = new Array(j - i + 1).fill(0);
      for (let p = 0; p <= j - i; p++) {
        if (!f[p]) continue;
        for (let q = p; q <= j - i; q++) {
          const c = symCount(s, i + p, i + q);
          if (c) nf[q] = sat(nf[q] + f[p] * c);
        }
      }
      f = nf;
    }
    return f[j - i];
  };
  for (let len = 0; len <= n; len++) {
    for (let i = 0; i + len <= n; i++) {
      const j = i + len;
      for (let iter = 0, ch = true; ch && iter < 50; iter++) {
        ch = false;
        for (const A of NTs) {
          let total = 0;
          for (const r of rulesOf(g, A)) total = sat(total + seqCount(r.rhs, i, j));
          if (total !== get(A, i, j)) { C.set(key(A, i, j), total); ch = true; }
        }
      }
    }
  }
  return { get, seqCount, symCount, n };
}

/** Up to `limit` distinct parse trees of w from the start symbol. */
export function parseTrees(g, w, limit = 2) {
  const P = parseCounts(g, w);
  const n = w.length;
  if (!P.get(g.start, 0, n)) return { accepted: false, count: 0, trees: [] };
  // enumerate trees, never revisiting (A, i, j) on the current path → always terminates
  const expand = (A, i, j, path, want) => {
    const k = A + '|' + i + '|' + j;
    if (path.has(k) || !P.get(A, i, j)) return [];
    path.add(k);
    const out = [];
    for (const r of rulesOf(g, A)) {
      if (out.length >= want) break;
      for (const kids of seqTrees(r.rhs, i, j, path, want - out.length)) {
        out.push({ sym: A, rule: r, children: kids });
        if (out.length >= want) break;
      }
    }
    path.delete(k);
    return out;
  };
  const seqTrees = (rhs, i, j, path, want) => {
    if (!rhs.length) return i === j ? [[{ sym: EPS, children: [], leaf: true }]] : [];
    const [s, ...rest] = rhs;
    const out = [];
    for (let m = i; m <= j && out.length < want; m++) {
      if (!P.symCount(s, i, m) || (rest.length ? !P.seqCount(rest, m, j) : m !== j)) continue;
      const heads = isNT(g, s) ? expand(s, i, m, path, want) : [{ sym: s, children: [], leaf: true }];
      for (const h of heads) {
        const tails = rest.length ? seqTrees(rest, m, j, path, want - out.length) : [[]];
        for (const t of tails) { out.push([h, ...t]); if (out.length >= want) break; }
        if (out.length >= want) break;
      }
    }
    return out;
  };
  const trees = expand(g.start, 0, n, new Set(), limit);
  return { accepted: true, count: P.get(g.start, 0, n), trees };
}

export const accepts = (g, w) => parseCounts(g, w).get(g.start, 0, w.length) > 0;

/** Leftmost (or rightmost) derivation read off a parse tree. */
export function derivation(g, tree, rightmost = false) {
  const steps = [];
  let form = [tree];
  steps.push({ form: [tree.sym] });
  for (;;) {
    const idxs = form.map((x, i) => i).filter(i => !form[i].leaf && isNT(g, form[i].sym));
    if (!idxs.length) break;
    const at = rightmost ? idxs[idxs.length - 1] : idxs[0];
    const node = form[at];
    const kids = node.children.filter(c => c.sym !== EPS);
    form = [...form.slice(0, at), ...kids, ...form.slice(at + 1)];
    steps.push({ form: form.map(x => x.sym), rule: node.rule });
  }
  return steps;
}

// ------------------------------------------------------------------ transformations

const clone = (g) => ({ ...g, nonterminals: [...g.nonterminals], terminals: [...g.terminals], rules: g.rules.map(r => ({ lhs: [...r.lhs], rhs: [...r.rhs] })) });
const dedupe = (rules) => { const seen = new Set(); return rules.filter(r => { const k = r.lhs.join(' ') + '→' + r.rhs.join(' '); if (seen.has(k)) return false; seen.add(k); return true; }); };
const refresh = (g) => {
  const used = new Set([g.start, ...g.rules.flatMap(r => [r.lhs[0], ...r.rhs.filter(s => isNT(g, s))])]);
  return { ...g, rules: dedupe(g.rules), nonterminals: g.nonterminals.filter(A => used.has(A)), terminals: [...new Set(g.rules.flatMap(r => r.rhs.filter(s => !isNT(g, s))))] };
};
const freshNt = (g, base) => {
  const taken = new Set(g.nonterminals);
  if (!taken.has(base + "'")) return base + "'";
  for (let k = 0; ; k++) { const c = base + k; if (!taken.has(c)) return c; }
};

export function removeUseless(g) {
  let h = clone(g);
  const G = generatingSet(h);
  h.rules = h.rules.filter(r => G.has(r.lhs[0]) && r.rhs.every(s => !isNT(h, s) || G.has(s)));
  const R = reachableSet(h);
  h.rules = h.rules.filter(r => R.has(r.lhs[0]));
  return refresh(h);
}

export function removeEpsilon(g) {
  let h = clone(g);
  const N = nullableSet(h);
  const out = [];
  for (const r of h.rules) {
    const opt = r.rhs.map((s, i) => (N.has(s) ? i : -1)).filter(i => i >= 0);
    for (let mask = 0; mask < 1 << opt.length; mask++) {
      const drop = new Set(opt.filter((_, k) => mask & (1 << k)));
      const rhs = r.rhs.filter((_, i) => !drop.has(i));
      if (rhs.length) out.push({ lhs: [...r.lhs], rhs });
    }
  }
  h.rules = out;
  if (N.has(h.start)) {
    const S0 = freshNt(h, h.start);
    h.nonterminals = [S0, ...h.nonterminals];
    h.rules = [{ lhs: [S0], rhs: [h.start] }, { lhs: [S0], rhs: [] }, ...h.rules];
    h.start = S0;
  }
  return refresh(h);
}

export function removeUnit(g) {
  const h = clone(g);
  const unit = (r) => r.rhs.length === 1 && isNT(h, r.rhs[0]);
  const out = [];
  for (const A of h.nonterminals) {
    const reach = new Set([A]);
    for (let ch = true; ch;) { ch = false; for (const r of h.rules) if (reach.has(r.lhs[0]) && unit(r) && !reach.has(r.rhs[0])) { reach.add(r.rhs[0]); ch = true; } }
    for (const B of reach) for (const r of rulesOf(h, B)) if (!unit(r)) out.push({ lhs: [A], rhs: [...r.rhs] });
  }
  h.rules = out;
  return refresh(h);
}

export function simplify(g) {
  const steps = [];
  let h = removeUseless(g); steps.push({ title: 'Remove useless symbols', grammar: h });
  h = removeEpsilon(h); steps.push({ title: 'Remove ε-rules', grammar: h });
  h = removeUnit(h); steps.push({ title: 'Remove unit rules', grammar: h });
  h = removeUseless(h); steps.push({ title: 'Remove useless symbols again', grammar: h });
  return { grammar: h, steps };
}

/** Chomsky normal form: START, DEL (ε), UNIT, useless, TERM, BIN — every step kept. */
export function toCnf(g) {
  const steps = [];
  let h = clone(g);
  if (h.rules.some(r => r.rhs.includes(h.start))) {
    const S0 = freshNt(h, h.start);
    h.nonterminals = [S0, ...h.nonterminals];
    h.rules = [{ lhs: [S0], rhs: [h.start] }, ...h.rules];
    h.start = S0;
    steps.push({ title: 'START: new start symbol that never appears on a right side', grammar: clone(h) });
  }
  h = removeEpsilon(h); steps.push({ title: 'DEL: remove ε-rules (keep S → ε only for the start symbol)', grammar: h });
  h = removeUnit(h); steps.push({ title: 'UNIT: remove unit rules A → B', grammar: h });
  h = removeUseless(h); steps.push({ title: 'Remove useless symbols', grammar: h });
  // TERM
  h = clone(h);
  const termNt = new Map();
  const tName = (a) => {
    if (!termNt.has(a)) {
      let name = /^[a-z]$/.test(a) ? a.toUpperCase() : 'T';
      if (h.nonterminals.includes(name) || termNt.has(name)) name = freshNt(h, `T${/^[a-z0-9]$/i.test(a) ? '_' + a : ''}`.replace(/'$/, '') || 'T');
      termNt.set(a, name);
      h.nonterminals.push(name);
    }
    return termNt.get(a);
  };
  for (const r of h.rules) if (r.rhs.length >= 2) r.rhs = r.rhs.map(s => (isNT(h, s) ? s : tName(s)));
  for (const [a, A] of termNt) h.rules.push({ lhs: [A], rhs: [a] });
  if (termNt.size) steps.push({ title: 'TERM: replace terminals in long rules by new non-terminals', grammar: refresh(h) });
  // BIN
  h = clone(refresh(h));
  const out = [];
  let k = 1;
  const memo = new Map();
  for (const r of h.rules) {
    if (r.rhs.length <= 2) { out.push(r); continue; }
    let lhs = r.lhs[0];
    let rhs = r.rhs;
    while (rhs.length > 2) {
      const tailKey = rhs.slice(1).join(' ');
      let X = memo.get(tailKey);
      const isNew = !X;
      if (!X) { do { X = `X${k++}`; } while (h.nonterminals.includes(X)); h.nonterminals.push(X); memo.set(tailKey, X); }
      out.push({ lhs: [lhs], rhs: [rhs[0], X] });
      if (!isNew) { rhs = null; break; }
      lhs = X;
      rhs = rhs.slice(1);
    }
    if (rhs) out.push({ lhs: [lhs], rhs });
  }
  h.rules = out;
  h = refresh(h);
  steps.push({ title: 'BIN: split right sides longer than two', grammar: h });
  return { grammar: h, steps };
}

export function isCnf(g) {
  return g.isCfg && g.rules.every(r => (r.rhs.length === 2 && r.rhs.every(s => isNT(g, s) && s !== g.start)) || (r.rhs.length === 1 && !isNT(g, r.rhs[0])) || (r.rhs.length === 0 && r.lhs[0] === g.start));
}

/** CYK on a CNF grammar: table[len-1][i] = set of non-terminals deriving w[i..i+len). */
export function cyk(g, w) {
  const n = w.length;
  if (!n) return { accepted: g.rules.some(r => r.lhs[0] === g.start && !r.rhs.length), table: [] };
  const table = Array.from({ length: n }, (_, l) => Array.from({ length: n - l }, () => new Set()));
  for (let i = 0; i < n; i++) for (const r of g.rules) if (r.rhs.length === 1 && r.rhs[0] === w[i]) table[0][i].add(r.lhs[0]);
  for (let len = 2; len <= n; len++) for (let i = 0; i + len <= n; i++) for (let s = 1; s < len; s++) {
    const L = table[s - 1][i], R = table[len - s - 1][i + s];
    for (const r of g.rules) if (r.rhs.length === 2 && L.has(r.rhs[0]) && R.has(r.rhs[1])) table[len - 1][i].add(r.lhs[0]);
  }
  return { accepted: table[n - 1][0].has(g.start), table };
}

// ------------------------------------------------------------------ language samples

export function sampleStrings(g, maxLen = 6, limit = 40) {
  const sigma = g.terminals;
  const out = [];
  if (!sigma.length) return accepts(g, []) ? [''] : [];
  let layer = [[]];
  for (let L = 0; L <= maxLen && out.length < limit; L++) {
    if (L > 0) layer = layer.flatMap(w => sigma.map(a => [...w, a]));
    if (layer.length > 20000) break;
    for (const w of layer) { if (accepts(g, w)) out.push(w); if (out.length >= limit) break; }
  }
  const spaced = sigma.some(t => t.length > 1);
  return out.map(w => w.join(spaced ? ' ' : ''));
}

// ------------------------------------------------------------------ conversions

/** Standard CFG → PDA (one working state): expand non-terminals on the stack, match terminals. */
export function toPda(g) {
  const multi = [...g.nonterminals, ...g.terminals].some(s => s.length !== 1);
  if (multi) {
    const bad = g.terminals.filter(t => t.length !== 1);
    if (bad.length) return { error: `The PDA studio reads one character per input symbol, but this grammar has terminals ${bad.slice(0, 4).map(t => `“${t}”`).join(', ')}.` };
  }
  // single-character stack names for the non-terminals
  const used = new Set([...g.terminals, 'Z']);
  const pool = 'SABCDEFGHIJKLMNOPQRTUVWXY'.split('').filter(c => !used.has(c));
  const name = new Map();
  for (const A of g.nonterminals) {
    if (A.length === 1 && /[A-Z]/.test(A) && !used.has(A) && ![...name.values()].includes(A)) name.set(A, A);
  }
  for (const A of g.nonterminals) if (!name.has(A)) { const c = pool.find(x => ![...name.values()].includes(x)); if (!c) return { error: 'Too many non-terminals for single-letter stack symbols.' }; name.set(A, c); }
  const sym = (s) => (isNT(g, s) ? name.get(s) : s);
  const transitions = [
    { from: 'q0', to: 'q1', symbol: '', pop: 'Z', push: sym(g.start) + 'Z' },
    ...g.rules.map(r => ({ from: 'q1', to: 'q1', symbol: '', pop: sym(r.lhs[0]), push: r.rhs.map(sym).join('') })),
    ...g.terminals.map(a => ({ from: 'q1', to: 'q1', symbol: a, pop: a, push: '' })),
    { from: 'q1', to: 'q2', symbol: '', pop: 'Z', push: 'Z' },
  ];
  return {
    machine: {
      type: 'NPDA', title: 'PDA from grammar', acceptanceMode: 'FINAL_STATE', initialStackSymbol: 'Z',
      alphabet: [...g.terminals], stackAlphabet: [...new Set(['Z', ...name.values(), ...g.terminals])],
      states: [{ id: 'q0', initial: true, accepting: false, x: 180, y: 260 }, { id: 'q1', initial: false, accepting: false, x: 420, y: 260 }, { id: 'q2', initial: false, accepting: true, x: 660, y: 260 }],
      transitions,
    },
    renamed: [...name].filter(([a, b]) => a !== b),
  };
}

/** Right-linear (or left-linear, by reversal) grammar → NFA in app format. */
export function regularToNfa(g) {
  const cls = classify(g);
  if (cls.type !== 3) return { error: 'Only regular (right- or left-linear) grammars convert directly to a finite automaton.' };
  const reverse = !cls.rightLinear;
  const rules = reverse ? g.rules.map(r => ({ lhs: r.lhs, rhs: [...r.rhs].reverse() })) : g.rules;
  const states = new Map();
  const id = (A) => { if (!states.has(A)) states.set(A, 'q' + states.size); return states.get(A); };
  id(g.start);
  const F = 'qF';
  const trans = [];
  let k = 0;
  const accepting = new Set([F]);
  for (const r of rules) {
    const A = r.lhs[0];
    const last = r.rhs[r.rhs.length - 1];
    const target = last !== undefined && isNT(g, last) ? id(last) : F;
    const word = target === F ? r.rhs : r.rhs.slice(0, -1);
    if (!word.length) {
      if (target === F) accepting.add(id(A));
      else trans.push({ from: id(A), to: target, symbol: 'ε' });
      continue;
    }
    let cur = id(A);
    word.forEach((a, i) => {
      const nxt = i === word.length - 1 ? target : `m${k++}`;
      trans.push({ from: cur, to: nxt, symbol: a });
      cur = nxt;
    });
  }
  let ids = [...states.values(), F, ...Array.from({ length: k }, (_, i) => `m${i}`)];
  let m = { states: ids.map(s => ({ id: s, initial: s === 'q0', accepting: accepting.has(s) })), transitions: trans };
  if (reverse) {
    // reverse the automaton: flip edges, new start with ε to old accepting states
    const old = m;
    m = {
      states: [{ id: 'r0', initial: true, accepting: false }, ...old.states.map(s => ({ id: s.id, initial: false, accepting: s.initial }))],
      transitions: [...old.transitions.map(t => ({ from: t.to, to: t.from, symbol: t.symbol })), ...old.states.filter(s => s.accepting).map(s => ({ from: 'r0', to: s.id, symbol: 'ε' }))],
    };
  }
  const usesEps = m.transitions.some(t => t.symbol === 'ε');
  // drop states that are unreachable
  const reach = new Set([m.states.find(s => s.initial).id]);
  for (let ch = true; ch;) { ch = false; for (const t of m.transitions) if (reach.has(t.from) && !reach.has(t.to)) { reach.add(t.to); ch = true; } }
  return { machine: { type: usesEps ? 'ENFA' : 'NFA', title: 'NFA from grammar', alphabet: [...g.terminals], states: m.states.filter(s => reach.has(s.id)), transitions: m.transitions.filter(t => reach.has(t.from)) }, reversed: reverse };
}

// ------------------------------------------------------------------ pumping lemma checker

/** "a^p b^p c^p", "0^p 1^(2p)", "a^(p+1) b^p" with a concrete p → the string. */
export function expandWitness(expr, p) {
  const s = String(expr).replace(/\s+/g, ' ').trim();
  let out = '';
  const re = /([^\s^()]+?)\^(\(([^)]*)\)|\{([^}]*)\}|[0-9a-z+*-]+)|([^\s^]+)/g;
  for (const m of s.matchAll(re)) {
    if (m[5]) { out += m[5]; continue; }
    const base = m[1];
    const e = (m[3] ?? m[4] ?? m[2]).replace(/\s+/g, '');
    let val;
    try {
      if (!/^[0-9p+*-]+$/.test(e.replace(/(\d)p/g, '$1*p'))) return null;
      val = Function('p', `return (${e.replace(/(\d)p/g, '$1*p')});`)(p);
    } catch { return null; }
    if (!Number.isInteger(val) || val < 0) return null;
    out += base.repeat(val);
  }
  return out;
}

/**
 * Check every legal split of w. mode 'cfl': w = uvxyz, |vxy| ≤ p, |vy| ≥ 1; mode 'regular':
 * w = xyz, |xy| ≤ p, |y| ≥ 1. A split "survives" when every pumped string uv^i xy^i z for
 * i ∈ 0..maxI stays in L. The witness works iff no split survives.
 */
export function pumpingCheck(w, p, member, mode = 'cfl', maxI = 3) {
  const n = w.length;
  const splits = [];
  let survivor = null;
  const pumped = (parts, i) => (mode === 'cfl'
    ? parts[0] + parts[1].repeat(i) + parts[2] + parts[3].repeat(i) + parts[4]
    : parts[0] + parts[1].repeat(i) + parts[2]);
  if (mode === 'cfl') {
    for (let a = 0; a <= n; a++) for (let b = a; b <= Math.min(n, a + p); b++) for (let c = b; c <= Math.min(n, a + p); c++) for (let d = c; d <= Math.min(n, a + p); d++) {
      if ((b - a) + (d - c) < 1) continue;
      splits.push([w.slice(0, a), w.slice(a, b), w.slice(b, c), w.slice(c, d), w.slice(d)]);
    }
  } else {
    for (let a = 0; a <= Math.min(n, p); a++) for (let b = a + 1; b <= Math.min(n, p); b++) splits.push([w.slice(0, a), w.slice(a, b), w.slice(b)]);
  }
  const breaks = [];
  for (const s of splits) {
    let bad = -1;
    for (let i = 0; i <= maxI; i++) if (i !== 1 && !member(pumped(s, i))) { bad = i; break; }
    if (bad < 0) { survivor = s; break; }
    if (breaks.length < 6) breaks.push({ split: s, i: bad, pumped: pumped(s, bad) });
  }
  return { inLanguage: member(w), total: splits.length, survivor, examples: breaks, works: member(w) && !survivor && w.length >= p };
}

/** Classic grammars for the examples menu. */
export const EXAMPLES = [
  { name: 'aⁿbⁿ (n ≥ 0)', text: 'S -> a S b | ε' },
  { name: 'Palindromes over {a,b}', text: 'S -> a S a | b S b | a | b | ε' },
  { name: 'Balanced parentheses', text: 'S -> ( S ) S | ε' },
  { name: 'Equal numbers of a and b', text: 'S -> a S b S | b S a S | ε' },
  { name: 'aⁱbʲcᵏ with i = j or j = k', text: 'S -> X C | A Y\nX -> a X b | ε\nC -> c C | ε\nA -> a A | ε\nY -> b Y c | ε' },
  { name: 'Arithmetic expressions (unambiguous)', text: 'E -> E + T | T\nT -> T * F | F\nF -> ( E ) | a' },
  { name: 'Arithmetic expressions (ambiguous)', text: 'E -> E + E | E * E | ( E ) | a' },
  { name: 'Expressions for LL(1)', text: "E -> T E'\nE' -> + T E' | ε\nT -> F T'\nT' -> * F T' | ε\nF -> ( E ) | a" },
  { name: 'Dangling else (ambiguous)', text: 'S -> i S | i S e S | a' },
  { name: 'Right-linear: strings ending in ab', text: 'S -> a S | b S | a B\nB -> b' },
  { name: 'Grammar with useless and ε-rules', text: 'S -> A B | a C\nA -> a A | ε\nB -> b B | ε\nC -> C c\nD -> d' },
  { name: 'Context-sensitive aⁿbⁿcⁿ (Type 1)', text: 'S -> a S B C | a B C\nC B -> B C\na B -> a b\nb B -> b b\nb C -> b c\nc C -> c c' },
];
