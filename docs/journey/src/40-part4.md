# Part IV — A second look {.part}

November 2026: an audit, a verification engine, an assistant that understands English, and a codebase put in order.

# 14. The audit

## Why I went back

By November the project had been stable for eight months. Students used it; nobody reported serious problems. But I wanted to add something genuinely new, an assistant that could build an automaton from a description of its language, and before adding a feature that would *generate* answers I wanted to be sure the existing answers were right. If the assistant and the practice bank disagreed, I needed to know which one to trust.

So I set a rule for myself: no stored answer, conversion or checker would be trusted because it looked right. Every one would be compared against something independent.

## The method

For finite automata the independent reference was straightforward to build: a small engine (described in the next chapter) that can determinise and minimise any automaton, compare two automata exactly, and produce the shortest string on which they differ. With that engine I wrote **differential tests**: generate hundreds of random automata and random regular expressions, run them through the January code (the simulator, the NFA → DFA conversion, the minimiser, the regular-expression converter in the Grammar Studio) and through the new engine, and fail if they ever disagree.

For the practice banks, the reference was a *brute-force predicate*. For each question I wrote, by hand, a short JavaScript function that decides membership directly. For "strings that do not start with 1 or do not end with 0" the predicate is literally `w => !(w[0] === '1' && w.endsWith('0'))`. The test then runs the stored answer and the predicate on every string over the alphabet up to length eight (511 strings for a binary alphabet) and fails on the first disagreement.

For pushdown automata the predicates were the same idea, checked on every string up to length seven with the non-deterministic simulator. For Turing machines, which can transform their tape, each specification returns either "reject", "accept" or the exact expected final tape. For Mealy and Moore machines, each specification returns the full output string.

## What it found

The results were not what I expected.

![The fraction of stored practice answers that were wrong.](../figures/chart-audit.png)

**Finite automata.** Twenty of the one hundred and twenty construction answers accepted the wrong language. Some were off by a single string: the answer for "start with 0 or end with 1" rejected the string `1`, which ends with 1; the answer for `(0|1)*01*` rejected `0`. Others were more seriously wrong: the answer for "the third symbol from the end is a" rejected `aaa`. One question asked for an NFA recognising strings whose length is prime, which is not a regular language at all, and its stored answer was an automaton with no transitions. I rewrote that question with a bound ("a prime length no larger than seven") so that it is both regular and meaningful.

**Pushdown automata.** Twenty-eight of thirty-three answers were wrong, which is the number that most surprised me. Almost all failed for the same reason: an accepting state that could be reached before the stack had been checked. The answer for $a^n b^n$, for example, entered an accepting state after the first `b`, so `aab` was accepted with an `A` still on the stack. In January I had tested these machines on a few strings of the expected shape, and they worked on those strings; the strings they wrongly accepted were exactly the ones I had not thought to try.

**Turing machines.** Eight of twenty answers were broken: string copy, string reversal, palindrome, $w c w$, balanced parentheses, marking both ends, "even number of zeros" (which accepted `0` because the start state was also the halting state) and an arbitrary-copy machine. Separately, the two machines in the TM *library* stored their head movement under the field name `direction` while the simulator reads `move`, so they never moved at all.

**Mealy and Moore machines.** Four machines were wrong: the "10" detector (in two places), the "11" detector, which forgot that `111` still ends in `11`, and a Mealy machine for strings ending in `110` with the same mistake. The serial binary adder could not be run at all, because its input symbols are the pairs `00`, `01`, `10`, `11` and the simulator read input one character at a time.

**The January code.** The NFA → DFA conversion always added an unreachable empty state. The equivalence check used for practice answers reported "incorrect" when the student's machine and the reference used different alphabets, even if they accepted the same strings over the common symbols. The Grammar Studio's regular-expression converter did not accept `+` as union, although that is the notation most textbooks use. The Mealy → Moore conversion could produce a machine with no start state, and it matched states to their copies by checking whether one name started with the other, so `q1` and `q11` were confused. The practice data had a misspelled key (`transition` instead of `transitions`), an older spelling of ε that the engine did not recognise, and three answers that referred to a trap state they never declared.

## What I took from it

It would be easy to read those numbers as a failure, and in one sense they are: for ten months a student could draw a correct PDA for $a^n b^n$, press "Check", and be told it was wrong because the reference was wrong. But the more useful reading is about method. Every one of those answers had been checked, by me, on examples. Examples are exactly what fails here, because the strings that expose a wrong automaton are the ones you do not think of. Exhaustive checking over short strings found every one of these bugs in seconds, and the exact equivalence check for finite automata makes the question unambiguous.

The fixes are now permanent. Every stored answer is rebuilt from a construction the engine verifies, every bank is checked by the test suite on every push, and a mistake in a future question will fail the build before it reaches a student.

# 15. A verification engine

## The core

The audit needed an engine that was independent of the January code, and it became the foundation for everything that followed. It lives in `src/core/` and has no knowledge of the user interface: it takes plain data and returns plain data, so the same code runs in the browser and in the Node.js test runner.

The core contains:

- **Determinisation** (subset construction with ε-closures) into a compact internal DFA format: an alphabet, a start state, a list of accepting flags and a transition table.
- **Minimisation** by partition refinement, after removing unreachable states.
- **Product constructions** for intersection, union, difference and symmetric difference.
- **Exact comparison**: build the symmetric-difference product, search it breadth-first, and return either "equivalent" or the shortest counterexample together with which machine accepts it.
- **Regular expressions** parsed into a syntax tree and compiled by Thompson's construction.
- **ε-removal**, **dead-state detection** and **structural checks** (missing start state, dangling transitions, non-determinism, unreachable states).

![Minimisation in the engine: the five-state DFA on the left has two pairs of equivalent states; the minimal DFA on the right has three.](../figures/min-before.png){.narrow}

![](../figures/min-after.png){.narrow}

## Feedback that teaches

Exact comparison changed the practice checker more than any other single change. A wrong answer is no longer "incorrect"; it is "your machine accepts `aab`, but it should be rejected", with the shortest such string. A student who sees the shortest counterexample can trace it on their own drawing and find the mistake, which is far more instructive than a bare verdict.

## Conversion practice

With an engine that can check *any* finite automaton, it became possible to offer something the January version could not: practice in the conversion procedures themselves. The FA studio now has one hundred and fifty-nine conversion exercises across ε-NFA → NFA, NFA → DFA, DFA → minimal DFA and NFA → minimal DFA. Each exercise draws the machine to convert on the canvas; the student edits it into the answer and presses "Check".

Checking a conversion needs more than equivalence: the answer to an ε-removal question must have no ε-transitions; the answer to a subset-construction question must be deterministic; the answer to a minimisation question must have exactly the minimal number of states (with or without a trap state). The checker reports the first unmet requirement in words: "Same language, but not finished: your DFA has six states, but the minimal DFA has four."

![A conversion exercise: the NFA to convert is drawn on the canvas, and the question appears in the practice panel.](../media/fa-conversion-practice.png){.screenshot}

Building those exercises raised its own small problems. Some NFA answers in the bank were already deterministic, which would make "convert this NFA to a DFA" trivial, so the generator adds a duplicate state and a second, parallel transition to make the source genuinely non-deterministic without changing its language. Some DFA answers were already minimal, so the generator duplicates states to create something to minimise. One ε-NFA question, the intersection of $(ab)^*$ and $(ba)^*$, has the answer $\{\varepsilon\}$ with no transitions at all, so there is nothing to remove and it is skipped.

## Testing the old code against the new

The engine also made it possible to keep the January code honest. The test suite generates random automata and checks that the January simulator, the January conversions and the Grammar Studio's converter agree with the engine. They now do. The same suite checks every practice bank, every library file, both directions of the Mealy/Moore conversion on random machines, and the exact Mealy/Moore equivalence check against brute force. There are forty-five test groups in all; they run in a few seconds on every push.

# 16. The Automata Assistant

## The idea

The feature that started the November work is the **Automata Assistant**, a panel in the FA studio with three abilities: build a DFA from a description in English, learn a DFA from examples of accepted and rejected strings, and watch a student draw while pointing out mistakes. The requirement I set was strict. It had to run entirely in the browser, with no server and no API key, and when it built an automaton, the automaton had to be *exactly* right, not approximately right.

## Describe → DFA

The obvious way to turn English into an automaton is to ask a large language model, and the obvious problem is that a language model produces something that looks like an automaton and is sometimes subtly wrong, which is precisely what the audit had just taught me to distrust. The assistant takes a different approach that splits the problem into a part that needs judgement and a part that needs precision.

![How a description becomes a DFA. Only one stage is learned; every other stage is an exact construction.](../figures/assistant-pipeline.png){.tall}

The sentence is first normalised (quotation marks, "Σ = {a, b}", ordinal words such as "second-to-last") and split into clauses at "and", "or" and "but not", taking care not to split phrases like "starts and ends with". Each clause is then classified into one of about twenty kinds of condition: *starts with*, *ends with*, *contains*, *count modulo k*, *length at least n*, *n-th symbol from the end*, *divisible by*, *no k consecutive*, *a before b*, and so on. That classification is the only learned step. It is done by a small multinomial logistic-regression model over word unigrams and bigrams, trained on several thousand generated phrasings and stored as a 155 KB file in the repository. The training script uses a fixed random seed, so retraining reproduces the file byte for byte, and the test workflow fails if the committed model is out of date.

Once a clause is classified, the symbols and numbers are extracted by rules, and the condition is built as an **exact** automaton: a KMP-style pattern automaton for *contains* and *ends with*, a counter for modular conditions, a bit-mask automaton for "n-th from the end", a remainder automaton for divisibility. Clauses are combined with product constructions, and the result is minimised and laid out. A regular expression typed into the description, or a finite list of words, is recognised directly. The panel always shows how it read the sentence, clause by clause, and lists sample accepted and rejected strings, so that a misread is visible immediately.

How good is it? The classifier on its own scores 99.9% on its training phrasings and about 68% on phrasing templates deliberately held out from training, which is a harsh test: a held-out template is a sentence *shape* the model has never seen. The whole pipeline is measured differently, by brute force: every test description is parsed, and the resulting DFA is compared against a hand-written predicate on every string up to a fixed length. All sixty-three descriptions in the main test set pass. A separate set of twenty-five phrasings written after the model was trained scored 88% on first contact; the three failures pointed at general gaps (set-builder notation, "no more than", and "the last symbol is") which I fixed in the rules rather than by retraining on those exact sentences, and that set now passes completely. On the one hundred and twenty practice questions, the reader understands one hundred and ten and agrees with every corrected reference answer.

## Examples → DFA

The second ability learns a DFA from labelled examples, written as `+ ab`, `- ba` and so on. It uses RPNI, a classical state-merging algorithm: build a tree that accepts exactly the positive examples, then repeatedly try to merge states in a fixed order, keeping a merge only if the merged machine still rejects every negative example. The result is small and consistent with every example, and with enough examples it converges on the intended language.

## Guided mode

The third ability is the one my classmates asked for most, and it is the one I find most satisfying. In **guided mode** the assistant knows the target language but does not draw it. The student draws; after every change the assistant compares the drawing with the target and reports, in plain language, the most useful thing to fix next.

![Guided mode. The target is "an even number of a"; the student has drawn two states, and the assistant explains which state should be accepting and which moves are missing, with the strings that prove it.](../media/fa-guided-mistake.png){.screenshot}

The diagnosis is more than a counterexample. The assistant maps each drawn state to the target state it most plausibly represents, by following the shortest strings that reach it. That makes several kinds of explanation possible: "q1 is marked accepting, but `a`, which ends in q1, should be rejected"; "q2 is doing two jobs: after `ab` it should accept on `b` but after `b` it should not"; "q0 has no move on `b`". Each hint has a *Test* button that runs the string that proves it, and the offending state is ringed in red on the canvas. A progress bar shows how much of the target behaviour is already right. When nothing is wrong, the panel says so.

## The other half: practice

The assistant connects naturally to the practice panel. When a practice question is open, guided mode uses the question's reference answer as its target, so a student can practise with hints and then check without them. Because every reference answer is now verified, the assistant and the checker can no longer disagree.

# 17. Putting the house in order

## Ninety files in one folder

By November the repository root contained more than ninety files: every studio's modules, every practice bank, four library files, two dozen HTML pages and fragments, the style sheet, icons, a stray Python script and a text file I had added on the first day as a joke. Finding anything required knowing its name.

The reorganisation moved every file into a folder by role: `src/` for application code, with a sub-folder per studio plus `app/`, `shared/`, `core/` and `assistant/`; `data/` for practice banks, built libraries, library sources and the inbox; `pages/` for the secondary pages; `assets/` for styles, icons and vendored code; `docs/`, `tests/` and `tools/`. Five files that nothing referenced were removed.

Moving files in a no-build application is risky, because every relative import, every `fetch` of a JSON file and every link between pages encodes a path. I did the move with a script that rewrote each import by resolving it against the file's *old* location and re-expressing it from the *new* location, then checked that every import in the project resolved to an existing file. Data files are now fetched through a small helper that resolves paths against the site root, so they work whether the site is served from the domain root, from a GitHub Pages sub-path or from a local server. Old URLs still work: Netlify redirects send `/grammar_studio.html` and the other moved pages to their new homes, and a `404.html` page does the same on hosts without redirect rules.

## Every screen size

I tested every studio at phone, tablet, laptop and desktop sizes and fixed what I found. On phones the drawing area now keeps a minimum size and scrolls, so states remain legible instead of shrinking to a few pixels; the zoom control becomes a compact pill in the corner instead of a white bar across the canvas; the Grammar Studio's hidden drawer no longer leaves an empty band; and empty status boxes no longer appear as blank buttons in the toolbar.

::: twocol
![The FA studio on a phone.](../media/phone-fa.png)

![The PDA studio on a phone.](../media/phone-pda.png)
:::

## Keyboard, animation and files

Every studio now shares one set of keyboard shortcuts, and pressing `?` shows them.

![The keyboard shortcut sheet, opened with the ? key in any studio.](../media/shortcuts.png){.screenshot}
 One shortcut was actively dangerous: Escape used to clear the canvas. It now closes the top-most dialog or the side panel, and clearing needs Shift + Delete and a confirmation. Animations were rewritten around a single timing source: drawing a loaded machine takes at most about two and a half seconds however large it is (it used to take one and a half seconds *per state and per transition*), conversion steps follow an animation-speed setting, and everything respects the operating system's reduced-motion preference. A second drawing or a conversion now waits for the first drawing to finish, which removed a race where converting a freshly loaded machine produced a corrupted result.

I also tested every upload and download path in every studio: saving and loading JSON, exporting PNG images, exporting transition tables as CSV, the Grammar Studio's PDA download, and settings export and import. Several did not work. Saving in the Mealy/Moore studio did nothing, because it waited for a button that did not exist. Saving and exporting in the PDA and TM studios needed two clicks. The shared dialogs in the main page kept the event handlers of every studio visited, so after switching from FA to Mealy/Moore and back, one click could save twice, or save the wrong machine. Each studio now resets those dialogs when it opens. File names are made safe for every operating system.

The Turing machine studio's Play button used to compute the result and print it in the log; it now animates the tape cell by cell, and the live tape and stack panels open automatically when a run starts.

## Faster to load

The icon library was the largest single file the application downloaded: 487 KB of icon definitions, loaded from a third-party server on every page, of which the application uses ninety-six. A build script now extracts only those icons into a 20 KB local file, which also removes the dependency on the third-party server. The PDA and TM practice banks and the assistant's model are loaded only when they are first needed. The first page now downloads about 640 KB uncompressed instead of about 1.4 MB.

![Application JavaScript (excluding practice data and tests) at the end of each working day.](../figures/chart-codesize.png)

## Settings and policies

The last part of the clean-up was about trust. A new page sets out, in plain language, what the application stores on the device, what it sends to a server and when, how long submissions are kept, what students may and may not do with the tool in graded work, and what accessibility features exist. The settings page links to it and gained the controls it describes. The last traces of an early AI image generator, which no button reached any more, were removed along with the server functions behind it.
