// core/build/tm.js — Turing machines from language specs and tasks.
//
// Deciders are assembled from phases that each start and end at the left end of the input:
//   shape check  — a DFA pass (e.g. a*b*c* with length conditions), then rewind
//   crossing-off — one phase per linear equation: mark symbols of the positive side and of the
//                  negative side in the right ratio until one side runs out
//   unmark       — restore the marked symbols before the next phase
// Union ("i = j or j = k") routes the failure of one alternative to the next one.
// Palindromes, ww, w#w, powers of two and the arithmetic tasks have classic hand-made machines.
// Every machine is verified by the caller on all short inputs.

const MARK_POOL = 'XYWVUKMNPQRSTJHGFEDA';

class Tm {
  constructor(sigma) {
    this.sigma = sigma;
    this.states = [];
    this.trans = [];
    this.n = 0;
    this.marks = new Map();
    const used = new Set([...sigma, 'B']);
    const pool = [...MARK_POOL].filter(c => !used.has(c) && !used.has(c.toLowerCase()));
    sigma.forEach((s, i) => this.marks.set(s, pool[i]));
    this.tape = [...sigma, ...this.marks.values()];
  }
  st(accepting = false, name) { const id = name || 'q' + this.n++; this.states.push({ id, initial: this.states.length === 0, accepting }); return id; }
  t(from, read, write, move, to) {
    if (this.trans.some(x => x.from === from && x.read === read)) return;   // first rule wins
    this.trans.push({ from, to, read, write, move });
  }
  mark(s) { return this.marks.get(s); }
  /** move left over everything until the blank, then step right into `to` */
  rewind(to) {
    this.rew ??= new Map();
    if (this.rew.has(to)) return this.rew.get(to);
    const r = this.st();
    this.rew.set(to, r);
    for (const c of this.tape) this.t(r, c, c, 'L', r);
    this.t(r, 'B', 'B', 'R', to);
    return r;
  }
  machine(alphabet, title) {
    return minimizeTm({
      type: 'TM', title, states: this.states, transitions: this.trans, blankSymbol: 'B',
      alphabet: [...alphabet], inputAlphabet: [...alphabet], tapeAlphabet: [...new Set([...this.tape, 'B'])],
    });
  }
}

// ------------------------------------------------------------------ phases

/** DFA pass from the left end. Ends (at the left end again) in `next`; mismatch → `fail`. */
function shapePhase(tm, dfa, next, fail, { rewindAfter = true } = {}) {
  const ids = dfa.delta.map(() => tm.st());
  const dead = deadOf(dfa);
  const after = rewindAfter ? tm.rewind(next) : next;
  dfa.delta.forEach((row, q) => {
    row.forEach((r, j) => {
      const a = dfa.alphabet[j];
      if (dead[r]) { if (fail) tm.t(ids[q], a, a, 'L', fail); return; }
      tm.t(ids[q], a, a, 'R', ids[r]);
    });
    if (dfa.accept[q]) tm.t(ids[q], 'B', 'B', 'L', after);
    else if (fail) tm.t(ids[q], 'B', 'B', 'L', fail);
    if (fail) for (const c of tm.tape) if (!dfa.alphabet.includes(c)) tm.t(ids[q], c, c, 'L', fail);
  });
  return ids[dfa.start];
}

function deadOf(dfa) {
  const n = dfa.delta.length;
  const live = dfa.accept.map(Boolean);
  for (let ch = true; ch;) { ch = false; for (let q = 0; q < n; q++) if (!live[q] && dfa.delta[q].some(r => live[r])) { live[q] = true; ch = true; } }
  return live.map(x => !x);
}

/** Mark one unmarked symbol from `set`, scanning right from the left end. */
function markOne(tm, set, found, none, at) {
  const s = at || tm.st();
  for (const c of tm.tape) if (!set.includes(c)) tm.t(s, c, c, 'R', s);
  for (const a of set) tm.t(s, a, tm.mark(a), 'L', found);   // step left so a following rewind never starts on the right-hand blank
  tm.t(s, 'B', 'B', 'L', none);
  return s;
}

/**
 * Crossing-off for Σ w_s·#s (cond) 0. Positive side: symbols with w > 0 (all weight p),
 * negative side: weight −n. A round marks n positive and p negative symbols.
 */
function equationPhase(tm, weights, cond, next, fail) {
  const P = Object.keys(weights).filter(s => weights[s] > 0);
  const N = Object.keys(weights).filter(s => weights[s] < 0);
  const p = P.length ? weights[P[0]] : 1, n = N.length ? -weights[N[0]] : 1;
  const allowZero = ['=', '<=', '>='].includes(cond), allowPos = ['>', '>=', '!='].includes(cond), allowNeg = ['<', '<=', '!='].includes(cond);
  const failT = fail || tm.st();          // a state without moves rejects
  const done = tm.rewind(next);
  const ok = (flag) => (flag ? done : failT);
  // round start
  const roundStart = tm.st();
  // exhausted positive side at round start → is any negative symbol left?
  const checkNeg = markOne(tm, N, tm.rewind(ok(allowNeg)), ok(allowZero));
  const afterNoP = tm.rewind(checkNeg);
  // mark n positive symbols
  const chainP = [];
  for (let i = 0; i < n; i++) chainP.push(i === 0 ? roundStart : tm.st());
  const negChain = [];
  for (let i = 0; i < p; i++) negChain.push(tm.st());
  for (let i = 0; i < n; i++) {
    const foundTo = i + 1 < n ? tm.rewind(chainP[i + 1]) : tm.rewind(negChain[0]);
    markOne(tm, P, foundTo, i === 0 ? afterNoP : failT, chainP[i]);
  }
  // mark p negative symbols
  for (let i = 0; i < p; i++) {
    const foundTo = i + 1 < p ? tm.rewind(negChain[i + 1]) : tm.rewind(roundStart);
    const exhausted = i === 0 ? ok(allowPos) : failT;
    markOne(tm, N, foundTo, exhausted, negChain[i]);
  }
  return roundStart;
}

/** Restore every mark to its symbol, then rewind into `next`. */
function unmarkPhase(tm, next) {
  const s = tm.st();
  for (const a of tm.sigma) { tm.t(s, tm.mark(a), a, 'R', s); tm.t(s, a, a, 'R', s); }
  tm.t(s, 'B', 'B', 'L', tm.rewind(next));
  return s;
}

// ------------------------------------------------------------------ deciders from programs

/**
 * alternatives: [{ shape: DFA|null, eqs: [{ weights: {sym: w}, cond }] }]
 * Each alternative runs its shape pass and equation phases; failure falls through to the next.
 */
export function compileDecider(sigma, alternatives, title) {
  const tm = new Tm(sigma);
  const start = tm.st();
  const acc = tm.st(true, 'qacc');
  let entry = start;
  alternatives.forEach((alt, ai) => {
    const last = ai === alternatives.length - 1;
    const fail = last ? null : tm.st();
    // build backwards: accept ← eq_k ← unmark ← … ← eq_1 ← shape
    let next = acc;
    for (let k = alt.eqs.length - 1; k >= 0; k--) {
      const eqStart = equationPhase(tm, alt.eqs[k].weights, alt.eqs[k].cond, next, fail);
      next = k > 0 ? unmarkPhase(tm, eqStart) : eqStart;
    }
    const first = alt.shape ? shapePhase(tm, alt.shape, next, fail) : next;
    link(tm, entry, first);
    if (fail) {
      // restore the tape, then try the next alternative
      const nextEntry = tm.st();
      const sweep = unmarkPhase(tm, nextEntry);
      const back = tm.rewind(sweep);
      link(tm, fail, back);
      entry = nextEntry;
    }
  });
  return tm.machine(sigma, title);
}

/** Make `from` behave exactly like `to` (ε-free: copy to's rules under from's name). */
function link(tm, from, to) {
  if (from === to) return;
  // rename `to` → `from` everywhere (to is a fresh phase entry with no other references)
  const refs = tm.trans.filter(t => t.to === to).length;
  if (refs === 0) {
    tm.trans.forEach(t => { if (t.from === to) t.from = from; });
    const st = tm.states.find(s => s.id === to);
    const keep = tm.states.find(s => s.id === from);
    if (st && keep) { keep.accepting = keep.accepting || st.accepting; tm.states = tm.states.filter(s => s.id !== to); }
  } else {
    // `to` is also a loop target: give `from` copies of its rules
    for (const t of tm.trans.filter(x => x.from === to)) tm.t(from, t.read, t.write, t.move, t.to);
  }
}

/** DFA (internal format) → TM that scans right and accepts at the blank in an accepting state. */
export function dfaToTm(dfa, title) {
  const tm = new Tm(dfa.alphabet);
  const start = tm.st();
  const acc = tm.st(true, 'qacc');
  const first = shapePhase(tm, dfa, acc, null, { rewindAfter: false });
  link(tm, start, first);
  return tm.machine(dfa.alphabet, title);
}

// ------------------------------------------------------------------ classic machines

export function palindromeTm(sigma, title) {
  const tm = new Tm(sigma);
  const q0 = tm.st();
  const acc = tm.st(true, 'qacc');
  const back = tm.st();
  tm.t(q0, 'B', 'B', 'R', acc);
  for (const a of sigma) {
    const carry = tm.st(), check = tm.st();
    tm.t(q0, a, 'B', 'R', carry);
    for (const c of sigma) tm.t(carry, c, c, 'R', carry);
    tm.t(carry, 'B', 'B', 'L', check);
    tm.t(check, a, 'B', 'L', back);
    tm.t(check, 'B', 'B', 'R', acc);             // the erased symbol was the middle one
  }
  for (const c of sigma) tm.t(back, c, c, 'L', back);
  tm.t(back, 'B', 'B', 'R', q0);
  return tm.machine(sigma, title);
}

/** Palindromes with a parity or centre-marker condition: DFA pre-check, then the classic check. */
export function palindromeWithShape(sigmaAll, shapeDfa, title) {
  const pal = palindromeTm(sigmaAll, title);
  const tm = new Tm(sigmaAll);
  const start = tm.st();
  // import the palindrome machine under fresh names
  const ren = new Map(pal.states.map(s => [s.id, s.accepting ? 'qacc' : 'p' + s.id.slice(1)]));
  const palStart = ren.get(pal.states.find(s => s.initial).id);
  const first = shapePhase(tm, shapeDfa, palStart, null);
  link(tm, start, first);
  for (const s of pal.states) tm.states.push({ id: ren.get(s.id), initial: false, accepting: s.accepting });
  for (const t of pal.transitions) tm.t(ren.get(t.from), t.read, t.write, t.move, ren.get(t.to));
  return tm.machine(sigmaAll, title);
}

/** { w # w } — compare symbol by symbol across the marker. */
export function copyMarkerTm(sigma, marker, title) {
  const all = [...sigma, marker];
  const tm = new Tm(all);
  const c0 = tm.st();
  const acc = tm.st(true, 'qacc');
  const back = tm.st(), tail = tm.st();
  const DONE_L = '*', DONE_R = '=';
  tm.tape.push(DONE_L, DONE_R);
  for (const a of sigma) {
    const go = tm.st(), find = tm.st();
    tm.t(c0, a, DONE_L, 'R', go);
    for (const c of sigma) tm.t(go, c, c, 'R', go);
    tm.t(go, marker, marker, 'R', find);
    tm.t(find, DONE_R, DONE_R, 'R', find);
    tm.t(find, a, DONE_R, 'L', back);
  }
  tm.t(c0, marker, marker, 'R', tail);
  tm.t(tail, DONE_R, DONE_R, 'R', tail);
  tm.t(tail, 'B', 'B', 'L', acc);
  for (const c of [...sigma, marker, DONE_R]) tm.t(back, c, c, 'L', back);
  tm.t(back, DONE_L, DONE_L, 'R', c0);
  return tm.machine(all, title);
}

/** { ww } — find the middle by marking from both ends, then compare the halves. */
export function copyTm(sigma, title) {
  const tm = new Tm(sigma);
  const L = new Map(), R = new Map();
  const pool = [...'XYWVUKMNPQRSTJHGFE'].filter(c => !sigma.includes(c) && c !== 'B');
  sigma.forEach((a, i) => { L.set(a, pool[2 * i]); R.set(a, pool[2 * i + 1]); });
  tm.tape = [...sigma, ...L.values(), ...R.values(), '*', '='];
  const m0 = tm.st();
  const acc = tm.st(true, 'qacc');
  const m1 = tm.st(), m2 = tm.st(), m3 = tm.st();
  // phase 1: mark leftmost unmarked as L, rightmost unmarked as R, until they meet
  tm.t(m0, 'B', 'B', 'R', acc);                                 // ε
  for (const a of sigma) tm.t(m0, a, L.get(a), 'R', m1);
  for (const a of sigma) tm.t(m1, a, a, 'R', m1);
  for (const r of R.values()) tm.t(m1, r, r, 'L', m2);
  tm.t(m1, 'B', 'B', 'L', m2);
  for (const a of sigma) tm.t(m2, a, R.get(a), 'L', m3);       // (an L mark here = odd length → reject)
  for (const a of sigma) tm.t(m3, a, a, 'L', m3);
  for (const l of L.values()) tm.t(m3, l, l, 'R', m0);
  // middle found when m0 reads an R mark
  const rew = tm.st();
  for (const r of R.values()) tm.t(m0, r, r, 'L', rew);
  for (const c of [...L.values(), ...R.values()]) tm.t(rew, c, c, 'L', rew);
  const c0 = tm.st();
  tm.t(rew, 'B', 'B', 'R', c0);
  // phase 2: compare the first half (L marks) with the second half (R marks)
  const back = tm.st();
  tm.t(c0, '*', '*', 'R', c0);
  tm.t(c0, '=', '=', 'R', acc);
  for (const a of sigma) {
    const find = tm.st();
    tm.t(c0, L.get(a), '*', 'R', find);
    for (const c of [...L.values(), '=']) tm.t(find, c, c, 'R', find);
    tm.t(find, R.get(a), '=', 'L', back);
  }
  for (const c of [...L.values(), '=']) tm.t(back, c, c, 'L', back);
  tm.t(back, '*', '*', 'R', c0);
  return tm.machine(sigma, title);
}

/** { a^(2^n) } — Sipser's machine: halve the a's each sweep. */
export function pow2Tm(sym, title) {
  const tm = new Tm([sym]);
  const x = tm.mark(sym);
  const q1 = tm.st(), acc = tm.st(true, 'qacc');
  const q2 = tm.st(), q3 = tm.st(), q4 = tm.st(), q5 = tm.st();
  tm.t(q1, sym, 'B', 'R', q2);
  tm.t(q2, x, x, 'R', q2);
  tm.t(q2, 'B', 'B', 'R', acc);
  tm.t(q2, sym, x, 'R', q3);
  tm.t(q3, x, x, 'R', q3);
  tm.t(q3, sym, sym, 'R', q4);
  tm.t(q3, 'B', 'B', 'L', q5);
  tm.t(q4, x, x, 'R', q4);
  tm.t(q4, sym, x, 'R', q3);
  tm.t(q5, sym, sym, 'L', q5);
  tm.t(q5, x, x, 'L', q5);
  tm.t(q5, 'B', 'B', 'R', q2);
  return tm.machine([sym], title);
}

// ------------------------------------------------------------------ arithmetic / transducer tasks

export function opTm(spec) {
  const sep = spec.sep || '0';
  const B = 'B';
  const mk = (sigma, build) => { const tm = new Tm(sigma); build(tm); return tm.machine(sigma, spec.label); };
  switch (spec.op) {
    case 'complement': return mk(['0', '1'], tm => {
      const q = tm.st(), acc = tm.st(true, 'qacc');
      tm.t(q, '0', '1', 'R', q); tm.t(q, '1', '0', 'R', q); tm.t(q, B, B, 'L', acc);
    });
    case 'twos': return mk(['0', '1'], tm => {
      const go = tm.st(), acc = tm.st(true, 'qacc'), keep = tm.st(), flip = tm.st();
      tm.t(go, '0', '0', 'R', go); tm.t(go, '1', '1', 'R', go); tm.t(go, B, B, 'L', keep);
      tm.t(keep, '0', '0', 'L', keep); tm.t(keep, '1', '1', 'L', flip); tm.t(keep, B, B, 'R', acc);
      tm.t(flip, '0', '1', 'L', flip); tm.t(flip, '1', '0', 'L', flip); tm.t(flip, B, B, 'R', acc);
    });
    case 'inc':
      if (spec.base === 'unary') return mk(['1'], tm => { const q = tm.st(), acc = tm.st(true, 'qacc'); tm.t(q, '1', '1', 'R', q); tm.t(q, B, '1', 'L', acc); });
      return mk(['0', '1'], tm => {
        const go = tm.st(), acc = tm.st(true, 'qacc'), carry = tm.st();
        tm.t(go, '0', '0', 'R', go); tm.t(go, '1', '1', 'R', go); tm.t(go, B, B, 'L', carry);
        tm.t(carry, '1', '0', 'L', carry); tm.t(carry, '0', '1', 'L', acc); tm.t(carry, B, '1', 'L', acc);
      });
    case 'dec':
      if (spec.base === 'unary') return mk(['1'], tm => { const q = tm.st(), acc = tm.st(true, 'qacc'); tm.t(q, '1', B, 'R', acc); });
      return mk(['0', '1'], tm => {
        const go = tm.st(), acc = tm.st(true, 'qacc'), borrow = tm.st();
        tm.t(go, '0', '0', 'R', go); tm.t(go, '1', '1', 'R', go); tm.t(go, B, B, 'L', borrow);
        tm.t(borrow, '0', '1', 'L', borrow); tm.t(borrow, '1', '0', 'L', acc);   // B: the number was 0 → reject
      });
    case 'add': return mk(['1', sep], tm => {
      const q0 = tm.st(), acc = tm.st(true, 'qacc'), q1 = tm.st(), q2 = tm.st();
      tm.t(q0, '1', '1', 'R', q0); tm.t(q0, sep, '1', 'R', q1);
      tm.t(q1, '1', '1', 'R', q1); tm.t(q1, B, B, 'L', q2);
      tm.t(q2, '1', B, 'L', acc);
    });
    case 'sub': return mk(['1', sep], tm => {
      // erase one 1 from the end of the second number and one from the start of the first
      const chk = tm.st(), acc = tm.st(true, 'qacc');
      const c1 = tm.st(), go = tm.st(), last = tm.st(), left = tm.st(), first = tm.st(), clr = tm.st();
      tm.t(chk, '1', '1', 'R', chk); tm.t(chk, sep, sep, 'R', c1);
      tm.t(c1, '1', '1', 'R', c1); tm.t(c1, B, B, 'L', last);            // shape 1*sep1* checked
      tm.t(go, '1', '1', 'R', go); tm.t(go, sep, sep, 'R', go); tm.t(go, B, B, 'L', last);
      tm.t(last, '1', B, 'L', left); tm.t(last, sep, B, 'L', acc);       // second number used up
      tm.t(left, '1', '1', 'L', left); tm.t(left, sep, sep, 'L', left); tm.t(left, B, B, 'R', first);
      tm.t(first, '1', B, 'R', go);
      tm.t(first, sep, B, 'R', clr);                                     // first number used up: result 0
      tm.t(clr, '1', B, 'R', clr); tm.t(clr, B, B, 'L', acc);
    });
    case 'double':
      if (spec.base === 'binary') return mk(['0', '1'], tm => { const q = tm.st(), acc = tm.st(true, 'qacc'); tm.t(q, '0', '0', 'R', q); tm.t(q, '1', '1', 'R', q); tm.t(q, B, '0', 'L', acc); });
      return mk(['1'], tm => {
        tm.tape.push('X', 'Y');
        const q0 = tm.st(), acc = tm.st(true, 'qacc'), q1 = tm.st(), q2 = tm.st(), rew = tm.st(), conv = tm.st();
        tm.t(q0, '1', 'X', 'R', q1); tm.t(q0, 'Y', 'Y', 'L', rew); tm.t(q0, B, B, 'L', rew);
        tm.t(q1, '1', '1', 'R', q1); tm.t(q1, 'Y', 'Y', 'R', q1); tm.t(q1, B, 'Y', 'L', q2);
        tm.t(q2, '1', '1', 'L', q2); tm.t(q2, 'Y', 'Y', 'L', q2); tm.t(q2, 'X', 'X', 'R', q0);
        tm.t(rew, 'X', 'X', 'L', rew); tm.t(rew, 'Y', 'Y', 'L', rew); tm.t(rew, '1', '1', 'L', rew); tm.t(rew, B, B, 'R', conv);
        tm.t(conv, 'X', '1', 'R', conv); tm.t(conv, 'Y', '1', 'R', conv); tm.t(conv, B, B, 'L', acc);
      });
    default: return null;
  }
}

/** Balanced brackets: mark each closer with the nearest unmarked opener to its left. */
export function balancedTm(pairs, allowOpen, title) {
  const opens = pairs.map(p => p[0]), closes = pairs.map(p => p[1]);
  const sigma = [...opens, ...closes];
  const tm = new Tm(sigma);
  const X = '*';
  tm.tape = [...sigma, X];
  const s0 = tm.st();
  const acc = tm.st(true, 'qacc');
  const fin = tm.st();
  for (const o of opens) tm.t(s0, o, o, 'R', s0);
  tm.t(s0, X, X, 'R', s0);
  pairs.forEach(([o, c]) => {
    const seek = tm.st();
    tm.t(s0, c, X, 'L', seek);
    tm.t(seek, X, X, 'L', seek);
    tm.t(seek, o, X, 'R', s0);       // matched: continue to the right
  });
  // end of input: any unmarked opener left?
  if (allowOpen) tm.t(s0, 'B', 'B', 'L', acc);
  else {
    tm.t(s0, 'B', 'B', 'L', fin);
    tm.t(fin, X, X, 'L', fin);
    tm.t(fin, 'B', 'B', 'R', acc);   // reached the left end seeing only marks
  }
  return tm.machine(sigma, title);
}

/** Merge behaviourally identical states (same accepting flag, same rule for every symbol). */
export function minimizeTm(m) {
  const syms = [...new Set([...m.transitions.map(t => t.read), 'B'])];
  const rule = new Map(m.transitions.map(t => [t.from + '\u0000' + t.read, t]));
  // reachable states only
  const start = m.states.find(s => s.initial).id;
  const reach = new Set([start]);
  for (let ch = true; ch;) { ch = false; for (const t of m.transitions) if (reach.has(t.from) && !reach.has(t.to)) { reach.add(t.to); ch = true; } }
  const states = m.states.filter(s => reach.has(s.id));
  let cls = new Map(states.map(s => [s.id, s.accepting ? 'A' : 'N']));
  for (;;) {
    const keys = new Map();
    const next = new Map(states.map(s => {
      const sig = cls.get(s.id) + '|' + syms.map(x => { const t = rule.get(s.id + '\u0000' + x); return t ? `${t.write}${t.move}${cls.get(t.to)}` : '-'; }).join(',');
      if (!keys.has(sig)) keys.set(sig, 'c' + keys.size);
      return [s.id, keys.get(sig)];
    }));
    const stable = new Set(next.values()).size === new Set(cls.values()).size;
    cls = next;
    if (stable) break;
  }
  // BFS order names; the accepting class keeps the name qacc
  const order = [];
  const seen = new Set();
  const q = [start];
  while (q.length) {
    const s = q.shift();
    if (seen.has(cls.get(s))) continue;
    seen.add(cls.get(s));
    order.push(s);
    for (const x of syms) { const t = rule.get(s + '\u0000' + x); if (t && !seen.has(cls.get(t.to))) q.push(t.to); }
  }
  let k = 0;
  const name = new Map(order.map(s => [cls.get(s), m.states.find(x => x.id === s).accepting ? 'qacc' : 'q' + k++]));
  const transitions = [];
  const done = new Set();
  for (const s of order) for (const x of syms) {
    const t = rule.get(s + '\u0000' + x);
    if (!t) continue;
    const key = name.get(cls.get(s)) + '\u0000' + x;
    if (done.has(key)) continue;
    done.add(key);
    transitions.push({ from: name.get(cls.get(s)), to: name.get(cls.get(t.to)), read: x, write: t.write, move: t.move });
  }
  return {
    ...m,
    states: order.map(s => ({ id: name.get(cls.get(s)), initial: s === start, accepting: !!m.states.find(x => x.id === s).accepting })),
    transitions,
  };
}

/**
 * { s1^(p1·n) s2^(p2·n) … sk^(pk·n) | n ≥ min } — the classic sweep: each round marks p1 symbols
 * of the first block, then p2 of the second, …, returns to the last mark of block 1 and repeats;
 * when block 1 is used up, everything else must be marked.
 */
export function equalBlocksTm(syms, coefs, min, title) {
  const tm = new Tm(syms);
  const M = syms.map(s => tm.mark(s));
  const k = syms.length;
  const q0 = tm.st();
  const acc = tm.st(true, 'qacc');
  const loop = min >= 1 ? tm.st() : q0;          // with n ≥ 1 the first round is compulsory
  const back = tm.st();
  const check = tm.st();
  // marking chains: block i needs coefs[i] consecutive marks
  const find = syms.map(() => tm.st());           // find[i]: looking for the next unmarked s_i (i ≥ 1)
  const roundEntry = (st, i) => {
    // mark coefs[i] consecutive s_i starting in state st
    let cur = st;
    for (let c = 0; c < coefs[i]; c++) {
      const nxt = c === coefs[i] - 1 ? (i + 1 < k ? find[i + 1] : back) : tm.st();
      tm.t(cur, syms[i], M[i], c === coefs[i] - 1 && i + 1 === k ? 'L' : 'R', nxt);
      cur = nxt;
    }
  };
  for (const st of new Set([q0, loop])) roundEntry(st, 0);
  for (let i = 1; i < k; i++) {
    tm.t(find[i], syms[i - 1], syms[i - 1], 'R', find[i]);
    tm.t(find[i], M[i], M[i], 'R', find[i]);
    roundEntry(find[i], i);
  }
  for (const c of [...syms, ...M.slice(1)]) tm.t(back, c, c, 'L', back);
  tm.t(back, M[0], M[0], 'R', loop);
  // block 1 used up: the rest must be marked
  if (k > 1) tm.t(loop, M[1], M[1], 'R', check);
  tm.t(loop, 'B', 'B', 'L', acc);
  for (const c of M.slice(1)) tm.t(check, c, c, 'R', check);
  tm.t(check, 'B', 'B', 'L', acc);
  return tm.machine(syms, title);
}

/** #s1 = #s2 = … = #sk in any order: each round crosses off one of every symbol. */
export function equalCountsTm(syms, alphabet, title) {
  const tm = new Tm(alphabet);
  const start = tm.st();
  const acc = tm.st(true, 'qacc');
  const find = syms.map((_, i) => (i === 0 ? start : tm.st()));
  syms.forEach((s, i) => {
    const after = i + 1 < syms.length ? tm.rewind(find[i + 1]) : tm.rewind(start);
    for (const c of tm.tape) if (c !== s) tm.t(find[i], c, c, 'R', find[i]);
    tm.t(find[i], s, tm.mark(s), 'L', after);
  });
  // no unmarked s1 left: no other counted symbol may be left either
  const check = tm.st();
  tm.t(start, 'B', 'B', 'L', tm.rewind(check));
  for (const c of tm.tape) if (!syms.slice(1).includes(c)) tm.t(check, c, c, 'R', check);
  tm.t(check, 'B', 'B', 'L', acc);
  return tm.machine(alphabet, title);
}
