# 18. Inside the reader: one sentence, step by step

The description of the English reader in the previous chapters is abstract, so this chapter follows a single sentence all the way through it. The sentence is:

> binary strings that end with 01 and have an even number of 1s

## Normalisation

The reader first lower-cases the text and rewrites a small set of phrasings into canonical forms. "Second-to-last" becomes "second from the end"; "non-empty" becomes "of length at least 1"; quoted symbols are unified to single quotes; an explicit alphabet such as "Σ = {0, 1}" or "over {a, b}" is recorded and removed from the text. Here, the word "binary" tells the reader that the alphabet is {0, 1}, and nothing else needs rewriting.

## Splitting into clauses

The sentence is then split at "and", "or" and "but not", with care. Phrases that contain these words without joining two conditions ("starts and ends with", "between 2 and 5") are protected before splitting. "Or" binds more loosely than "and", so a sentence such as "starts with a and ends with b or has length 3" becomes two alternatives, the first of which has two conditions. A clause that has no verb of its own inherits one from the clause before it, so "contains aa or bb" is read as "contains aa or contains bb".

Our sentence becomes two clauses that must both hold:

| Clause | Text after splitting |
|---|---|
| 1 | strings that end with 01 |
| 2 | have an even number of 1s |

## Classifying each clause

Each clause is turned into features: individual words, pairs of adjacent words, and placeholder tokens for numbers (`NUM`), symbols of the alphabet (`SYM`) and ordinal words (`ORD`), so that "ends with 01" and "ends with abb" look alike to the model. The logistic-regression model scores every kind of condition and picks the highest.

| Clause | Top prediction | Confidence |
|---|---|---|
| strings that end with 01 | ENDS (ends with) | high |
| have an even number of 1s | COUNT_MOD (count of a symbol modulo k) | high |

A handful of deterministic rules can override the model where position words matter more than verbs. "The last symbol is 0" is an *ends with* condition, even though it contains neither "end" nor "with"; "the second symbol from the end is 1" is an *n-th from the end* condition even if the model is unsure. The rules exist because those phrasings are both common and unambiguous, and an error there would be particularly confusing.

## Extracting the slots

With the kind of condition known, simple rules pull out its parameters. For *ends with*, the slot is the string `01`. For *count modulo*, the slots are the symbol `1`, the modulus 2 ("even") and the remainder 0. If a required slot is missing ("ends with" and nothing after it), the reader reports a problem in words instead of guessing.

## Building exact automata

Each condition is now built as an exact DFA over {0, 1}:

- *Ends with 01* is a pattern automaton in the style of the Knuth–Morris–Pratt algorithm: its states record the longest suffix of the input so far that is also a prefix of `01`. It has three states.
- *Even number of 1s* is a two-state counter: the state flips on every 1 and stays on every 0.

## Combining and minimising

The two automata are combined with a product construction: a state of the product is a pair of states, one from each automaton, and it accepts when both components accept. The product has six states, and minimisation confirms that all six are needed. The result is drawn on the canvas, laid out by the automatic layout, and the panel explains what was understood:

> Σ = {0, 1}; accept a string iff it ends with '01' AND has an even number of '1'.

followed by a few accepted strings (`101`, `0101`, `11101`) and rejected strings (`01`, `1`, `0110`). That short list is surprisingly important. It lets a student check, at a glance, that the reader understood what they meant, which is the right protection against the one step that is learned rather than exact.

![The assistant after building a DFA from a description. The read-back, the sample strings and the drawn DFA appear together.](../media/fa-assistant-build.png){.screenshot}

## What happens when it does not understand

If a clause is classified with low confidence, or a slot is missing, the reader does not produce a machine. It shows which clause it could not read, the two or three most likely interpretations, and suggestions for rephrasing. A wrong machine presented confidently would be far worse than an honest "I did not understand this part", and the design is built around that preference.

# 19. What the tests look like

The test suite is described in general terms in Chapters 14 and 15. Because it is the part of the project I would most want another developer to copy, this chapter shows what the tests actually look like.

## A brute-force reference

Every practice question that once had a wrong answer has an entry in `tests/practice-truth.mjs`: the alphabet, a predicate written directly in JavaScript, and a regular expression or description from which a correct machine can be built.

```js
'DFA/medium/7': { sigma: '01', pred: w => w[0] === '0' || w.endsWith('1'),
                  regex: '0(0|1)*|(0|1)*1' },
'NFA/medium/1': { sigma: 'ab', pred: w => w.length >= 2 && w[w.length - 2] === 'a',
                  regex: '(a|b)*a(a|b)' },
```

The test enumerates every string over the alphabet up to length eight and checks that the stored answer and the predicate agree on each one. The regular expression is itself checked against the predicate before it is used to rebuild an answer, so a mistake in the expression cannot quietly replace one wrong answer with another.

## A differential test

The differential tests generate random machines with a fixed seed and compare two implementations.

```js
for (let k = 0; k < 300; k++) {
  const nfa = randomNfa(rng, 2 + (k % 5), ['a', 'b']);
  const legacy = convertNfaToDfa(nfa);          // the January code
  const exact = FA.toMinimalDfa(nfa, ['a', 'b']); // the engine
  assert.ok(FA.compare(FA.toMinimalDfa(legacy, ['a', 'b']), exact).equivalent);
}
```

If the two ever disagree, the assertion message includes the shortest counterexample, which makes the bug easy to reproduce by hand.

## Specifications for transducers and Turing machines

For Mealy and Moore machines, each specification maps an input to the complete output string. For the Moore machine that outputs `Y` when the binary number read so far is divisible by three, the specification is a single line:

```js
w => 'Y' + prefixes(w).map(p => (parseInt(p, 2) % 3 ? 'N' : 'Y')).join('')
```

For Turing machines, a specification returns `null` when the input must be rejected, `true` when it must be accepted, or the exact expected tape when the machine transforms its input. The string-reversal machine's specification is `w => [...w].reverse().join('')`, and the test fails if the machine halts with any other tape.

## Tests for the user interface

The browser-level checks are not part of the automated suite, because they need a real browser, but they were run for every change in November. A script opens each studio at four screen sizes and reports any element that overflows the screen; another adds states with the keyboard, undoes and redoes, saves, exports a PNG, reloads a file, opens the shortcut sheet, zooms, and records every download and every error. Those scripts found the save, export and dialog bugs described in Chapter 17.

## Running everything

```bash
npm test               # the full suite, a few seconds
npm run train-model    # retrain the English reader's model (deterministic)
```

A GitHub workflow runs the suite on every push and also retrains the model and fails if the committed model differs from the retrained one, which guarantees that the model in the repository is always the one the training code produces.
