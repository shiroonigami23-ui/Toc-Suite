// Every Turing-machine practice solution and library machine is run on every input up to
// length 6 over its alphabet and compared with an independent JavaScript specification.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { words } from './practice-truth.mjs';

globalThis.window = globalThis.window || {};
globalThis.document = globalThis.document || { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
const { TM_PRACTICE_BANK } = await import('../tm_practice_bank.js');
const { runTmSimulation } = await import('../tm_simulation.js');

const cnt = (w, c) => [...w].filter(x => x === c).length;
const bin = (w) => parseInt(w, 2);
const rev = (w) => [...w].reverse().join('');
// spec(w) -> null (must reject) | string (must accept with this tape) | true (must accept, tape not checked)
const SPEC = {
  tm_move_to_end: w => w,
  tm_invert_bits: w => w.replace(/[01]/g, c => (c === '0' ? '1' : '0')),
  tm_constant_write: w => 'X' + w.slice(1),
  tm_find_first_one: w => (w.includes('1') ? w : null),
  tm_clear_tape: () => '',
  tm_unary_increment: w => w + '1',
  tm_binary_increment: w => (w === '' ? '1' : (bin(w) + 1).toString(2).padStart(w.length, '0')),
  tm_check_even_zeros: w => (cnt(w, '0') % 2 === 0 ? w : null),
  tm_mark_ends: w => (w.length <= 1 ? '#'.repeat(w.length) : '#' + w.slice(1, -1) + '#'),
  tm_delete_first: w => w.slice(1),
  tm_unary_addition: w => (/^1+\+1+$/.test(w) ? '1'.repeat(w.length - 1) : 'skip'),
  tm_binary_copy: w => `${w}#${w}`,
  tm_string_reversal: w => rev(w),
  tm_balanced_parens: w => { let d = 0; for (const c of w) { d += c === '(' ? 1 : -1; if (d < 0) return null; } return d === 0 ? true : null; },
  tm_binary_palindrome: w => (w === rev(w) ? true : null),
  tm_an_bn_cn: w => (/^a+b+c+$/.test(w) && cnt(w, 'a') === cnt(w, 'b') && cnt(w, 'b') === cnt(w, 'c') ? true : null),
  tm_binary_multiplication: w => w + '0',
  tm_binary_subtraction: w => (w.includes('1') ? (bin(w) - 1).toString(2).padStart(w.length, '0') : 'skip'),
  tm_copy_arbitrary: w => w + w,
  tm_wcw_checker: w => { const i = w.indexOf('c'); return i >= 0 && w.lastIndexOf('c') === i && w.slice(0, i) === w.slice(i + 1) ? true : null; },
};
const trim = (t) => t.replace(/^B+|B+$/g, '');

test('every TM practice solution meets its specification on all short inputs', () => {
  const entries = Object.values(TM_PRACTICE_BANK).flat();
  const bad = [];
  for (const e of entries) {
    const spec = SPEC[e.id];
    assert.ok(spec, `no spec for ${e.id}`);
    for (const w of words(e.inputAlphabet, 6)) {
      const want = spec(w);
      if (want === 'skip') continue;
      const r = runTmSimulation(w, { ...e.machine, type: 'TM' }, 20000);
      if (want === null ? r.success : !r.success) bad.push(`${e.id} "${w}": ${r.success ? 'accepted' : r.message}`);
      else if (typeof want === 'string' && trim(r.finalTape) !== want) bad.push(`${e.id} "${w}": tape ${trim(r.finalTape)} ≠ ${want}`);
      if (bad.length > 15) break;
    }
  }
  assert.deepEqual(bad, []);
});

test('TM solutions only use moves the plain TM validator allows', () => {
  for (const e of Object.values(TM_PRACTICE_BANK).flat()) for (const t of e.machine.transitions)
    assert.ok(['L', 'R'].includes(t.move), `${e.id}: move ${t.move}`);
});

test('tm_library.json machines work', () => {
  const lib = JSON.parse(readFileSync(new URL('../tm_library.json', import.meta.url)));
  const inc = lib.find(e => /increment/i.test(e.title)).machine;
  const pal = lib.find(e => /palindrome/i.test(e.title)).machine;
  for (const w of words(['0', '1'], 6)) {
    const r = runTmSimulation(w, inc, 5000);
    assert.ok(r.success, `incrementer rejected "${w}"`);
    assert.equal(parseInt(trim(r.finalTape), 2), (w ? parseInt(w, 2) : 0) + 1, `incrementer on "${w}"`);
    assert.equal(runTmSimulation(w, pal, 5000).success, w === rev(w), `palindrome on "${w}"`);
  }
});
