# Theory of Computation — study papers

A self-contained series covering the whole Theory of Computation syllabus, written for study and revision. Each paper is a standalone PDF with definitions, theorems with proofs, worked examples, common mistakes and exercises with answers. They are independent of the Toc-Suite app.

| # | Paper | Topics |
|---|---|---|
| 1 | [Mathematical Preliminaries](01-preliminaries.pdf) | sets, relations, countability, strings and languages, induction, pigeonhole, diagonalisation, asymptotics |
| 2 | [Finite Automata: DFA, NFA and ε-NFA](02-finite-automata.pdf) | formal definitions, design by invariants, subset construction, ε-closure, product automata, closure and decision properties |
| 3 | [Regular Expressions and Regular Languages](03-regular-languages.pdf) | Kleene's theorem, Thompson / state elimination, Arden's lemma, pumping lemma, Myhill–Nerode, minimisation, regular grammars |
| 4 | [Finite-State Transducers: Mealy and Moore](04-transducers.pdf) | definitions, sequence detectors, serial arithmetic, Mealy ⇄ Moore, minimisation, limits of one-pass translation |
| 5 | [Context-Free Grammars](05-context-free-grammars.pdf) | derivations, parse trees, ambiguity, simplification, CNF/GNF, CYK, FIRST/FOLLOW/LL(1), closure, CFL pumping lemma, Chomsky hierarchy |
| 6 | [Pushdown Automata](06-pushdown-automata.pdf) | acceptance modes, design patterns, CFG ⇄ PDA, deterministic PDAs and DCFLs |
| 7 | [Turing Machines](07-turing-machines.pdf) | the standard model, programming techniques, variants and simulations, enumerators, LBAs, universal machines, Church–Turing thesis |
| 8 | [Decidability and Undecidability](08-decidability.pdf) | decidable problems, $A_{TM}$, halting, reductions, Rice's theorem, Post correspondence problem |
| 9 | [Computational Complexity](09-complexity.pdf) | P, NP, coNP, reductions, Cook–Levin, NP-complete problems, PSPACE, Savitch |
| 10 | [A Workbook of Solved Problems](10-solved-problems.pdf) | 40 exam-style problems with full solutions, and a "how to prove it" reference table |

Sources are the Markdown files next to the PDFs; figures are Graphviz files in `figures/`. Rebuild with `python3 tools/docs/build_docs.py papers` (needs pandoc, Graphviz and Playwright's Chromium).

Further reading: M. Sipser, *Introduction to the Theory of Computation* (3rd ed.); J. E. Hopcroft, R. Motwani and J. D. Ullman, *Introduction to Automata Theory, Languages, and Computation* (3rd ed.); D. Kozen, *Automata and Computability*.
