// core/build/index.js — "describe it, get a correct machine" for every studio.
//
// 1. Which machine?  An explicit request ("PDA", "Mealy machine", "ε-NFA", "Turing machine")
//    wins; otherwise the current studio and mode decide. If the language cannot be handled by
//    the requested model (aⁿbⁿ as a DFA, aⁿbⁿcⁿ as a PDA) the next model up is built instead and
//    the reason is given; the caller switches studio.
// 2. What language / task?  Non-regular families and tasks come from lang.js, everything else
//    from the English reader (nl.js).
// 3. Build, then verify: finite automata by exact equivalence, PDAs / TMs / transducers on every
//    input up to a length chosen from the alphabet size. Nothing unverified is ever returned.

import * as FA from '../fa.js';
import { parseDescription } from '../nl.js';
import { regexToDfa } from '../regex.js';
import { autoLayout } from '../layout.js';
import { readSpec, oracleFor, opFunction, normalize, alphabetIn, readOp } from './lang.js';
import { blockProgram, countProgram, compileCounterPda, palindromePda, balancedPda, dfaToPda, toEmptyStack, describeProgram } from './pda.js';
import * as TMB from './tm.js';
import * as MMB from './mm.js';
import { buildFinite, verifyFinite } from './finite.js';
import { pdaAccepts, tmRun, transduce, allWords, lengthFor } from './sim.js';

export const ROUTE = { DFA: 'fa', NFA: 'fa', ENFA: 'fa', MOORE: 'mm', MEALY: 'mm', PDA: 'pda', TM: 'tm' };
export const KIND_NAME = { DFA: 'DFA', NFA: 'NFA', ENFA: 'ε-NFA', MOORE: 'Moore machine', MEALY: 'Mealy machine', PDA: 'PDA', TM: 'Turing machine' };

// ------------------------------------------------------------------ which machine

export function detectKind(text) {
  const t = String(text).toLowerCase();
  const has = (re) => re.test(t);
  let kind = null;
  if (has(/\bturing\b|\btm\b|\bntm\b|\blba\b|\btape\b|\bdecider\b|\bhalts?\b/)) kind = 'TM';
  else if (has(/\bpda\b|\bnpda\b|\bdpda\b|push[- ]?down|\bstack\b/)) kind = 'PDA';
  else if (has(/\bmealy\b/)) kind = 'MEALY';
  else if (has(/\bmoore\b/)) kind = 'MOORE';
  else if (has(/(?:ε|epsilon|e|λ|lambda|null)[- ]?(?:nfa|moves?\b)|\benfa\b|nfa with (?:ε|epsilon|e|λ|null)/)) kind = 'ENFA';
  else if (has(/\bnfa\b|non[- ]?deterministic finite|nondeterministic finite/)) kind = 'NFA';
  else if (has(/\bdfa\b|\bdeterministic finite\b|\bfsm\b|\bfinite (?:state )?(?:automaton|machine|acceptor)\b/)) kind = 'DFA';
  else if (has(/\btransducer\b|\bsequence detector\b/)) kind = 'MM';
  return { kind, emptyStack: has(/\bempty[- ]stack\b|\bby empty\b|\bnull stack\b/) };
}

export function defaultKind(studio, mode) {
  const s = String(studio || '').toUpperCase();
  const m = String(mode || '').toUpperCase();
  if (s === 'PDA') return 'PDA';
  if (s === 'TM' || s === 'TURING') return 'TM';
  if (s === 'MM') return m.startsWith('MEALY') ? 'MEALY' : 'MOORE';
  if (m.startsWith('ENFA')) return 'ENFA';
  if (m.startsWith('NFA')) return 'NFA';
  return 'DFA';
}

/** Remove "construct a minimal DFA that accepts" and similar wrapping. */
export function stripKindWords(text) {
  return String(text)
    .replace(/^\s*(?:please\s+)?(?:can you\s+|could you\s+)?(?:construct|design|build|draw|create|make|give(?: me)?|generate|find|write|show(?: me)?|i (?:want|need))\s+/i, '')
    .replace(/\b(?:an?|the)\s+(?:minimal\s+|minimum\s+|deterministic\s+|non-?deterministic\s+|complete\s+)*(?:dfa|nfa|ε-?nfa|epsilon[- ]nfa|e-?nfa|λ-?nfa|pda|npda|dpda|tm|turing machine|moore machine|mealy machine|finite (?:state )?(?:automaton|automata|machine)|pushdown automaton|automaton|machine|transducer)\b/gi, ' ')
    .replace(/\b(?:dfa|nfa|ε-?nfa|enfa|pda|npda|dpda|turing machine|moore machine|mealy machine|pushdown automaton|finite automaton)\b/gi, ' ')
    .replace(/\b(?:by|with|using) (?:empty|null) stack\b|\b(?:accept(?:ing|ance)?|acceptance) by (?:final state|empty stack)\b/gi, ' ')
    .replace(/^\s*(?:that|which|to|for|accepting|recogni[sz]ing|recogni[sz]es|accepts|recogni[sz]e|accept|deciding|decides|decide)\b\s*/i, '')
    .replace(/^\s*(?:that|which)\s+(?:accepts|recogni[sz]es|decides)\s+/i, '')
    .replace(/\bthe language (?:of|L\s*=)?\s*/i, '')
    .replace(/\s+/g, ' ').trim();
}

// ------------------------------------------------------------------ helpers

const regexOfProgram = (prog) => prog.blocks.map(b => {
  if (b.exact !== undefined) return b.sym.repeat(b.exact);
  const base = b.sym.repeat(b.lo);
  return base + (b.m === 1 ? `${b.sym}*` : `(${b.sym.repeat(b.m)})*`);
}).join('') || 'ε';

function layout(machine) {
  const pos = autoLayout(machine);
  return { ...machine, states: machine.states.map(s => ({ ...s, ...(pos[s.id] || {}) })) };
}

function samplesFromOracle(alphabet, oracle, L) {
  const acc = [], rej = [];
  for (const w of allWords(alphabet, Math.min(L, 8))) {
    const s = w.join('');
    (oracle(s) ? acc : rej).push(s || 'ε');
    if (acc.length >= 6 && rej.length >= 6) break;
  }
  return { accepted: acc.slice(0, 6), rejected: rej.slice(0, 6) };
}

function verifyAcceptor(alphabet, accepts, oracle, budget = 2500) {
  const L = lengthFor(alphabet.length, budget, alphabet.length === 1 ? 24 : 10);
  let n = 0;
  for (const w of allWords(alphabet, L)) {
    const s = w.join('');
    n++;
    const got = accepts(s);
    if (got !== oracle(s)) return { ok: false, counterexample: s || 'ε', expected: oracle(s), maxLen: L, checked: n };
  }
  return { ok: true, maxLen: L, checked: n };
}

function verifyTransducer(alphabet, run, f, budget = 2500) {
  const L = lengthFor(alphabet.length, budget, 10);
  let n = 0;
  for (const w of allWords(alphabet, L)) {
    const s = w.join('');
    n++;
    const want = f(s), got = run(s);
    if (want !== got) return { ok: false, counterexample: s || 'ε', expected: want, got, maxLen: L, checked: n };
  }
  return { ok: true, maxLen: L, checked: n };
}

const fail = (kind, message, extra = {}) => ({ ok: false, kind, route: ROUTE[kind], problems: [message], ...extra });

// ------------------------------------------------------------------ main entry

/**
 * @param {string} text
 * @param {{ model: object, studio?: string, mode?: string, keepDead?: boolean }} ctx
 */
export function buildFromText(text, ctx = {}) {
  const raw = String(text || '').trim();
  if (!raw) return { ok: false, problems: ['Describe a language or a task first.'] };
  const det = detectKind(raw);
  const fallback = defaultKind(ctx.studio, ctx.mode);
  let wanted = det.kind === 'MM' ? (fallback === 'MEALY' ? 'MEALY' : 'MOORE') : det.kind;
  const explicit = !!wanted;
  wanted = wanted || fallback;
  const notes = [];
  const body = stripKindWords(raw);
  const norm = normalize(body);

  // ---- transducer tasks (increment, complement, delay, …) ----
  const op = readOp(norm);
  if (op && !/\b(?:accept|recogni[sz]|language|strings?)\b/.test(norm.replace(/\bbinary strings?\b/, ''))) {
    return buildOp(op, wanted, explicit, notes, raw);
  }

  // ---- Moore / Mealy descriptions ----
  if (wanted === 'MOORE' || wanted === 'MEALY') {
    const r = buildTransducer(body, wanted, ctx, notes, raw);
    if (r) return r;
  }

  // ---- non-regular families ----
  const spec = readSpec(body);
  if (spec && spec.type === 'unsupported') return fail(wanted, `Not supported yet: ${spec.reason} is not context-free, and a Turing machine for it is not available.`);
  if (spec && spec.type !== 'op') {
    const regular = regularFromSpec(spec);
    if (regular) return buildRegular(regular, wanted, explicit, notes, ctx, raw);
    return buildNonRegular(spec, wanted, explicit, det, notes, raw);
  }

  // ---- regular languages through the English reader ----
  if (!ctx.model) return { ok: false, kind: wanted, problems: ['The language model is still loading; try again in a moment.'] };
  const r = parseDescription(body, ctx.model);
  if (!r.ok) return { ok: false, kind: wanted, route: ROUTE[wanted], problems: r.problems, reading: r };
  return buildRegular({ dfa: r.dfa, alphabet: r.alphabet, reading: r, label: r.explanation }, wanted, explicit, notes, ctx, raw);
}

/** A block/count spec that needs no counting is regular: give its DFA. */
function regularFromSpec(spec) {
  if (spec.type !== 'blocks') return null;
  const progs = spec.dnf.map(conj => blockProgram(spec, conj));
  if (progs.some(p => p.error || p.eqs.length)) return null;
  const src = progs.map(p => `(${regexOfProgram(p)})`).join('|');
  try {
    const dfa = regexToDfa(src, spec.alphabet);
    const label = spec.label;
    return { dfa, alphabet: spec.alphabet, label: `${label} is regular: ${progs.map(regexOfProgram).join(' | ')}`, regex: src };
  } catch { return null; }
}

// ------------------------------------------------------------------ regular languages

function buildRegular(reg, wanted, explicit, notes, ctx, raw) {
  const { dfa, alphabet } = reg;
  const title = raw.length > 80 ? raw.slice(0, 77) + '…' : raw;
  const label = reg.label;
  const oracle = (w) => FA.accepts(dfa, w);
  const samples = { accepted: FA.sampleWords(dfa, { limit: 6, maxLen: 7 }).map(w => w || 'ε'), rejected: FA.sampleWords(dfa, { limit: 6, maxLen: 7, accepted: false }).map(w => w || 'ε') };
  if (['DFA', 'NFA', 'ENFA'].includes(wanted)) {
    const reading = reg.reading || { dfa, alphabet, clauses: [], regex: reg.regex?.replace(/[()]/g, (c) => c), alternatives: [] };
    const { machine, how } = buildFinite(reading, wanted, { keepDead: ctx.keepDead ?? true, title });
    const v = verifyFinite(machine, dfa);
    if (!v.equivalent) return fail(wanted, `The machine failed its check on “${v.counterexample || 'ε'}”, so nothing was drawn. Try rephrasing.`);
    return done(wanted, machine, { title, language: label, how, notes, samples, verified: { exact: true }, reading: reg.reading });
  }
  if (wanted === 'MOORE' || wanted === 'MEALY') {
    const m = MMB.fromDfa(dfa, wanted);
    const f = MMB.prefixOracle(dfa, wanted, '1', '0');
    const v = verifyTransducer(alphabet, (w) => MMBrun(m, w), f);
    if (!v.ok) return fail(wanted, `The machine failed its check on “${v.counterexample}”, so nothing was drawn.`);
    notes.push(`No output rule was given, so the ${KIND_NAME[wanted]} outputs 1 when the input read so far is in the language and 0 otherwise.`);
    return done(wanted, m, { title, language: label, how: 'one state per state of the minimal DFA, then minimised as a transducer', notes, io: ioSamples(alphabet, f), verified: v });
  }
  if (wanted === 'PDA') {
    const app = FA.toAppMachine(dfa, { keepDead: false });
    let m = dfaToPda(app);
    if (/\bempty[- ]stack\b/i.test(raw)) m = toEmptyStack(m);
    const v = verifyAcceptor(alphabet, (w) => pdaAccepts(m, w), oracle);
    if (!v.ok) return fail(wanted, `The machine failed its check on “${v.counterexample}”, so nothing was drawn.`);
    notes.push('This language is regular, so the PDA is its minimal DFA and never needs the stack.');
    return done(wanted, m, { title, language: label, how: 'minimal DFA, every move leaves the stack unchanged (Z/Z)', notes, samples, verified: v });
  }
  // TM
  const m = TMB.dfaToTm(dfa, title);
  const v = verifyAcceptor(alphabet, (w) => { const r = tmRun(m, w); return r.accepted; }, oracle);
  if (!v.ok) return fail(wanted, `The machine failed its check on “${v.counterexample}”, so nothing was drawn.`);
  notes.push('This language is regular: the Turing machine only scans right, like a DFA, and accepts at the blank.');
  return done(wanted, m, { title, language: label, how: 'one TM state per DFA state, moving right; accept on the blank in an accepting state', notes, samples, verified: v });
}

function MMBrun(m, w) { return transduce(m, w); }

function ioSamples(alphabet, f, n = 6) {
  const out = [];
  for (const w of allWords(alphabet, 6)) {
    if (!w.length) continue;
    if (out.length >= n) break;
    if (w.length < 3 && out.length > 1) continue;
    const s = w.join(alphabet.some(a => a.length > 1) ? ' ' : '');
    out.push([s, f(w.join(''))]);
  }
  return out;
}

// ------------------------------------------------------------------ non-regular languages

function buildNonRegular(spec, wanted, explicit, det, notes, raw) {
  const title = spec.label;
  const oracle = oracleFor(spec);
  const finiteWanted = ['DFA', 'NFA', 'ENFA', 'MOORE', 'MEALY'].includes(wanted);
  // Try a PDA unless a TM was asked for.
  let pda = null, pdaWhy = null, how = '', nonCF = false;
  if (wanted !== 'TM') {
    const r = pdaFor(spec);
    if (r.machine) { pda = r.machine; how = r.how; }
    else { pdaWhy = r.error; nonCF = !!r.nonCF; }
  }
  if (pda) {
    if (finiteWanted && explicit) notes.push(`${spec.label} is not regular — a finite automaton would need unboundedly many states to count — so this is a pushdown automaton (PDA studio).`);
    else if (finiteWanted) notes.push(`${spec.label} is not regular, so this is a pushdown automaton (PDA studio).`);
    if (det.emptyStack) { pda = toEmptyStack(pda); how += '; converted to acceptance by empty stack'; }
    const v = verifyAcceptor(spec.alphabet, (w) => pdaAccepts(pda, w), oracle);
    if (!v.ok) return fail('PDA', `The PDA failed its check on “${v.counterexample}”, so nothing was drawn. Try rephrasing or simplifying.`);
    return done('PDA', pda, { title, language: spec.label, how, notes, samples: samplesFromOracle(spec.alphabet, oracle, v.maxLen), verified: v });
  }
  // Turing machine
  const r = tmFor(spec);
  if (!r.machine) {
    return fail(wanted === 'TM' ? 'TM' : 'PDA', [pdaWhy, r.error].filter(Boolean).join(' '));
  }
  if (wanted !== 'TM') {
    if (nonCF) notes.push(`${spec.label} is not context-free: ${pdaWhy}. No PDA can accept it, so this is a Turing machine${wanted === 'PDA' ? '' : ` instead of a ${KIND_NAME[wanted]}`}.`);
    else if (pdaWhy) notes.push(`${pdaWhy} A Turing machine is used instead.`);
  }
  const tm = r.machine;
  const v = verifyAcceptor(spec.alphabet, (w) => { const x = tmRun(tm, w); return x.accepted; }, oracle, 1500);
  if (!v.ok) return fail('TM', `The Turing machine failed its check on “${v.counterexample}”, so nothing was drawn.`);
  return done('TM', tm, { title, language: spec.label, how: r.how, notes, samples: samplesFromOracle(spec.alphabet, oracle, v.maxLen), verified: v });
}

export function pdaFor(spec) {
  switch (spec.type) {
    case 'blocks': {
      const progs = spec.dnf.map(conj => blockProgram(spec, conj));
      const bad = progs.find(p => p.error);
      if (bad) return { error: bad.error, nonCF: bad.nonCF };
      simplifyPrograms(progs, spec);
      const machine = compileCounterPda(progs, spec.alphabet);
      const how = progs.length > 1
        ? `ε-branch into one counter machine per alternative: ${progs.map(p => describeProgram(p, spec).join('; ')).join(' | ')}`
        : describeProgram(progs[0], spec).join('; ') || 'finite control only';
      return { machine, how };
    }
    case 'count': {
      const p = countProgram(spec);
      if (p.error) return { error: p.error, nonCF: p.nonCF };
      return { machine: compileCounterPda([p], spec.alphabet), how: describeProgram(p, spec).join('; ').replace(/#undefined/g, 'symbol') || 'one signed counter' };
    }
    case 'pal': return { machine: palindromePda(spec), how: spec.parity === 'marker' ? `push every symbol until the marker ${spec.marker}, then pop and match` : `push the first half, guess the middle${spec.parity === 'even' ? '' : spec.parity === 'odd' ? ' (skipping one centre symbol)' : ' (with or without a centre symbol)'}, then pop and match the second half` };
    case 'balanced': return { machine: balancedPda(spec), how: spec.allowOpen ? `push on ${spec.pairs.map(p => p[0]).join(' ')}, pop on the matching closer; any stack left at the end is fine` : `push each opener, pop it on the matching closer; accept when only Z is left` };
    case 'copy': return { nonCF: true, error: 'checking it needs the first half back in its original order, but a stack returns it reversed' };
    case 'pow2': return { nonCF: true, error: 'its lengths grow exponentially, which no stack-based counting can follow' };
    default: return { error: 'no PDA construction for this' };
  }
}

/**
 * Drop block conditions the equations already imply (e.g. "b-length even" in aⁿb²ⁿ), keeping a
 * change only when the smaller PDA still agrees with the language on every short input.
 */
function simplifyPrograms(progs, spec) {
  const oracle = oracleFor(spec);
  const ok = () => {
    const m = compileCounterPda(progs, spec.alphabet);
    return verifyAcceptor(spec.alphabet, (w) => pdaAccepts(m, w), oracle, 700).ok;
  };
  for (const p of progs) for (const b of p.blocks) {
    if (b.exact !== undefined) continue;
    if (b.m > 1) { const old = b.m; b.m = 1; if (!ok()) b.m = old; }
    if (b.lo > 0) { const old = b.lo; b.lo = 0; if (!ok()) b.lo = old; }
  }
}

export function tmFor(spec) {
  const title = spec.label;
  switch (spec.type) {
    case 'blocks': {
      // the classic sweep for s1^(p1 n) s2^(p2 n) … (one variable, no offsets, distinct symbols)
      const vars = [...new Set(spec.blocks.flatMap(b => Object.keys(b.exp.k).filter(v => b.exp.k[v])))];
      const plain = vars.length === 1 && spec.dnf.length === 1 && !spec.dnf[0].length && spec.blocks.every(b => !b.exp.c && b.exp.k[vars[0]] > 0)
        && new Set(spec.blocks.map(b => b.sym)).size === spec.blocks.length && (spec.mins[vars[0]] ?? 0) <= 1 && spec.blocks.length >= 2;
      if (plain) {
        const coefs = spec.blocks.map(b => b.exp.k[vars[0]]);
        const g = coefs.reduce((x, y) => { while (y) [x, y] = [y, x % y]; return x; });
        if (g === 1) {
          return { machine: TMB.equalBlocksTm(spec.blocks.map(b => b.sym), coefs, spec.mins[vars[0]] ?? 0, title),
            how: `each round marks ${spec.blocks.map((b, i) => `${coefs[i] === 1 ? 'one' : coefs[i]} ${b.sym}`).join(', then ')}, and returns left; when the ${spec.blocks[0].sym}'s run out, everything else must already be marked` };
        }
      }
      const alts = [];
      for (const conj of spec.dnf) {
        const p = blockProgram(spec, conj, { tm: true });
        if (p.error) return { error: p.error };
        if (new Set(p.blocks.map(b => b.sym)).size !== p.blocks.length) return { error: 'The Turing-machine builder needs a different symbol in each block.' };
        const eqs = [];
        for (const e of p.eqs) {
          if (e.init) return { error: 'The Turing-machine builder cannot handle constant offsets such as b^(n+1) yet; the PDA studio can.' };
          const weights = {};
          e.w.forEach((x, i) => { if (x) weights[p.blocks[i].sym] = x; });
          const pos = Object.values(weights).filter(x => x > 0), neg = Object.values(weights).filter(x => x < 0);
          if (new Set(pos).size > 1 || new Set(neg).size > 1) return { error: 'Mixed weights on one side of an equation are not supported by the Turing-machine builder.' };
          if (e.cond !== '=' && (pos[0] !== 1 || neg[0] !== -1)) return { error: 'Inequalities with coefficients are not supported by the Turing-machine builder.' };
          eqs.push({ weights, cond: e.cond });
        }
        const shape = regexToDfa(regexOfProgram(p), spec.alphabet);
        alts.push({ shape, eqs });
      }
      const m = TMB.compileDecider(spec.alphabet, alts, title);
      const eqText = alts[0].eqs.map(e => Object.entries(e.weights).map(([s, w]) => `${w > 0 ? '+' : '−'}${Math.abs(w) === 1 ? '' : Math.abs(w)}#${s}`).join(' ') + ` ${e.cond} 0`).join(', ');
      return { machine: m, how: `check the shape ${alts.map(a => '').length > 1 ? 'of each alternative ' : ''}left to right, then cross off symbols in matching proportions (${eqText}), restoring marks between equations${alts.length > 1 ? '; if one alternative fails, restore the tape and try the next' : ''}` };
    }
    case 'count': {
      // all counts equal (#a = #b, #a = #b = #c): one crossing round takes one of each
      const chain = spec.atoms.every(a => a.op === '=' && !a.l.c && !a.r.c && Object.values(a.l.k).every(v => v === 1) && Object.values(a.r.k).every(v => v === 1) && Object.keys(a.l.k).length === 1 && Object.keys(a.r.k).length === 1);
      if (chain) {
        const syms = [...new Set(spec.atoms.flatMap(a => [...Object.keys(a.l.k), ...Object.keys(a.r.k)]))];
        if (syms.length === spec.atoms.length + 1) return { machine: TMB.equalCountsTm(syms, spec.alphabet, title), how: `each round crosses off one ${syms.join(', one ')}; when no ${syms[0]} is left, no other ${syms.slice(1).join('/')} may be left either` };
      }
      const eqs = [];
      for (const a of spec.atoms) {
        if (a.l.c - a.r.c) return { error: 'Constant offsets are not supported by the Turing-machine builder.' };
        const weights = {};
        for (const x of spec.alphabet) { const w = (a.l.k[x] || 0) - (a.r.k[x] || 0); if (w) weights[x] = w; }
        eqs.push({ weights, cond: a.op });
      }
      return { machine: TMB.compileDecider(spec.alphabet, [{ shape: null, eqs }], title), how: 'repeatedly cross off one symbol from each side of the comparison; decide when one side runs out' };
    }
    case 'pal': {
      if (spec.parity === 'any') return { machine: TMB.palindromeTm(spec.alphabet, title), how: 'erase the first symbol, remember it in the state, check and erase the last symbol, repeat' };
      const re = spec.parity === 'marker' ? `(${spec.sigma.join('|')})*${spec.marker}(${spec.sigma.join('|')})*` : spec.parity === 'even' ? `((${spec.sigma.join('|')})(${spec.sigma.join('|')}))*` : `(${spec.sigma.join('|')})((${spec.sigma.join('|')})(${spec.sigma.join('|')}))*`;
      return { machine: TMB.palindromeWithShape(spec.alphabet, regexToDfa(re, spec.alphabet), title), how: `check ${spec.parity === 'marker' ? 'that there is exactly one marker' : `the length is ${spec.parity}`}, then match first and last symbols inward` };
    }
    case 'copy':
      if (spec.marker) return { machine: TMB.copyMarkerTm(spec.sigma, spec.marker, title), how: `match the i-th symbol before ${spec.marker} with the i-th symbol after it, marking both` };
      return { machine: TMB.copyTm(spec.sigma, title), how: 'mark symbols alternately from both ends to find the middle, then compare the two halves symbol by symbol' };
    case 'pow2': return { machine: TMB.pow2Tm(spec.sym, title), how: 'cross off every other symbol on each sweep; accept when exactly one is left (Sipser’s machine)' };
    case 'balanced': return { machine: TMB.balancedTm(spec.pairs, spec.allowOpen, title), how: 'for every closer, mark it and the nearest unmarked opener to its left' };
    default: return { error: 'no Turing machine construction for this' };
  }
}

// ------------------------------------------------------------------ transducers

const MM_OPS = new Set(['complement', 'twos', 'inc', 'delay', 'change', 'same', 'serialadd']);
const TM_OPS = new Set(['complement', 'twos', 'inc', 'dec', 'add', 'sub', 'double']);

function buildOp(op, wanted, explicit, notes, raw) {
  const wantMM = wanted === 'MOORE' || wanted === 'MEALY';
  let kind;
  if (wantMM) {
    kind = MM_OPS.has(op.op) ? wanted : 'TM';
    if (kind === 'TM') notes.push(`A ${KIND_NAME[wanted]} reads each symbol once and writes one output per step, so it cannot do a ${op.label}; a Turing machine is used instead.`);
  } else if (wanted === 'TM') {
    kind = TM_OPS.has(op.op) ? 'TM' : 'MEALY';
    if (kind === 'MEALY') notes.push(`This task is a one-pass transducer, so it is built as a Mealy machine.`);
  } else {
    kind = TM_OPS.has(op.op) ? 'TM' : 'MEALY';
    if (explicit) notes.push(`${KIND_NAME[wanted]}s only accept or reject strings; a ${op.label} produces output, so this is a ${KIND_NAME[kind]}.`);
  }
  if (kind === 'TM') {
    const m = TMB.opTm(op);
    const f = opFunction(op);
    const sigma = m.inputAlphabet;
    const v = verifyTransducer(sigma, (w) => { const r = tmRun(m, w); return r.accepted ? r.tape : null; }, (w) => { const x = f(w); return x === null ? null : x; });
    if (!v.ok) return fail('TM', `The machine failed its check on “${v.counterexample}”, so nothing was drawn.`);
    const io = [];
    for (const w of allWords(sigma, 5)) { const s = w.join(''); const x = f(s); if (x !== null && s) io.push([s, x]); if (io.length >= 6) break; }
    return done('TM', m, { title: op.label, language: op.label, how: tmHow(op), notes, io, verified: v, ioKind: 'tape' });
  }
  const { machine, oracle } = MMB.opMachine(op.op, kind);
  const v = verifyTransducer(machine.alphabet, (w) => transduce(machine, w), oracle);
  if (!v.ok) return fail(kind, `The machine failed its check on “${v.counterexample}”, so nothing was drawn.`);
  if (['twos', 'inc'].includes(op.op)) notes.push('Bits are read least significant first (right to left of the written number), as a one-pass transducer must.');
  if (op.op === 'serialadd') notes.push('Each input symbol is a pair of bits (xᵢyᵢ), least significant pair first; the output is the sum bit.');
  return done(kind, machine, { title: op.label, language: op.label, how: mmHow(op.op), notes, io: ioSamples(machine.alphabet, (w) => oracle(w)), verified: v });
}

function tmHow(op) {
  return {
    complement: 'sweep right flipping each bit',
    twos: 'go to the right end; keep bits up to and including the first 1, then flip the rest',
    inc: op.base === 'unary' ? 'append one 1' : 'go to the right end and add 1 with carry, moving left',
    dec: op.base === 'unary' ? 'erase one 1' : 'go to the right end and subtract 1 with borrow, moving left; a value of 0 is rejected',
    add: `replace the separator ${op.sep} with 1, then erase the last 1`,
    sub: 'repeatedly erase one 1 from the end of the second number and one from the start of the first',
    double: op.base === 'unary' ? 'for each 1, mark it and append a Y; finally turn X and Y back into 1' : 'append a 0 (shift left)',
  }[op.op];
}
function mmHow(op) {
  return {
    complement: 'one state; every bit is output flipped',
    twos: 'copy bits until the first 1 (inclusive), then flip every later bit',
    inc: 'carry state: 1+carry outputs 0 and keeps the carry, the first 0 outputs 1 and drops it',
    delay: 'the state remembers the previous input and outputs it',
    change: 'the state remembers the previous input; output 1 when the new one differs',
    same: 'the state remembers the previous input; output 1 when the new one is the same',
    serialadd: 'carry / no-carry states; output is (x + y + carry) mod 2',
  }[op];
}

function buildTransducer(body, kind, ctx, notes, raw) {
  const t = normalize(body);
  const title = raw.length > 80 ? raw.slice(0, 77) + '…' : raw;
  const alpha = alphabetIn(t);
  // remainder machines
  const rem = MMB.readRemainder(t);
  if (rem) {
    const alphabet = alpha || (rem.kind === 'value' ? (rem.base === 10 ? '0123456789'.split('') : rem.base === 3 ? ['0', '1', '2'] : ['0', '1']) : [...new Set(['a', 'b', rem.sym])].sort());
    const m = MMB.minimizeTransducer(MMB.remainderMachine(rem, kind, alphabet));
    const f = MMB.remainderOracle(rem, kind, alphabet);
    const v = verifyTransducer(alphabet, (w) => transduce(m, w), f);
    if (!v.ok) return fail(kind, `The machine failed its check on “${v.counterexample}”, so nothing was drawn.`);
    return done(kind, m, { title, language: rem.kind === 'value' ? `remainder of the base-${rem.base} number read so far, mod ${rem.k}` : `number of ${rem.sym}'s read so far, mod ${rem.k}`, how: rem.kind === 'value' ? `state = remainder r; reading digit d goes to (${rem.base}r + d) mod ${rem.k}` : `state = count mod ${rem.k}`, notes, io: ioSamples(alphabet, f), verified: v });
  }
  const outs = MMB.readOutputs(t);
  const cond = MMB.conditionText(t);
  if (!cond) return null;
  // non-regular conditions cannot be done by a finite transducer
  const spec = readSpec(cond.cond);
  if (spec && !['op', 'unsupported'].includes(spec.type) && !regularFromSpec(spec)) {
    return fail(kind, `A ${KIND_NAME[kind]} has finitely many states, so it cannot track “${spec.label}” (that needs unbounded counting).`);
  }
  let alphabet = alpha;
  if (!alphabet) {
    const syms = cond.pattern ? [...cond.pattern] : (cond.cond.match(/'([a-z0-9]+)'|\b([01]+)\b|\b([ab]+)\b/g) || []).join('').replace(/[^a-z0-9]/g, '').split('');
    alphabet = syms.some(c => /[a-z]/.test(c)) ? [...new Set(['a', 'b', ...syms.filter(c => /[a-z]/.test(c))])].sort() : ['0', '1'];
  }
  if (cond.pattern && cond.nonOverlap) {
    const dfa = MMB.detectorDfa(cond.pattern, alphabet);
    const m = MMB.fromDfa(dfa, kind, outs.yes, outs.no);
    const f = MMB.nonOverlapOracle(cond.pattern, kind, outs.yes, outs.no);
    const v = verifyTransducer(alphabet, (w) => transduce(m, w), f);
    if (!v.ok) return fail(kind, `The machine failed its check on “${v.counterexample}”, so nothing was drawn.`);
    return done(kind, m, { title, language: `non-overlapping detector for ${cond.pattern}: output ${outs.yes} when it completes, ${outs.no} otherwise`, how: 'pattern automaton (KMP) that restarts after every match', notes, io: ioSamples(alphabet, f), verified: v, outputs: outs });
  }
  if (!ctx.model) return fail(kind, 'The language model is still loading; try again in a moment.');
  const r = parseDescription(`strings over {${alphabet.join(',')}} ${cond.cond}`, ctx.model);
  if (!r.ok) return { ok: false, kind, route: ROUTE[kind], problems: [`Could not read the output condition “${cond.cond}”.`, ...r.problems] };
  const m = MMB.fromDfa(r.dfa, kind, outs.yes, outs.no);
  const f = MMB.prefixOracle(r.dfa, kind, outs.yes, outs.no);
  const v = verifyTransducer(r.alphabet, (w) => transduce(m, w), f);
  if (!v.ok) return fail(kind, `The machine failed its check on “${v.counterexample}”, so nothing was drawn.`);
  if (cond.pattern) notes.push('Overlapping matches count (say “non-overlapping” for the other kind).');
  return done(kind, m, { title, language: `output ${outs.yes} when the input read so far ${r.explanation.replace(/^Σ = \{[^}]*\}; accept a string iff it /, '').replace(/\.$/, '')}, otherwise ${outs.no}`, how: `minimal DFA for the condition, outputs on ${kind === 'MOORE' ? 'states' : 'transitions'}, then minimised as a ${kind === 'MOORE' ? 'Moore' : 'Mealy'} machine`, notes, io: ioSamples(r.alphabet, f), verified: v, reading: r, outputs: outs });
}

// ------------------------------------------------------------------ result

function done(kind, machine, info) {
  const m = layout({ ...machine, title: machine.title || info.title });
  if (kind === 'MOORE' || kind === 'MEALY') m.output_alphabet = [...new Set(kind === 'MOORE' ? m.states.map(s => s.output) : m.transitions.map(t => t.output))].sort();
  m.type = kind === 'ENFA' ? 'ENFA' : kind;
  return { ok: true, kind, route: ROUTE[kind], machine: m, ...info, notes: info.notes || [] };
}
