// Ground truth for practice-bank questions whose stored solution was found to be wrong
// (or that the English reader cannot check on its own). Each entry has an independent
// brute-force predicate and a regex or description that builds the correct machine.
const len = (w) => w.length;
export const TRUTH = {
  'DFA/medium/2': { sigma: '01', pred: w => !(w[0] === '1' && w.endsWith('0')), regex: 'ε|0(0|1)*|(0|1)*1' },
  'DFA/medium/4': { sigma: 'ab', pred: w => len(w) >= 3 && w[len(w) - 3] === 'a', regex: '(a|b)*a(a|b)(a|b)' },
  'DFA/medium/7': { sigma: '01', pred: w => w[0] === '0' || w.endsWith('1'), regex: '0(0|1)*|(0|1)*1' },
  'DFA/hard/8':   { sigma: '01', pred: w => w.split('1').every(b => b === '' || b.length === 2), regex: null },
  'NFA/basic/4':  { sigma: '01', pred: w => /^0*1*0*1$/.test(w), regex: '0*1*0*1' },
  'NFA/basic/6':  { sigma: 'ab', pred: w => len(w) >= 3, regex: '(a|b)(a|b)(a|b)(a|b)*' },
  'NFA/basic/9':  { sigma: 'ab', pred: w => /^a+b*$/.test(w), regex: 'aa*b*' },
  'NFA/medium/1': { sigma: 'ab', pred: w => len(w) >= 2 && w[len(w) - 2] === 'a', regex: '(a|b)*a(a|b)' },
  'NFA/medium/4': { sigma: 'ab', pred: w => /^((ab)*|(ba)*)$/.test(w), regex: '(ab)*|(ba)*' },
  'NFA/medium/5': { sigma: '01', pred: w => w === '1' || w === '01', regex: '1|01' },
  'NFA/medium/9': { sigma: 'ab', pred: w => w[0] === 'a' && w.endsWith('a'), regex: 'a|a(a|b)*a' },
  'NFA/hard/4':   { sigma: '01', pred: w => /^(00)*(11)*(00|11)$/.test(w), regex: '(00)*(11)*(00|11)' },
  'NFA/hard/7':   { sigma: '01', pred: w => w[1] === '0' && len(w) >= 3 && w[len(w) - 3] === '1', text: 'the second symbol is 0 and the third symbol from the end is 1 over {0,1}' },
  'ENFA/easy/4':  { sigma: '01', pred: w => /^0?1$/.test(w), regex: '(0|ε)1' },
  'ENFA/easy/7':  { sigma: 'a', pred: w => len(w) === 2 || len(w) === 4, regex: 'aa|aaaa' },
  'ENFA/basic/1': { sigma: '01', pred: w => /^[01]*01*$/.test(w), regex: '(0|1)*01*' },
  'ENFA/basic/6': { sigma: 'ab', pred: w => /^((aa)*|(bb)*)$/.test(w), regex: '(aa)*|(bb)*' },
  'ENFA/medium/4': { sigma: '01', pred: w => /^0+1?$/.test(w), regex: '00*(1|ε)' },
  'ENFA/medium/8': { sigma: 'abc', pred: w => /^a?b?c?$/.test(w), regex: '(a|ε)(b|ε)(c|ε)' },
  'ENFA/hard/0':  { sigma: 'ab', pred: w => /^[ab]*(aa|bb)$/.test(w), regex: '(a|b)*(aa|bb)' },
  'ENFA/hard/1':  { sigma: 'a', pred: w => len(w) % 2 === 0 || len(w) % 3 === 0, regex: '(aa)*|(aaa)*' },
  'ENFA/hard/2':  { sigma: '01', pred: w => /^(0*1)*(10)*$/.test(w), regex: '(0*1)*(10)*' },
  'ENFA/hard/6':  { sigma: '01', pred: w => /^(01)+(10)+$/.test(w), regex: '01(01)*10(10)*' },
  'ENFA/hard/7':  { sigma: 'ab', pred: w => /^a[ab]a[ab]$/.test(w), regex: 'a(a|b)a(a|b)' },
};

export function* words(sigma, maxLen) {
  yield '';
  let layer = [''];
  for (let n = 1; n <= maxLen; n++) {
    const next = [];
    for (const p of layer) for (const c of sigma) { next.push(p + c); yield p + c; }
    layer = next;
  }
}
