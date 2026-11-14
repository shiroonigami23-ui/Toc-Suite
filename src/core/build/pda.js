// core/build/pda.js — pushdown automata from language specs.
//
// Counting languages ({aⁿb²ⁿ}, {aⁱbʲcᵏ | k = i+j}, {aⁱbʲ | i ≠ j}, #a = #b, …) are compiled by
// one general construction: the exponent vectors form a linear set; its defining equations
// (left null-space of the coefficient matrix) become signed counters on the stack, block length
// conditions (minimum, period) become finite control, and properly nested / sequential
// equations get their own stack symbols. Palindromes, copies with a centre marker and
// bracket languages have dedicated constructions. Every PDA is verified by the caller.

import { linStr, atomStr } from './lang.js';

// ------------------------------------------------------------------ tiny exact rationals

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => (a && b ? Math.abs(a * b) / gcd(a, b) : 0);
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
const qsub = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
const qmul = (a, b) => Q(a.n * b.n, a.d * b.d);
const qdiv = (a, b) => Q(a.n * b.d, a.d * b.n);
const isZero = (a) => a.n === 0;

/** Integer basis of { w : w·A = 0 } for an integer matrix A (rows = blocks, cols = vars). */
export function leftNullspace(A, cols) {
  const B = A.length;
  // Solve Aᵀ w = 0: matrix with `cols` rows and B columns.
  const m = Array.from({ length: cols }, (_, i) => A.map(row => Q(row[i] || 0)));
  const pivots = [];
  let r = 0;
  for (let c = 0; c < B && r < cols; c++) {
    let p = r;
    while (p < cols && isZero(m[p][c])) p++;
    if (p === cols) continue;
    [m[r], m[p]] = [m[p], m[r]];
    const pv = m[r][c];
    m[r] = m[r].map(x => qdiv(x, pv));
    for (let i = 0; i < cols; i++) if (i !== r && !isZero(m[i][c])) {
      const f = m[i][c];
      m[i] = m[i].map((x, j) => qsub(x, qmul(f, m[r][j])));
    }
    pivots.push(c);
    r++;
  }
  const free = [...Array(B).keys()].filter(c => !pivots.includes(c));
  return free.map(f => {
    const w = Array.from({ length: B }, () => Q(0));
    w[f] = Q(1);
    pivots.forEach((pc, i) => { w[pc] = Q(-m[i][f].n, m[i][f].d); });
    const L = w.reduce((acc, x) => lcm(acc || 1, x.d), 1);
    const ints = w.map(x => x.n * (L / x.d));
    const g = ints.reduce((a, b) => gcd(a, b), 0) || 1;
    return ints.map(x => x / g);
  });
}

/** Independent equations with the smallest supports (no disjointness needed: for TMs). */
function simpleEquations(basis) {
  const dim = basis.length;
  if (!dim) return [];
  const cands = combos(basis);
  const pick = [];
  const rank = (vs) => leftNullspace(vs, vs[0].length).length;
  for (const w of cands) {
    const trial = [...pick, w];
    // independent iff the matrix with these rows has full row rank: nullspace of its transpose is empty
    if (rank(trial) === 0) pick.push(w);
    if (pick.length === dim) break;
  }
  return pick.length === dim ? pick : null;
}

function combos(basis) {
  const dim = basis.length;
  const B = basis[0].length;
  const cands = new Map();
  const total = 5 ** dim;
  for (let idx = 0; idx < total; idx++) {
    let x = idx;
    const coef = [];
    for (let i = 0; i < dim; i++) { coef.push((x % 5) - 2); x = Math.floor(x / 5); }
    if (coef.every(c => c === 0)) continue;
    let w = Array(B).fill(0);
    basis.forEach((b, i) => b.forEach((v, j) => { w[j] += coef[i] * v; }));
    const g = w.reduce((a, b) => gcd(a, b), 0);
    if (!g) continue;
    w = w.map(v => v / g);
    if (w.find(v => v !== 0) < 0) w = w.map(v => -v);
    cands.set(w.join(','), w);
  }
  return [...cands.values()].sort((a, b) => a.filter(Boolean).length - b.filter(Boolean).length || a.reduce((s, v) => s + Math.abs(v), 0) - b.reduce((s, v) => s + Math.abs(v), 0));
}

/** Pick equations with disjoint support from small integer combinations of a basis. */
function niceEquations(basis) {
  const dim = basis.length;
  if (!dim) return [];
  const B = basis[0].length;
  const cands = new Map();
  const coef = Array(dim).fill(-2);
  const total = 5 ** dim;
  for (let idx = 0; idx < total; idx++) {
    let x = idx;
    for (let i = 0; i < dim; i++) { coef[i] = (x % 5) - 2; x = Math.floor(x / 5); }
    if (coef.every(c => c === 0)) continue;
    let w = Array(B).fill(0);
    basis.forEach((b, i) => b.forEach((v, j) => { w[j] += coef[i] * v; }));
    const g = w.reduce((a, b) => gcd(a, b), 0);
    if (!g) continue;
    w = w.map(v => v / g);
    const first = w.find(v => v !== 0);
    if (first < 0) w = w.map(v => -v);
    cands.set(w.join(','), w);
  }
  const list = [...cands.values()].sort((a, b) => a.filter(Boolean).length - b.filter(Boolean).length || a.reduce((s, v) => s + Math.abs(v), 0) - b.reduce((s, v) => s + Math.abs(v), 0));
  // choose `dim` vectors with pairwise disjoint supports (then they are independent)
  const pick = [];
  const rec = (i) => {
    if (pick.length === dim) return true;
    for (let k = i; k < list.length; k++) {
      const w = list[k];
      if (pick.every(p => p.every((v, j) => !(v && w[j])))) {
        pick.push(w);
        if (rec(k + 1)) return true;
        pick.pop();
      }
    }
    return false;
  };
  return rec(0) ? pick : null;
}

// ------------------------------------------------------------------ analysis of a block spec

/**
 * Turn one disjunct of a block spec into a counter program:
 *   blocks: [{ sym, lo, m, exact }]  (length ≥ lo and ≡ lo mod m, or exactly `exact`)
 *   eqs:    [{ w: [weight per block], init, cond }]  (counter starts at `init`, must end `cond` 0)
 */
export function blockProgram(spec, conj, { tm = false } = {}) {
  const blocks = spec.blocks.map(b => ({ sym: b.sym, exp: { k: { ...b.exp.k }, c: b.exp.c } }));
  const mins = { ...spec.mins };
  let vars = [...new Set(blocks.flatMap(b => Object.keys(b.exp.k).filter(v => b.exp.k[v])))];
  const ineqs = [];
  const extraMins = [];   // linear expressions that must stay ≥ a bound after substitution
  const subst = (lin, v, expr) => {
    const c = lin.k[v] || 0;
    if (!c) return lin;
    const k = { ...lin.k };
    delete k[v];
    for (const [u, x] of Object.entries(expr.k)) k[u] = (k[u] || 0) + c * x;
    return { k, c: lin.c + c * expr.c };
  };
  for (const atom of conj) {
    const diff = { k: { ...atom.l.k }, c: atom.l.c - atom.r.c };
    for (const [u, x] of Object.entries(atom.r.k)) diff.k[u] = (diff.k[u] || 0) - x;
    for (const u of Object.keys(diff.k)) if (!diff.k[u]) delete diff.k[u];
    if (atom.op !== '=') { ineqs.push({ lin: diff, op: atom.op, atom }); continue; }
    // eliminate a variable whose substitute has non-negative coefficients (k = i + j, not i = k - j)
    const units = Object.keys(diff.k).filter(u => Math.abs(diff.k[u]) === 1 && vars.includes(u));
    const v = units.find(u => Object.keys(diff.k).every(x => x === u || Math.sign(diff.k[x]) !== Math.sign(diff.k[u]))) || units[0];
    if (!v) {
      if (!Object.keys(diff.k).length) { if (diff.c !== 0) return { error: 'The conditions contradict each other.' }; continue; }
      return { error: `I can't solve “${atomStr(atom)}” for one variable.` };
    }
    // v = -(diff - c_v v)/c_v
    const cv = diff.k[v];
    const expr = { k: {}, c: -diff.c / cv };
    for (const [u, x] of Object.entries(diff.k)) if (u !== v) expr.k[u] = -x / cv;
    for (const b of blocks) b.exp = subst(b.exp, v, expr);
    for (const q of ineqs) q.lin = subst(q.lin, v, expr);
    for (const e of extraMins) e.lin = subst(e.lin, v, expr);
    extraMins.push({ lin: expr, min: mins[v] ?? 0 });
    delete mins[v];
    vars = vars.filter(u => u !== v);
  }
  vars = [...new Set(blocks.flatMap(b => Object.keys(b.exp.k).filter(v => b.exp.k[v])))];
  // An eliminated variable's lower bound must follow from the free variables' bounds.
  for (const e of extraMins) {
    const lowest = e.lin.c + Object.entries(e.lin.k).reduce((s, [u, x]) => s + (x >= 0 ? x * (mins[u] ?? 0) : -Infinity), 0);
    if (lowest < e.min) return { error: 'This mix of conditions needs an extra inequality that I cannot track with one stack.' };
  }
  const B = blocks.length;
  const A = blocks.map(b => vars.map(v => b.exp.k[v] || 0));
  if (A.some(row => row.some(x => !Number.isInteger(x) || x < 0))) return { error: 'Block lengths with negative or fractional coefficients are not supported.' };
  const out = blocks.map((b, i) => {
    const row = A[i];
    if (row.every(x => x === 0)) return { sym: b.sym, exact: b.exp.c };
    const m = row.reduce((a, x) => gcd(a, x), 0);
    const lo = b.exp.c + row.reduce((s, x, j) => s + x * (mins[vars[j]] ?? 0), 0);
    return { sym: b.sym, lo, m };
  });
  if (out.some(b => (b.exact ?? b.lo) < 0)) return { error: 'A block would need a negative length.' };
  const basis = leftNullspace(A, vars.length);
  const eqs0 = tm ? simpleEquations(basis) : niceEquations(basis);
  if (eqs0 === null) return { nonCF: true, error: 'two of its equalities share a block, and one stack cannot compare three counts at once' };
  const eqs = eqs0.map(w => ({ w, init: -w.reduce((s, x, i) => s + x * blocks[i].exp.c, 0), cond: '=' }));
  // Every block exponent minus its constant is a non-negative combination of the free vars, so
  // Σ w_b e_b = Σ w_b c_b is the equation; counter = Σ w_b e_b − K starts at −K.
  for (const q of ineqs) {
    if (eqs.length) return { error: 'An inequality on top of an equality needs two independent counts; a single stack cannot do it.' };
    // each variable in the inequality must be one block's length (up to a constant)
    const w = Array(B).fill(0);
    let K = q.lin.c;
    for (const [v, c] of Object.entries(q.lin.k)) {
      const bi = blocks.findIndex(b => b.exp.k[v] === 1 && Object.keys(b.exp.k).filter(u => b.exp.k[u]).length === 1);
      if (bi < 0) return { error: `I can't express “${atomStr(q.atom)}” through block lengths.` };
      w[bi] += c;
      K -= c * blocks[bi].exp.c;
    }
    eqs.push({ w, init: K, cond: q.op });
  }
  if (ineqs.length > 1) return { error: 'Only one inequality can be checked with one stack.' };
  if (tm) return { blocks: out, eqs };
  // laminar supports: an inner equation's span must not contain blocks of an outer one
  const span = eqs.map(e => { const idx = e.w.map((x, i) => (x ? i : -1)).filter(i => i >= 0); return [Math.min(...idx), Math.max(...idx)]; });
  for (let i = 0; i < eqs.length; i++) for (let j = 0; j < eqs.length; j++) {
    if (i === j) continue;
    const [a1, b1] = span[i], [a2, b2] = span[j];
    if (b1 < a2 || b2 < a1) continue;                               // disjoint (sequential)
    const inner = (a1 > a2 && b1 < b2) ? i : (a2 > a1 && b2 < b1) ? j : -1;
    if (inner < 0) return { nonCF: true, error: 'its equalities cross each other, and a stack can only match nested or consecutive counts' };
    const outer = inner === i ? j : i;
    for (let k = span[inner][0]; k <= span[inner][1]; k++) if (eqs[outer].w[k]) return { nonCF: true, error: 'its equalities cross each other, and a stack can only match nested or consecutive counts' };
  }
  return { blocks: out, eqs };
}

/** Counts in any order (#a = #b, #0 > #1, #a = 2#b): one hub block, one signed counter. */
export function countProgram(spec) {
  if (spec.atoms.length !== 1) return { nonCF: spec.atoms.length > 1, error: 'it compares more than two counts in any order, which needs more than one stack' };
  const a = spec.atoms[0];
  const weights = {};
  for (const x of spec.alphabet) weights[x] = (a.l.k[x] || 0) - (a.r.k[x] || 0);
  return { blocks: [{ syms: spec.alphabet, weights: [weights], lo: 0, m: 1 }], eqs: [{ w: [1], init: a.l.c - a.r.c, cond: a.op }] };
}

// ------------------------------------------------------------------ machine assembly helpers

const SYMS = [['X', 'Y'], ['U', 'V'], ['K', 'L'], ['M', 'N']];

class Asm {
  constructor() { this.states = []; this.trans = []; this.n = 0; }
  st(initial = false, accepting = false) { const id = 'q' + this.n++; this.states.push({ id, initial, accepting }); return id; }
  t(from, to, symbol, pop, push) { this.trans.push({ from, to, symbol: symbol ?? '', pop: pop ?? '', push: push ?? '' }); }
}

/** Compile counter programs (one per disjunct) into one PDA. */
export function compileCounterPda(programs, alphabet) {
  const asm = new Asm();
  const start = asm.st(true);
  const fin = asm.st(false, true);
  const stackSyms = new Set(['Z']);
  for (const prog of programs) {
    const entry = programs.length > 1 ? asm.st() : start;
    if (programs.length > 1) asm.t(start, entry, '', '', '');
    compileOne(asm, prog, entry, fin, stackSyms);
  }
  // renumber so the accepting state is last
  const order = [...asm.states.filter(s => s.id !== fin), asm.states.find(s => s.id === fin)];
  const map = new Map(order.map((s, i) => [s.id, 'q' + i]));
  return {
    type: 'PDA',
    states: order.map(s => ({ ...s, id: map.get(s.id) })),
    transitions: asm.trans.map(t => ({ ...t, from: map.get(t.from), to: map.get(t.to) })),
    alphabet: [...alphabet],
    stackAlphabet: [...stackSyms],
    initialStackSymbol: 'Z',
    acceptanceMode: 'FINAL_STATE',
  };
}

function compileOne(asm, prog, entry, fin, stackSyms) {
  const { blocks, eqs } = prog;
  const B = blocks.length;
  const sym = eqs.map((_, j) => SYMS[j] || SYMS[SYMS.length - 1]);
  eqs.forEach((_, j) => { stackSyms.add(sym[j][0]); stackSyms.add(sym[j][1]); });
  const eqOf = blocks.map((_, b) => eqs.findIndex(e => e.w[b]));
  const span = eqs.map(e => { const idx = e.w.map((x, i) => (x ? i : -1)).filter(i => i >= 0); return [Math.min(...idx), Math.max(...idx)]; });
  const condPos = (c) => ['>', '>=', '!='].includes(c);
  const condNeg = (c) => ['<', '<=', '!='].includes(c);
  // signs a counter may take while block b is read (or right after, for b = span end)
  // weights of equation j inside block k (a "hub" block reads several symbols with own weights)
  const ws = (j, k) => (blocks[k].weights ? Object.values(blocks[k].weights[j] || {}) : [eqs[j].w[k]]);
  const allowPos = (j, b) => condPos(eqs[j].cond) || blocks.some((_, k) => k >= b && ws(j, k).some(x => x < 0));
  const allowNeg = (j, b) => condNeg(eqs[j].cond) || blocks.some((_, k) => k >= b && ws(j, k).some(x => x > 0));
  // possible stack tops underneath equation j while block b is read
  const outerActive = (j, b) => eqs.map((_, k) => k).filter(k => k !== j && span[k][0] < span[j][0] && span[k][1] > span[j][1] && b > span[k][0]);
  const below = (j, b) => {
    const tops = new Set(['Z']);
    for (const k of outerActive(j, b)) {
      if (allowPos(k, b)) tops.add(sym[k][0]);
      if (allowNeg(k, b)) tops.add(sym[k][1]);
    }
    return [...tops];
  };
  const topsFor = (j, b) => {
    const t = new Set(below(j, b));
    if (allowPos(j, b)) t.add(sym[j][0]);
    if (allowNeg(j, b)) t.add(sym[j][1]);
    return [...t];
  };
  /** One unit of counter j in direction d, from state `from` to `to`, reading `input`. */
  const unit = (from, to, input, j, d, b) => {
    const [P, N] = sym[j];
    const up = d > 0 ? P : N, down = d > 0 ? N : P;
    const mayGrow = d > 0 ? allowPos(j, b) : allowNeg(j, b);
    for (const top of topsFor(j, b)) {
      if (top === down) asm.t(from, to, input, top, '');
      else if (top === up) { if (mayGrow) asm.t(from, to, input, top, up + up); }
      else if (mayGrow) asm.t(from, to, input, top, up + top);
    }
  };
  const apply = (from, to, input, j, w, b) => {
    if (!w) { asm.t(from, to, input, '', ''); return; }
    // several pushes in one move when the counter can only move away from zero here
    const [P, N] = sym[j];
    if (Math.abs(w) > 1 && (w > 0 ? !allowNeg(j, b) && allowPos(j, b) : !allowPos(j, b) && allowNeg(j, b))) {
      const up = w > 0 ? P : N;
      for (const top of topsFor(j, b)) asm.t(from, to, input, top, up.repeat(Math.abs(w)) + top);
      return;
    }
    const steps = Math.abs(w);
    let cur = from;
    for (let s = 0; s < steps; s++) {
      const next = s === steps - 1 ? to : asm.st();
      unit(cur, next, s === 0 ? input : '', j, Math.sign(w), b);
      cur = next;
    }
  };
  const check = (from, to, j, b) => {
    // leave the span of equation j: its counter must satisfy cond
    const [P, N] = sym[j];
    const c = eqs[j].cond;
    const ok = new Set();
    const bl = below(j, b);
    if (['=', '<=', '>='].includes(c)) bl.forEach(x => ok.add(x));
    if (condPos(c)) ok.add(P);
    if (condNeg(c)) ok.add(N);
    for (const top of ok) asm.t(from, to, '', top, top);
  };
  let cur = entry;
  for (let b = 0; b < B; b++) {
    // counters whose span starts here get their initial value
    for (let j = 0; j < eqs.length; j++) {
      if (span[j][0] !== b || !eqs[j].init) continue;
      const n = Math.abs(eqs[j].init);
      for (let s = 0; s < n; s++) { const nx = asm.st(); unit(cur, nx, '', j, Math.sign(eqs[j].init), b); cur = nx; }
    }
    const blk = blocks[b];
    const j = eqOf[b];
    const w = j >= 0 ? eqs[j].w[b] : 0;
    const size = blk.exact !== undefined ? blk.exact + 1 : blk.lo + blk.m;
    const pos = [cur];
    for (let i = 1; i < size; i++) pos.push(asm.st());
    for (let i = 0; i < size; i++) {
      let nxt;
      if (blk.exact !== undefined) nxt = i < blk.exact ? i + 1 : -1;
      else nxt = i + 1 < size ? i + 1 : blk.lo;
      if (nxt < 0) continue;
      if (blk.weights) for (const a of blk.syms) apply(pos[i], pos[nxt], a, j, j >= 0 ? (blk.weights[j]?.[a] || 0) : 0, b);
      else apply(pos[i], pos[nxt], blk.sym, j, w, b);
    }
    const exits = pos.filter((_, i) => (blk.exact !== undefined ? i === blk.exact : i >= blk.lo && (i - blk.lo) % blk.m === 0));
    const next = b === B - 1 ? fin : asm.st();
    const ending = eqs.findIndex((_, k) => span[k][1] === b);
    for (const e of exits) {
      if (ending >= 0) check(e, next, ending, b);
      else asm.t(e, next, '', '', '');
    }
    cur = next;
  }
}

// ------------------------------------------------------------------ other families

export function palindromePda(spec) {
  const A = spec.sigma;
  const asm = new Asm();
  const q0 = asm.st(true), q1 = asm.st(), qf = asm.st(false, true);
  const tops = ['Z', ...A.map(stackOf)];
  for (const a of A) for (const t of tops) asm.t(q0, q0, a, t, stackOf(a) + t);
  if (spec.parity === 'marker') {
    for (const t of tops) asm.t(q0, q1, spec.marker, t, t);
  } else {
    if (spec.parity !== 'odd') for (const t of tops) asm.t(q0, q1, '', t, t);
    if (spec.parity !== 'even') for (const a of A) for (const t of tops) asm.t(q0, q1, a, t, t);
  }
  for (const a of A) asm.t(q1, q1, a, stackOf(a), '');
  asm.t(q1, qf, '', 'Z', 'Z');
  return finish(asm, spec.alphabet, ['Z', ...A.map(stackOf)]);
}

function stackOf(a) {
  if (/[a-z]/.test(a)) return a.toUpperCase();
  return { 0: 'O', 1: 'I', 2: 'T', '(': 'P', '[': 'S', '{': 'C' }[a] || 'X';
}

export function balancedPda(spec) {
  const asm = new Asm();
  const q0 = asm.st(true), qf = asm.st(false, true);
  const marks = spec.pairs.map(([o]) => stackOf(o));
  const tops = ['Z', ...marks];
  spec.pairs.forEach(([o, c], i) => {
    for (const t of tops) asm.t(q0, q0, o, t, marks[i] + t);
    asm.t(q0, q0, c, marks[i], '');
  });
  if (spec.allowOpen) for (const t of tops) asm.t(q0, qf, '', t, t);
  else asm.t(q0, qf, '', 'Z', 'Z');
  return finish(asm, spec.alphabet, tops);
}

/** A DFA (app format) as a PDA that never uses its stack. */
export function dfaToPda(machine) {
  return {
    type: 'PDA',
    states: machine.states.map(s => ({ id: s.id, initial: !!s.initial, accepting: !!s.accepting })),
    transitions: machine.transitions.map(t => ({ from: t.from, to: t.to, symbol: t.symbol, pop: 'Z', push: 'Z' })),
    alphabet: [...machine.alphabet],
    stackAlphabet: ['Z'],
    initialStackSymbol: 'Z',
    acceptanceMode: 'FINAL_STATE',
  };
}

/** Final-state acceptance → empty-stack acceptance (new bottom marker S, drain state). */
export function toEmptyStack(pda) {
  const ids = new Set(pda.states.map(s => s.id));
  let k = pda.states.length;
  const fresh = () => { while (ids.has('q' + k)) k++; ids.add('q' + k); return 'q' + k++; };
  const s0 = fresh(), drain = fresh();
  const tops = [...new Set([...pda.stackAlphabet, 'S'])];
  const oldStart = pda.states.find(s => s.initial).id;
  const transitions = [{ from: s0, to: oldStart, symbol: '', pop: 'S', push: 'ZS' }, ...pda.transitions];
  for (const s of pda.states.filter(x => x.accepting)) for (const t of tops) transitions.push({ from: s.id, to: drain, symbol: '', pop: t, push: '' });
  for (const t of tops) transitions.push({ from: drain, to: drain, symbol: '', pop: t, push: '' });
  return {
    ...pda,
    states: [{ id: s0, initial: true, accepting: false }, ...pda.states.map(s => ({ ...s, initial: false, accepting: false })), { id: drain, initial: false, accepting: false }],
    transitions,
    stackAlphabet: tops,
    initialStackSymbol: 'S',
    acceptanceMode: 'EMPTY_STACK',
  };
}

function finish(asm, alphabet, stack) {
  return { type: 'PDA', states: asm.states, transitions: asm.trans, alphabet: [...alphabet], stackAlphabet: [...new Set(stack)], initialStackSymbol: 'Z', acceptanceMode: 'FINAL_STATE' };
}

/** How the counters are used, in words (for the explanation panel). */
export function describeProgram(prog, spec) {
  const parts = [];
  const sym = (j) => SYMS[j] || SYMS[SYMS.length - 1];
  prog.eqs.forEach((e, j) => {
    if (prog.blocks[0]?.weights) {
      // counts in any order: one signed counter
      const w = prog.blocks[0].weights[j] || {};
      const up = Object.keys(w).filter(a => w[a] > 0), down = Object.keys(w).filter(a => w[a] < 0);
      const cond = e.cond === '=' ? 'zero' : e.cond === '!=' ? 'non-zero' : e.cond === '>' ? 'positive' : e.cond === '<' ? 'negative' : e.cond === '>=' ? 'zero or positive' : 'zero or negative';
      const eff = [...up.map(a => `each ${a} adds ${w[a]}`), ...down.map(a => `each ${a} subtracts ${-w[a]}`)].join(', ');
      parts.push(`one signed counter (X's on the stack while positive, Y's while negative): ${eff}; accept if it ends ${cond}`);
      return;
    }
    const terms = e.w.map((x, b) => (x ? `${x > 0 ? '+' : '−'}${Math.abs(x) === 1 ? '' : Math.abs(x) + '·'}#${prog.blocks[b].sym ?? 'symbol'}` : '')).filter(Boolean).join(' ');
    const effects = e.w.map((x, b) => (x ? `each ${prog.blocks[b].sym} ${x > 0 ? 'pushes' : 'pops'} ${Math.abs(x) === 1 ? 'one' : Math.abs(x)} ${sym(j)[0]}` : '')).filter(Boolean).join(', ');
    parts.push(`counter ${terms}${e.init ? ` (starting at ${e.init > 0 ? '+' : ''}${e.init})` : ''} must be ${e.cond === '=' ? 'zero' : `${e.cond === '!=' ? '≠' : e.cond.replace('>=', '≥').replace('<=', '≤')} 0`} at the end of its blocks: ${effects}; going below zero uses ${sym(j)[1]}`);
  });
  const lens = prog.blocks.map(b => (b.exact !== undefined ? `exactly ${b.exact} ${b.sym}` : b.lo || b.m > 1 ? `${b.sym}-block length ≥ ${b.lo}${b.m > 1 ? `, step ${b.m}` : ''}` : '')).filter(Boolean);
  if (lens.length) parts.push(`finite control checks ${lens.join('; ')}`);
  return parts;
}

export { linStr };
