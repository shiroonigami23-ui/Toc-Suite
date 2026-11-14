// Every PDA practice solution and library machine is run (non-deterministically) on every
// input up to length 7 and compared with an independent JavaScript definition of its language.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { words } from './practice-truth.mjs';

globalThis.window = globalThis.window || {};
globalThis.document = globalThis.document || { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
const { PDA_PRACTICE_BANK } = await import('../pda_practice_bank.js');
const { runPdaSimulation } = await import('../pda_simulation.js');

const n = (w, c) => [...w].filter(x => x === c).length;
const rev = (w) => [...w].reverse().join('');
const form = (re) => (w) => re.test(w);
const balanced = (pairs) => (w) => {
  const st = [];
  for (const c of w) {
    if (pairs[c]) st.push(pairs[c]);
    else if (st.pop() !== c) return false;
  }
  return st.length === 0;
};
export const PDA_SPEC = {
  pda_an_bn: w => form(/^a*b*$/)(w) && n(w, 'a') === n(w, 'b'),
  pda_balanced_parentheses: balanced({ '(': ')' }),
  pda_wwr: w => w.length % 2 === 0 && w === rev(w),
  pda_a2n_bn: w => form(/^a+b+$/)(w) && n(w, 'a') === 2 * n(w, 'b'),
  pda_nb_greater_na: w => n(w, 'b') > n(w, 'a'),
  pda_an_bm_or_am_bn: null,   // description is not a precise language
  pda_odd_palindrome: w => { const i = w.indexOf('c'); return i >= 0 && w.length === 2 * i + 1 && n(w, 'c') === 1 && w.slice(0, i) === rev(w.slice(i + 1)); },
  pda_na_eq_nb: w => n(w, 'a') === n(w, 'b'),
  pda_diff_counts: w => form(/^a*b*c*$/)(w) && n(w, 'a') + n(w, 'b') === n(w, 'c'),
  pda_an_bm_cn: w => form(/^a+b+c+$/)(w) && n(w, 'a') === n(w, 'c'),
  pda_an_b2n_or_a2n_bn: w => w !== '' && form(/^a*b*$/)(w) && (n(w, 'b') === 2 * n(w, 'a') || n(w, 'a') === 2 * n(w, 'b')),
  pda_nb_neq_na: w => n(w, 'a') !== n(w, 'b'),
  pda_an_bn_cm_dm: w => form(/^a+b+c+d+$/)(w) && n(w, 'a') === n(w, 'b') && n(w, 'c') === n(w, 'd'),
  pda_an_bn_plus_2: w => form(/^a*b*$/)(w) && n(w, 'b') === n(w, 'a') + 2,
  pda_an_b3n: w => form(/^a+b+$/)(w) && n(w, 'b') === 3 * n(w, 'a'),
  pda_a_i_b_j_i_eq_2j_plus_1: w => form(/^a*b*$/)(w) && n(w, 'a') === 2 * n(w, 'b') + 1,
  pda_prefix_na_geq_nb: w => { let d = 0; for (const c of w) { d += c === 'a' ? 1 : -1; if (d < 0) return false; } return true; },
  pda_exactly_one_triple: w => [...w].filter((_, i) => w.startsWith('aaa', i)).length === 1,
  pda_na_eq_nb_or_nc: w => n(w, 'a') === n(w, 'b') || n(w, 'a') === n(w, 'c'),
  pda_nb_eq_na_plus_nc: w => n(w, 'b') === n(w, 'a') + n(w, 'c'),
  pda_bin_even_zeros: w => n(w, '0') % 2 === 0 && n(w, '0') === n(w, '1'),
  pda_an_c_b2n: w => form(/^a*cb*$/)(w) && n(w, 'b') === 2 * n(w, 'a'),
  pda_substring_reversal: w => w.length >= 3 && w[0] === w[w.length - 1],
  pda_not_an_bn: w => form(/^a*b*$/)(w) && n(w, 'a') !== n(w, 'b'),
  pda_an_bn_cm: w => form(/^a*b*c*$/)(w) && n(w, 'a') === n(w, 'b'),
  pda_nested_brackets: balanced({ '{': '}', '[': ']' }),
  pda_an_b_cn: w => form(/^a+bc+$/)(w) && n(w, 'a') === n(w, 'c'),
  pda_a_i_b_j_c_k_i_plus_j_eq_k: w => form(/^a*b*c*$/)(w) && n(w, 'a') + n(w, 'b') === n(w, 'c'),
  pda_max_three_a: w => form(/^a+b+$/)(w) && n(w, 'a') === n(w, 'b') && n(w, 'a') <= 3,
  pda_even_total_length: w => n(w, 'a') === n(w, 'b'),
  pda_twice_as_many_zeros: w => n(w, '0') === 2 * n(w, '1'),
  pda_palindrome_hash: w => { const i = w.indexOf('#'); return i >= 0 && n(w, '#') === 1 && w.slice(0, i) === rev(w.slice(i + 1)); },
  pda_palindrome_any_middle: w => w.length % 2 === 0 && w === rev(w),
};

const sigmaOf = (m) => [...new Set(m.transitions.map(t => t.symbol).filter(s => s && !/^(ε|eps|epsilon|λ)$/i.test(s)))];

export function pdaMismatches(machine, spec, maxLen = 7, limit = 5) {
  const bad = [];
  for (const w of words(sigmaOf(machine).sort(), maxLen)) {
    const got = runPdaSimulation(w, machine, { silent: true }).success;
    if (got !== spec(w)) { bad.push(`"${w || 'ε'}" ${got ? 'wrongly accepted' : 'wrongly rejected'}`); if (bad.length >= limit) break; }
  }
  return bad;
}

test('every PDA practice solution accepts exactly its language (inputs up to length 7)', () => {
  const problems = [];
  for (const e of PDA_PRACTICE_BANK) {
    assert.ok(e.id in PDA_SPEC, `no spec for ${e.id}`);
    if (!PDA_SPEC[e.id]) continue;
    const bad = pdaMismatches(e.solution, PDA_SPEC[e.id]);
    if (bad.length) problems.push(`${e.id}: ${bad.join(', ')}`);
  }
  assert.deepEqual(problems, []);
});

test('pda_library.json machines accept their languages', () => {
  const lib = JSON.parse(readFileSync(new URL('../pda_library.json', import.meta.url)));
  const specFor = (e) => (/parenthes/i.test(e.title) ? PDA_SPEC.pda_balanced_parentheses
    : /n >= 1|n ≥ 1/.test(e.title) ? (w => w !== '' && PDA_SPEC.pda_an_bn(w)) : PDA_SPEC.pda_an_bn);
  const problems = [];
  for (const e of lib) {
    const bad = pdaMismatches(e.machine || e, specFor(e));
    if (bad.length) problems.push(`${e.title}: ${bad.join(', ')}`);
  }
  assert.deepEqual(problems, []);
});
