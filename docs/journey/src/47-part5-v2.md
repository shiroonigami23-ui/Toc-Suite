# Part V — Version two {.part}

15 November 2026: one machine builder for every studio, an exact Grammar Studio, the assistant everywhere, study papers, and the apps.

# 20. The Automata Builder

## From one kind of machine to all of them

The Automata Assistant of Chapter 16 could only make DFAs. That was a deliberate limit, because finite automata are the one family where "is this machine right?" has an exact answer. But the questions on assignment sheets are about pushdown automata and Turing machines at least as often as about DFAs: *construct a PDA for aⁿb²ⁿ*, *design a TM for aⁿbⁿcⁿ*, *Mealy machine for 2's complement*. Given one of those, the assistant either misread it as a regular language or gave up. The day after the audit I set out to answer those questions properly, in every studio, with the same rule as before: never draw a machine that has not been checked.

The result is the **Automata Builder**: a floating *Build* button (or the `B` key) in every studio, opening a drawer where a student describes a DFA, NFA, ε-NFA, Moore or Mealy machine, PDA or Turing machine in words or in set notation. It decides what kind of machine to build, switches to the right studio if necessary, builds the machine, verifies it, and only then animates the drawing.

![The Builder in the PDA studio. The request was typed in the FA studio; since aⁿbⁿcᵐ is not regular, the Builder explains why, moves to the PDA studio, draws the machine and shows how it works, sample strings in and out of the language, and the verification result.](../media/builder-pda.png){.screenshot}

## Choosing the machine

The first decision is the kind of machine, and I found that students expect two things at once. If they name a type ("NFA for…", "PDA that accepts…", "Moore machine…"), that type must win. If they do not, the studio they are in should decide: a request typed in the PDA studio should become a PDA even if the language happens to be regular, because that is what the exercise asks for. Only when the requested type *cannot* recognise the language does the Builder move up the hierarchy, and it always says why: "{aⁿbⁿcᵐ | n, m ≥ 1} is not regular, so this is a pushdown automaton"; "aⁿbⁿcⁿ is not context-free: two of its equalities share a block, and one stack cannot compare three counts at once". A request that no machine in the app can meet, such as a finite automaton for an undecidable property, is refused with the reason instead of being drawn wrong.

## Reading the language

The readers in `src/core/build/lang.js` understand the notations that appear on assignment sheets: exponents with conditions (`a^n b^2n c^m where n ≥ 1, m > n`, Unicode superscripts included), counts such as `#a(w) = 2#b(w)` and "more a's than b's", palindromes, `ww` and `w#w`, balanced brackets, `a^(2^n)`, and arithmetic tasks for transducers and Turing machines (increment, complement, unary addition, remainders). Every reading produces two things that are kept strictly apart: a *specification* that the compilers turn into a machine, and an *oracle*, a short independent membership test written directly from the reading. The oracle never looks at the machine, which is what makes it a fair judge.

![How a description becomes a machine. The oracle and the compilers are built from the same reading but independently; nothing is drawn until the verifier has compared them.](../figures/builder-pipeline.png)

## Four compilers

**Finite automata** come from Glushkov's construction (an NFA with no ε-moves and one state per symbol occurrence) or a compact Thompson construction for ε-NFAs, with equivalent states merged and DFAs minimised, so the drawn machine is small enough to read.

**Pushdown automata** were the hardest and most satisfying part. Most textbook context-free languages are a sequence of blocks (`a`s, then `b`s, then `c`s) whose lengths satisfy a few linear equations. The PDA compiler writes those equations as linear algebra, finds the combinations that a single stack can check (using the left null-space of the equation matrix) and turns each into a *signed counter*: a block pushes one symbol per letter, a later block pops them, and when a counter can go below zero a second stack symbol records the debt. Nested and sequential counters, inequalities and unions of such languages all come out of the same compiler, along with dedicated constructions for palindromes and balanced brackets. Every PDA is drawn with an explanation in plain words: "each a pushes one X, each b pops one X…".

![A PDA produced by the Builder for {aⁿb²ⁿ | n ≥ 1}. Labels read *input, pop / push*.](../figures/builder-pda-anb2n.png){.narrow}

**Turing machines** are compiled from a small library of phases: a left-to-right shape check (is the input of the form a\*b\*c\*?), the classic crossing-off sweep that marks one symbol from each block per round, comparisons of `ww` with a marker, doubling, binary increment and so on. After compilation the machine is minimised, which removes the redundant states that phase-by-phase construction leaves behind.

![The Builder's Turing machine for aⁿbⁿcⁿ: each round marks one a as X, one b as Y and one c as W, then returns left; when the a's run out, only marked symbols may remain.](../figures/builder-tm-anbncn.png){.narrow}

**Mealy and Moore machines** are built either from a condition on the input read so far (which is a DFA in disguise: "output 1 when the input so far ends with 101") or from a translation task (2's complement, remainder modulo k, serial addition), then minimised as transducers.

![The Builder's Turing machine in the TM studio, with the Builder's explanation on the right.](../media/builder-tm.png){.screenshot}

## Verify, then draw

Every machine is checked against its oracle before the student sees it. For finite automata the check is exact equivalence, exactly as in the practice checker. For PDAs, Turing machines and transducers it is bounded but exhaustive: every input up to a length (usually six, about a thousand strings) is run through a simulator and compared with the oracle, and a Turing machine must also halt within a step limit. The test suite then goes one step further and runs the generated machines on the *studios'* own simulators, not the Builder's, so that a machine which is right in theory but drawn with a transition the PDA studio reads differently would still fail. That test caught a real bug on the first day: the PDA studio pruned configurations whose stack was taller than the remaining input, which wrongly rejected strings such as `aaaa` for {aⁱbʲ | i > j}. The fix went into the studio, not the Builder.

# 21. The Grammar Studio, rebuilt

## Why rebuild it

When I reread the February Grammar Studio with an auditor's eye, it had the same weakness as the old practice banks. The parse trees came from a heuristic search that could miss parses, so "ambiguous" was a guess; ε was recognised so loosely that a grammar with a non-terminal named `E` lost it; the regular and recursively enumerable tabs were placeholders that produced a "plan" rather than a machine; and the pumping-lemma tab helped write a proof without ever checking one. I replaced the engine and most of the interface.

## An exact engine

The new engine, `src/core/cfg.js`, reads a grammar, classifies it in the Chomsky hierarchy, and computes the nullable, generating and reachable symbols. Parsing uses a chart that *counts* parse trees (saturating at a large number), so the studio can say with certainty whether a string is in the language and whether it has more than one tree, and then show two different trees as a witness of ambiguity together with their leftmost and rightmost derivations.

On top of that sit the procedures the course asks students to carry out by hand, each shown step by step: removal of ε-rules, unit rules and useless symbols; conversion to Chomsky normal form; the CYK table, with every cell explained; FIRST and FOLLOW sets and the LL(1) table, with conflicts highlighted; the standard CFG → PDA construction, which opens in the PDA studio; and right- or left-linear grammar → NFA, which opens in the FA studio.

![Parsing `a+a*a` with the ambiguous expression grammar. The studio proves the ambiguity by showing two distinct parse trees.](../media/grammar-parse.png){.screenshot}

![The CYK table for the same grammar after conversion to Chomsky normal form.](../media/grammar-cyk.png){.screenshot}

## A pumping lemma that checks

The pumping-lemma tab is now a real checker. The student gives a language, a pumping length *p* and a witness such as `a^p b^p c^p`; the studio enumerates *every* legal decomposition (for the context-free lemma, every *uvxyz* with |vxy| ≤ p and |vy| ≥ 1) and pumps each one. If some decomposition stays in the language, the witness is a poor choice and the studio shows that split. If every split fails, it lists how the first few fail, which is exactly the case analysis a written proof needs.

![The pumping-lemma checker on aⁿbⁿcⁿ with p = 3: all 121 decompositions of a³b³c³ leave the language for some i.](../media/grammar-pumping.png){.screenshot}

## Navigation

The old page was a dead end: the only way out was the browser's back button. The rebuilt studio has a header bar linking to Home and to every other studio, and its machines travel through the same hand-over mechanism as the rest of the app. One last bug survived the rebuild for a few hours: *Home* from the Grammar Studio led straight back to the Grammar Studio, because the shell remembered "grammar" as the last route and restored it. Home now carries an explicit `#home` that clears that memory.

# 22. The assistant in every studio

The Builder answers "make this machine for me". The other half of the Assistant, guided practice, had been limited to finite automata, because only there can a drawing be compared with a target exactly. In version 2.0.0 every studio gained an *Automata Assistant* section in its side panel with two tabs. **Describe** builds and draws, like the Builder, or with *Guide me* sets the description as a hidden target without drawing anything. **Check** then compares the student's own machine with that target.

For Mealy/Moore machines, PDAs and Turing machines the comparison is bounded: both machines are run on every input up to a length, outputs are compared for transducers and acceptance (and halting) for the others, and the first disagreement is reported in the same style as the finite-automaton hints: "Your PDA accepts `a`, but it should reject it." It is not a proof of equivalence, which is undecidable for PDAs and Turing machines, but on short strings it is exactly the check a careful student would want, and it finds the usual mistakes immediately.

![Checking a student's PDA in the PDA studio. The target is aⁿbⁿ; the drawn machine (for palindromes) is caught on the very first string where the two differ.](../media/assistant-check-pda.png){.screenshot}

# 23. Study papers

The journey book, the study guide and the technical guide are all about Toc-Suite. What was missing was the subject itself: notes that a student can read away from the screen or print before an examination, without the app. So version 2.0.0 adds ten standalone papers in `docs/papers/`, about eighty pages in all: mathematical preliminaries; finite automata; regular expressions and regular languages; Mealy and Moore transducers; context-free grammars; pushdown automata; Turing machines; decidability; complexity; and a workbook of forty solved examination-style problems.

Each paper follows the same pattern: definitions, theorems with proofs, worked examples, common mistakes, and exercises with answers. The automaton figures are Graphviz sources in the repository, and the papers are built by the same pandoc-and-Chromium pipeline as this book. They went through the same habit as everything else since the audit. Before publishing I checked every worked answer that could be checked mechanically, and that found real errors in my drafts: a Myhill–Nerode example whose answer had the wrong number of equivalence classes (there are four), transducer exercise answers that did not match the machines, and a Post-correspondence example whose stated match did not actually match. The help page now links every paper.

# 24. Shipping

## A new address

Moving the site to a new Netlify account was meant to be a ten-minute job. The old site's URL still carried the version-one name, and I could no longer remember which account owned it, so the site was redeployed under a fresh name, `toc-suite.netlify.app`. The first deploys then failed Netlify's secret scanning, which had found "secrets" in the licence and README. The real cause was environment variables left over from the AI generator I had removed months earlier, plus two values that are not secrets at all (`NODE_ENV` and the public repository name). The fix was to remove the dead variables and tell the scanner explicitly which keys and which prose files to ignore. The lesson: removing a feature from the code is not the same as removing it from the deployment.

## Apps from one workflow

An installable app was the natural next step: it works offline in an examination hall, and an icon on a phone's home screen is easier to find than a bookmark. Because Toc-Suite has no build step, the same files can be wrapped in three ways, and one GitHub Actions workflow now does all of it whenever a release is made: an Electron app for Windows (an installer and a portable `.exe`) and Linux (an AppImage), a Capacitor app for Android (a signed `.apk`), and a small nginx container published to GitHub Packages. The workflow runs the full test suite first, writes the release notes from the changelog, and attaches every file to the GitHub release.

![The release workflow. One script stages the web app; each platform wraps the same files.](../figures/release-pipeline.png)

Two details mattered. The desktop app serves the files over its own `app://` protocol rather than from disk, because ES modules and the service worker behave differently on `file://` URLs. The Android app calls the live site's functions for assignment submission, which needed CORS headers on those functions. And one bug was nearly invisible: the staging script computed the repository's path in a way that works on Linux but produced `/D:/a/…` on the Windows runner, so it silently copied *nothing*, and the first Windows build most likely packaged an empty app. The build "succeeded" all the same. It was found only when a later change made the script read a file it expected to have copied. The script now fails loudly if anything is missing, and the version was re-released with the tag moved to the fixed build.

## A launch screen

A native app opens differently from a web page: there is a moment between tapping the icon and seeing the app, and an empty white window in that moment feels broken. The apps therefore open on a dark launch screen and play a short intro: a warp-speed starfield, glowing cyan and purple rings tilted in 3D like an automaton's states on an orbit, the app icon rising out of them, and the title. It lasts about three seconds, any tap or key skips it, and with reduced motion it becomes a half-second fade. On the home screen the studio buttons tilt slightly under the pointer. All of this is injected only into the app builds by the staging script; the website, which students open in a hurry between classes, stays plain.

![The launch intro of the Windows and Android apps.](../media/app-intro.png){.screenshot}
