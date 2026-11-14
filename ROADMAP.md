# Toc-Suite Roadmap

How Toc-Suite was built, step by step, from the first prototype to today, and what comes next. Each stage lists what was built, why, and what it taught. The full story is in [`docs/journey/JOURNEY.pdf`](docs/journey/JOURNEY.pdf).

```
 Stage 0      Stage 1        Stage 2          Stage 3        Stage 4         Stage 5          Stage 6
 Prototypes → Shell + FA  → MM, PDA, TM   → Library CI  → Classroom    → Verification → Assistant, polish
 2025         Jan 2026      Jan 2026         Jan 2026       Feb–Mar 2026   Nov 2026        Nov 2026
```

## ✅ Stage 0 — Prototypes (2025)

| Step | What | Lesson |
|---|---|---|
| 0.1 | Single HTML file: add states, draw arrows, run a string through a DFA | Drawing automata well (self-loops, paired curved edges, arrowheads on the circle edge) is most of the work |
| 0.2 | One page per machine type | Machines differ in transitions but share everything else; duplicated code means every fix is made four times |
| 0.3 | Settle the JSON machine format and SVG rendering | Human-readable files that diff well in Git and can be written by hand |

## ✅ Stage 1 — The shell and the FA studio (January 2026)

| Step | What |
|---|---|
| 1.1 | `index.html` + `unified_main.js`: splash, hash routing (`#fa`, `#mm`, `#pda`, `#tm`), studio loader |
| 1.2 | Studio shape: `state` (MACHINE + undo/redo), `renderer`, `ui`, `simulation`, `file`, `practice` |
| 1.3 | FA tools: add, move, transition, rename, properties, delete; DFA/NFA/ε-NFA validation |
| 1.4 | Simulation with step highlighting and NFA active-set tracking; bulk testing |
| 1.5 | Animated conversions: ε-NFA → NFA, NFA → DFA, DFA minimisation |
| 1.6 | Save/load JSON, export PNG, autosave snapshots in local storage |
| 1.7 | FA practice bank: 120 questions over four levels |

## ✅ Stage 2 — The other studios (January 2026)

| Step | What |
|---|---|
| 2.1 | Mealy/Moore studio: outputs on states or transitions, I/O trace, Moore ↔ Mealy conversions |
| 2.2 | PDA studio: stack visualiser, NPDA breadth-first simulation, final-state / empty-stack / both acceptance |
| 2.3 | TM studio: tape visualiser, single-tape, multi-tape, non-deterministic, linear-bounded |
| 2.4 | Practice banks for each studio; logic tables with CSV export |

## ✅ Stage 3 — A library that maintains itself (January 2026)

| Step | What | Lesson |
|---|---|---|
| 3.1 | Inbox folder for incoming machines | — |
| 3.2 | `build-library.yml`: validate, detect type, sort, deduplicate, rebuild library files | Automation that edits its own repository must be idempotent, must not trigger itself, and must not overwrite people |
| 3.3 | Netlify Functions: save to Postgres, push to GitHub | — |
| 3.4 | Library panel in every studio | — |

## ✅ Stage 4 — For the class (February–March 2026)

| Step | What |
|---|---|
| 4.1 | Assignments and quizzes: create, list active, submit with college-email identity locked per session |
| 4.2 | Instructor portal and review page |
| 4.3 | Grammar Studio: CFG validation, animated CFG → NPDA, parse trees, derivations, RL/REL bridges, pumping-lemma planner |
| 4.4 | Smart cross-studio routing of machines |
| 4.5 | Interactive help guide; settings with presets; mobile drawer accessibility |

## ✅ Stage 5 — Verification (November 2026)

| Step | What | Result |
|---|---|---|
| 5.1 | Pure engine `src/core`: determinise, minimise, products, exact comparison with shortest counterexample, regex, ε-removal | Independent reference for everything |
| 5.2 | Differential tests of the January simulator and conversions | 2 conversion bugs, 1 equivalence bug fixed |
| 5.3 | Brute-force audit of every practice bank and library | Wrong answers rebuilt: FA 20/120, PDA 28/33, TM 8/20, Mealy/Moore 4/14 |
| 5.4 | Exact checkers: FA equivalence, Mealy/Moore lock-step search, PDA/TM exhaustive short inputs with tape comparison | Every wrong answer now comes with a proving string |
| 5.5 | Conversion practice (159 FA exercises) and Moore ↔ Mealy practice | Procedures can be practised, not just watched |
| 5.6 | `npm test` + Tests workflow | 45 test groups on every push |

## ✅ Stage 6 — Assistant and polish (November 2026)

| Step | What |
|---|---|
| 6.1 | Automata Assistant: English → DFA (trained classifier + exact constructions), examples → DFA (RPNI), guided mode with live mistake explanations, tidy layout |
| 6.2 | Repository reorganised into `src/`, `data/`, `pages/`, `assets/`, `docs/`, `tests/`, `tools/`, with redirects for old URLs |
| 6.3 | Every screen size: legible scrolling canvas on phones, compact zoom, fixed Grammar Studio drawer |
| 6.4 | Shared keyboard shortcuts with a `?` sheet; Escape no longer clears the canvas |
| 6.5 | Animation timing in one place; drawings serialised; animated TM run with live tape |
| 6.6 | Save, load, PNG and CSV export verified in every studio; shared-dialog handler leak fixed |
| 6.7 | Load time: icon subset (487 KB → 20 KB), lazy practice banks and model |
| 6.8 | Settings (animation speed, sharing switch, erase data) and a privacy / terms / accessibility page |
| 6.9 | Journey book, study guide, technical guide, screenshots and demo GIFs |

## ✅ Stage 7 — Builder, grammars and apps (November 2026)

| Step | What |
|---|---|
| 7.1 | Automata Builder in every studio: any machine type from words or notation, studio switching, verification before drawing |
| 7.2 | General counter-PDA compiler and Turing-machine phase compiler; Moore/Mealy from conditions and tasks |
| 7.3 | Grammar Studio rebuilt: exact parse trees and ambiguity, CNF, CYK, LL(1), CFG → PDA, pumping-lemma checker, studio navigation |
| 7.4 | Release workflow: Windows `.exe`, Android `.apk`, Linux AppImage, Docker image on GitHub Packages |
| 7.5 | Ten Theory of Computation study papers and a solved-problems workbook |

## 🔜 Stage 8 — Next

| Priority | Item |
|---|---|
| High | Offline mode: cache studios, practice banks and the model in the service worker |
| High | Builder: grammar output (describe a language, get a CFG) and step-by-step construction animations |
| High | Review step for student-contributed library machines (run the audit tests before publishing) |
| Medium | Guided mode for PDA and TM using bounded checking |
| Medium | Larger Mealy/Moore practice bank; PDA conversion exercises (CFG ↔ PDA) |
| Medium | Hindi interface and a Hindi description reader for the assistant |
| Medium | Reductions library for the undecidability unit |
| Low | Collaborative editing for study groups |
| Low | LMS export of assignment results |

## Principles carried forward

1. Every answer needs an independent witness.
2. Prefer exhaustive checks over clever examples.
3. Learn only what must be learned; build everything else exactly.
4. Show the evidence, not just the verdict.
5. Design for the smallest screen first.
