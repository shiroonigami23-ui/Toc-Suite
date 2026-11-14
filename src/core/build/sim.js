// core/build/sim.js — small, DOM-free simulators with the same semantics as the studios'
// engines (PDA: non-deterministic BFS with ε-moves; TM: deterministic single tape, accepting
// state halts; Moore/Mealy: Moore output includes λ(q0)). Used to verify every built machine.

const eps = (v) => { const s = String(v ?? '').trim().toLowerCase(); return s === '' || s === 'ε' || s === 'eps' || s === 'epsilon' || s === 'λ' || s === 'ϵ'; };

export function pdaAccepts(m, w, maxConfigs = 200000) {
  const start = m.states.find(s => s.initial);
  if (!start) return false;
  const acc = new Set(m.states.filter(s => s.accepting).map(s => s.id));
  const mode = String(m.acceptanceMode || 'FINAL_STATE').toUpperCase();
  const by = new Map();
  for (const t of m.transitions) { if (!by.has(t.from)) by.set(t.from, []); by.get(t.from).push(t); }
  const maxPush = Math.max(1, ...m.transitions.map(t => (eps(t.push) ? 0 : String(t.push).length)));
  // final-state runs may end with a tall stack, so the bound uses the whole input
  const cap = () => (w.length + 1) * maxPush * 2 + 2 * m.states.length + 4;
  const q = [[start.id, 0, [m.initialStackSymbol || 'Z']]];
  const seen = new Set();
  for (let h = 0; h < q.length && h < maxConfigs; h++) {
    const [s, p, st] = q[h];
    const key = s + '|' + p + '|' + st.join('\u0001');
    if (seen.has(key)) continue;
    seen.add(key);
    const done = p === w.length;
    if (done && (mode === 'EMPTY_STACK' ? st.length === 0 : mode === 'BOTH' ? st.length === 0 && acc.has(s) : acc.has(s))) return true;
    const top = st[st.length - 1];
    for (const t of by.get(s) || []) {
      const e = eps(t.symbol);
      if (!e && (done || t.symbol !== w[p])) continue;
      const ns = st.slice();
      if (!eps(t.pop)) { if (top !== t.pop) continue; ns.pop(); }
      if (!eps(t.push)) { const sy = String(t.push).split(''); for (let i = sy.length - 1; i >= 0; i--) ns.push(sy[i]); }
      const np = e ? p : p + 1;
      if (ns.length > cap(w.length - np)) continue;
      q.push([t.to, np, ns]);
    }
  }
  return false;
}

/** Returns { accepted, tape (blanks trimmed), steps, timeout }. */
export function tmRun(m, w, maxSteps = 200000) {
  const blank = m.blankSymbol || 'B';
  const tape = w.length ? w.split('') : [blank];
  let head = 0;
  let state = m.states.find(s => s.initial)?.id;
  const acc = new Set(m.states.filter(s => s.accepting).map(s => s.id));
  const by = new Map();
  for (const t of m.transitions) by.set(t.from + '\u0000' + t.read, t);
  for (let steps = 0; steps <= maxSteps; steps++) {
    if (acc.has(state)) return { accepted: true, tape: trim(tape, blank), steps };
    if (head < 0) { tape.unshift(blank); head = 0; } else if (head >= tape.length) tape.push(blank);
    const t = by.get(state + '\u0000' + tape[head]);
    if (!t) return { accepted: false, tape: trim(tape, blank), steps };
    tape[head] = t.write;
    head += t.move === 'R' ? 1 : t.move === 'L' ? -1 : 0;
    state = t.to;
  }
  return { accepted: false, timeout: true, tape: trim(tape, blank), steps: maxSteps };
}
const trim = (tape, blank) => { const b = blank.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return tape.join('').replace(new RegExp(`^(?:${b})+|(?:${b})+$`, 'g'), ''); };

export function transduce(m, input) {
  const syms = (m.alphabet || []).slice().sort((a, b) => b.length - a.length);
  const toks = Array.isArray(input) ? input : syms.every(x => x.length === 1) ? [...input] : (() => { const o = []; for (let i = 0; i < input.length;) { const s = syms.find(x => input.startsWith(x, i)) || input[i]; o.push(s); i += s.length; } return o; })();
  let cur = m.states.find(s => s.initial);
  const moore = m.type === 'MOORE';
  let out = moore ? (cur.output ?? '') : '';
  for (const a of toks) {
    const t = m.transitions.find(x => x.from === cur.id && x.symbol === a);
    if (!t) return null;
    cur = m.states.find(s => s.id === t.to);
    out += moore ? (cur.output ?? '') : (t.output ?? '');
  }
  return out;
}

/** All words over `alphabet` up to length `max` (alphabet symbols may be multi-character). */
export function* allWords(alphabet, max) {
  yield [];
  let layer = [[]];
  for (let n = 1; n <= max; n++) {
    const next = [];
    for (const w of layer) for (const a of alphabet) next.push([...w, a]);
    for (const w of next) yield w;
    layer = next;
  }
}

/** Pick the longest length L ≤ cap with |Σ|^0 + … + |Σ|^L ≤ budget. */
export function lengthFor(k, budget = 3000, cap = 12) {
  let total = 0, L = 0;
  for (let n = 0; n <= cap; n++) { total += k ** n; if (total > budget) break; L = n; }
  return L;
}
