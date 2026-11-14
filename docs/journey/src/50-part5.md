# Part V — Reflection {.part}

What the project taught me, what it amounts to, and where it goes next.

# 20. Struggles and lessons

## Building faster than I could check

The clearest lesson of the whole project is visible in the audit numbers. In January I could build a working studio in a day; I could not, in that same day, verify the thirty practice answers that came with it. The answers I wrote were tested the way I had always tested my homework, on a few strings that matched my mental picture of the language. That method fails in a predictable way, because the strings that expose a wrong automaton are exactly the strings outside that mental picture.

The lesson is not "test more". It is to test differently: against an independent definition, over *all* inputs up to a bound, automatically, every time. A twenty-line brute-force predicate written by hand is a better reference than any automaton drawn by hand, because it is too simple to be wrong in the same way.

## Working against the semester

Toc-Suite was built in the gaps between classes, assignments and examinations. The January burst happened because there was a short window before the semester resumed; February's classroom features were added in a few long days when the course needed them; and there is a gap of almost eight months between March and November when I had no time for the project at all. That rhythm shaped the code. Features arrived in large, quick batches, and the slower work (tests, documentation, reorganisation) was always the work that was postponed.

If I were starting again I would put the slow work first. A test suite written in January would have caught the PDA answers before a single student saw them. A folder structure decided on the first day would have cost an hour then instead of a careful scripted migration ten months later.

## Learning the tools while using them

Many of the struggles in the history were not about Theory of Computation at all. They were about learning GitHub Actions while depending on them, learning Netlify Functions while students were submitting work through them, and learning how browsers treat ES modules, relative paths, service workers and local storage. The renamed-back-and-forth files of 5 January are a record of learning in public. I do not regret that: there is no better way to learn a tool than to need it to work. But I now separate experiments from the main branch, and the repository history since November reads as a sequence of deliberate changes rather than a sequence of attempts.

## Precision and judgement

The Automata Assistant taught me a lesson about where to use learning and where not to. A model is good at deciding *what kind* of condition a sentence describes, which is a fuzzy, linguistic judgement. It is a poor choice for producing the automaton itself, which must be exactly right. Splitting the problem along that line, with a small model for the judgement and exact constructions for the result, gave an assistant that is both flexible and trustworthy, and that can be checked by the same brute-force tests as everything else. I expect to reuse that pattern well beyond this project.

## Students as users

Finally, the project taught me what it means to have users. Classmates found bugs I would never have found, asked for features I would never have thought of (guided mode came directly from a friend's request to "let me draw it myself but tell me when I go wrong"), and used the tool in ways I had not imagined, mostly on phones and often in a hurry before a test. Every design decision since February has been tested against the question "would this confuse someone using it for the first time, on a phone, the night before an exam?"

# 21. Principles I now follow

The lessons of the previous chapter are easier to apply as a short list of working rules. These are the rules I now follow on Toc-Suite and on my other projects.

**1. Every answer needs an independent witness.** A reference answer, a conversion or a generated machine is not trusted until something written independently agrees with it: a brute-force predicate, a second implementation, or an exact equivalence check. Two implementations by the same person in the same style are not independent.

**2. Prefer exhaustive checks over clever examples.** For anything with a small input space, check every input up to a bound. It is simpler to write than a careful list of edge cases, it finds the edge cases you did not think of, and it runs in seconds.

**3. Learn only what must be learned.** Use a model for judgement (which kind of condition does this sentence describe?) and exact algorithms for everything that must be right (the automaton itself). Keep the learned part small, reproducible and visible to the user.

**4. Show the evidence, not just the verdict.** "Incorrect" teaches nothing. "Your machine accepts `aab`, but it should not" teaches the student where to look. Every checker in the application now reports a concrete string, a concrete state or a concrete count.

**5. Decide the structure before the second file.** Folder structure, file format and naming conventions are cheap to decide on day one and expensive to change on day three hundred.

**6. Design for the smallest screen first.** If it works on a phone held in one hand, it will work on a laptop. The reverse is not true.

**7. Automation must be idempotent and must not fight people.** A workflow that edits the repository must produce the same result when run twice, must not trigger itself, and must never overwrite a human's change.

**8. Never let an animation hold the user's work hostage.** Animations must be fast by default, cancellable or serialised, respectful of reduced-motion settings, and never the only way to see a result.

**9. Be explicit about data.** Every piece of information that leaves the student's device should be named, justified and switchable where possible, and the policy page should say so in plain language.

**10. Write it down.** This book exists because I could no longer remember why some things were built the way they were. Writing the reasons down while they are fresh is cheaper than reconstructing them from a commit history.

# 22. The project in numbers

| Measure | January 2026 | November 2026 |
|---|---|---|
| Studios | FA, Mealy/Moore, PDA, TM | + Grammar Studio, Automata Assistant |
| Application JavaScript (excluding practice data and tests) | about 10,600 lines | about 16,200 lines in 64 modules |
| Verification engine (`src/core`) | none | about 1,560 lines |
| Test suite | none | 45 test groups, about 880 lines |
| FA practice | 120 construction questions, 20 wrong | 120 verified + 159 conversion exercises |
| Mealy/Moore practice | 14, 4 wrong | 21 verified, plus Moore ↔ Mealy conversion practice |
| PDA practice | 33, 28 wrong | 33 verified |
| TM practice | 20, 8 wrong | 20 verified (final tape checked) |
| How answers are checked | sample strings | exact equivalence (FA), exhaustive short strings (MM, PDA, TM) |
| First-load download (uncompressed) | about 1.4 MB | about 0.64 MB |
| Files in the repository root | more than 90 | 15 |

![Practice exercises available after November 2026.](../figures/chart-practice.png)

| Period | Commits (by me) | Main work |
|---|---|---|
| 4–7 January 2026 | about 110 | Initial build, five studios, library pipeline, functions |
| 21–26 February 2026 | about 20 | Grammar Studio, routing, assignments, portal, help, settings |
| 20 March 2026 | 1 | Grammar Studio mobile accessibility |
| 14 November 2026 | 9 | Assistant, audit, engine, reorganisation, responsive layout, performance, policies, documentation |

# 23. Where next

The roadmap file in the repository lists the next steps in detail. The most important are these.

**More of the syllabus.** The Grammar Studio should gain CYK parsing, conversion to Chomsky normal form, and LL(1) parsing tables, all of which are mechanical procedures that benefit from the same step-by-step animation as the subset construction. The TM studio should gain a library of reductions for the undecidability unit.

**The assistant beyond finite automata.** Guided mode currently works for finite automata, where equivalence is decidable. For pushdown automata and Turing machines, the same idea can work with bounded checking: the assistant can compare a drawing with a reference on every short string and explain the first difference. Describing a context-free language in English and receiving a PDA is harder, but the same split between a classifier for the *kind* of language and exact constructions for the machine should carry over to the common textbook families.

**Larger and better practice banks.** The Mealy/Moore bank is still small. Every bank would benefit from questions contributed by students, which the library pipeline already makes possible; what is missing is a review step that runs the same verification tests on contributed answers before they are published.

**Offline use.** The application is a progressive web app in name, but it currently caches only the shell. Caching the studios and practice banks would make it usable without a connection, which matters in examination halls and on unreliable college Wi-Fi.

**Languages.** Many students would find the help pages and the assistant's explanations easier in Hindi. The assistant's reader is also English-only; a second trained classifier for Hindi descriptions is a natural extension of the same design.

**A second audit.** Finally, I intend to repeat the November exercise periodically. The most valuable thing the project gained this year was not a feature but a habit: no answer is trusted until something independent has checked it.

# Appendix A — Timeline {.unnumbered}

| Date | Event |
|---|---|
| October 2025 | Reference screenshot of a mobile automata app saved; earlier prototypes |
| 4–5 January 2026 | Initial build of the unified studio; library pipeline; dozens of iterations on the GitHub Actions |
| 6–7 January 2026 | Netlify Functions for submissions and library pushes; templates; TM and Mealy/Moore library examples |
| 21 February 2026 | Grammar Studio; smart cross-studio routing; assignments and verified submissions; help guide; settings |
| 26 February 2026 | Grammar–machine bridge polish; dedicated review page for the instructor portal; PDA export |
| 20 March 2026 | Grammar Studio mobile sidebar accessibility fix |
| 14 November 2026 | Automata Assistant; verification engine and audit; practice banks rebuilt; conversion practice; repository reorganisation; responsive layout; keyboard shortcuts; animation and file-handling fixes; performance; settings and policies; documentation |

# Appendix B — Repository map {.unnumbered}

| Path | Contents |
|---|---|
| `index.html` | Splash screen and studio shell |
| `src/app/` | Shell: routing, studio loading, autosave snapshots |
| `src/fa/`, `src/mm/`, `src/pda/`, `src/tm/` | One folder per studio: state, renderer, UI, simulation, files, practice, library |
| `src/grammar/` | Grammar Studio logic and the regular-expression converter |
| `src/core/` | Verification engine, regular expressions, RPNI, layout, diagnosis, English reader and its model |
| `src/assistant/` | The Automata Assistant panel |
| `src/shared/` | Utilities, animation timing, keyboard shortcuts, paths, assignment client |
| `data/practice/` | Practice banks for every studio |
| `data/libraries/` | Library files built by CI |
| `data/automata/`, `data/inbox/` | Library sources and incoming submissions |
| `pages/` | Grammar Studio, help, settings, policies, instructor portal |
| `assets/` | Style sheet, icons, vendored icon subset |
| `netlify/functions/` | Server-side functions |
| `tests/` | Unit, differential and data-audit tests |
| `tools/` | Model training, practice-bank builders, icon builder, documentation builders |
| `docs/` | This book, the study guide, the technical guide, figures and screenshots |

# Appendix C — Glossary {.unnumbered}

**Accepting state.** A state in which a finite automaton or PDA accepts if the input has been consumed.

**Counterexample.** A string accepted by one of two automata and rejected by the other; the shortest one is the most useful feedback.

**Differential test.** A test that runs two independent implementations on the same random inputs and fails if they disagree.

**ε-closure.** The set of states reachable from a state using only ε-transitions.

**Equivalence.** Two automata are equivalent if they accept exactly the same strings.

**Guided mode.** The Automata Assistant mode in which the student draws and the assistant explains mistakes without revealing the answer.

**Minimal DFA.** The DFA with the fewest states for a given regular language; it is unique up to renaming of states.

**Product construction.** Running two automata in parallel on the same input, used for intersection, union and comparison.

**RPNI.** Regular Positive and Negative Inference, a state-merging algorithm for learning a DFA from labelled examples.

**Studio.** One of the application's workspaces: FA, Mealy/Moore, PDA, TM or Grammar.

**Subset construction.** The conversion of an NFA into a DFA whose states are sets of NFA states.

**Trap state.** A non-accepting state with no way out, used to make a DFA total.
