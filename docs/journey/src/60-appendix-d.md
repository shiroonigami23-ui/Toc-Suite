# Appendix D — The audit, answer by answer {.unnumbered}

These tables list every finite-automaton and pushdown-automaton reference answer that the November 2026 audit found to be wrong, with the shortest string on which the old answer disagreed with the definition of the language. They were generated from the repository as it stood before the fixes, using the same predicates as the test suite. Every answer has since been rebuilt and is checked on every push.

## Finite automata

| Question | Statement | Shortest failing string | The old answer |
|---|---|---|---|
| DFA medium | DFA accepting strings that DO NOT start with "1" OR DO NOT end with "0" (Σ={0, 1}) | `1` | rejected it |
| DFA medium | DFA for strings where the third symbol from the end is "a" (Σ={a, b}) | `aaa` | rejected it |
| DFA medium | DFA accepting strings that start with "0" OR end with "1" (Σ={0, 1}) | `1` | rejected it |
| NFA basic | NFA for language 0*1*0*1 (Σ={0, 1}) | `1` | rejected it |
| NFA basic | NFA for language a+ b* (Σ={a, b}) | `aba` | accepted it |
| NFA medium | NFA for strings where second-to-last symbol is "a" (Σ={a, b}) | `aa` | rejected it |
| NFA medium | NFA for the language (ab)* or (ba)* (Σ={a, b}) | `abba` | accepted it |
| NFA medium | NFA accepting language "1" or "01" (Σ={0, 1}) | `ε` | accepted it |
| NFA medium | NFA for strings that starts and ends with "a" (Σ={a, b}) | `a` | rejected it |
| NFA hard | NFA for the regular expression (00)* (11)* (00\|11) (Σ={0, 1}) | `00` | rejected it |
| NFA hard | NFA accepting strings where the second symbol from the start is "0" AND the third symbol from t | `100` | rejected it |
| NFA hard | NFA for language w mid \|w\| text is prime (Σ={a}) | `aa` | rejected it |
| ENFA easy | ε-NFA for strings of "a"s where the length is either 2 or 4 (Σ={a}) | `a` | accepted it |
| ENFA basic | ε-NFA for (0\|1)*01* (ends with 0 followed by 1s) (Σ={0, 1}) | `0` | rejected it |
| ENFA basic | ε-NFA for language (aa)* or (bb)* (Σ={a, b}) | `a` | accepted it |
| ENFA medium | ε-NFA for L = 0+ (1 or ε) (Σ={0, 1}) | `010` | accepted it |
| ENFA medium | ε-NFA for language (a or ε) . (b or ε) . (c or ε) (Σ={a, b, c}) | `cc` | accepted it |
| ENFA hard | ε-NFA for $L = (a\|b)* . (a . a or b . b) (ends with aa or bb) (Σ={a, b}) | `a` | accepted it |
| ENFA hard | ε-NFA for language (0* 1)* (10)* (Σ={0, 1}) | `1` | rejected it |
| ENFA hard | ε-NFA for language (01)^n (10)^m, where n, m >= 1 (Σ={0, 1}) | `011` | accepted it |
| ENFA hard | ε-NFA for $L = a \cdot \Sigma \cdot a \cdot \Sigma$ (Σ={a, b}) | `aaa` | accepted it |

## Pushdown automata

| Problem | Shortest failing string | The old answer |
|---|---|---|
| Equality: a^n b^n | `aab` | accepted it |
| Balanced Parentheses | `()()` | rejected it |
| Even Palindrome (ww^R) | `0` | accepted it |
| Comparative: a^2n b^n | `ab` | accepted it |
| Equality: n(a) = n(b) | `a` | accepted it |
| Comparative: n(a) + n(b) = n(c) | `ε` | rejected it |
| Non-Deterministic Union: a^n b^2n OR a^2n b^n | `ab` | accepted it |
| Inequality: n(a) ≠ n(b) | `ε` | accepted it |
| Double Equality: a^n b^n c^m d^m | `abccd` | accepted it |
| Offset: a^n b^(n+2) | `bb` | rejected it |
| Multiplier: a^n b^3n | `ab` | accepted it |
| Equation: n(a) = 2n(b) + 1 | `aaab` | rejected it |
| Prefix Constraint: n(a) ≥ n(b) | `aaaaaa` | rejected it |
| Search: Exactly one 'aaa' | `aaaba` | rejected it |
| Union: n(a)=n(b) OR n(a)=n(c) | `a` | accepted it |
| Sum: n(b) = n(a) + n(c) | `a` | accepted it |
| Modulo: Even Zeros, Equal 0/1 | `1` | accepted it |
| Marker: a^n c b^2n | `ac` | accepted it |
| NPDA: w x w^R | `010` | rejected it |
| Inequality: a^n b^m (n ≠ m) | `ε` | accepted it |
| Partial: a^n b^n c^m | `a` | accepted it |
| Nested: { } and [ ] | `[` | accepted it |
| Summation: i + j = k | `ε` | rejected it |
| Bound: a^n b^n (n ≤ 3) | `aab` | accepted it |
| Structure: Equal a/b, Even Length | `a` | accepted it |
| Debt: n(0) = 2 * n(1) | `0` | accepted it |
| Deterministic Palindrome (w#w^R) | `b#b` | rejected it |
| NPDA: Palindrome w w^R | `a` | accepted it |

The pattern in the second table is striking: in almost every case the old answer *accepted* a string it should have rejected, usually a short one such as `a` or `ab`. Those are the strings a person testing "typical" inputs never tries, and they are the first strings an exhaustive check tries.
