## [2.0.0] - 2026-11-15 - Automata Builder, Grammar Studio, apps and study papers
### Added
- **Automata Builder** in every studio (press `B`): describe a DFA, NFA, ε-NFA, Moore or Mealy machine, PDA or Turing machine in words or notation; it chooses the machine type (explicit request, otherwise the current studio and mode), switches studio when needed, and draws the machine only after verifying it.
  - Readers for exponent notation and English (`{aⁿb²ⁿ | n ≥ 1}`, `n a's followed by n b's`, `#a(w) = 2#b(w)`, palindromes, `ww`, `w#w`, brackets, `a^(2^n)`, arithmetic tasks).
  - A general counter-PDA compiler (linear-set equations → signed stack counters, nested and sequential counters, unions), Turing-machine phases and classic sweeps, Moore/Mealy machines from output conditions, remainders and transducer tasks, Glushkov and Thompson automata with state merging.
  - Non-regular requests for a finite automaton become PDAs, non-context-free requests become Turing machines, always with the reason; impossible requests are refused instead of drawn wrong.
- **Grammar Studio rebuilt**: exact parse trees and ambiguity witnesses for any CFG, leftmost/rightmost derivations, simplification and Chomsky normal form step by step, CYK table, FIRST/FOLLOW and the LL(1) table, CFG → PDA, right/left-linear grammar → NFA, regex → ε-NFA/DFA, an exhaustive pumping-lemma checker, Chomsky-type classification, example grammars, and a navigation bar to every studio.
- **Apps and packages**: GitHub Actions release workflow building a Windows installer and portable `.exe` (Electron), an Android `.apk` (Capacitor), a Linux AppImage, and a Docker image on GitHub Packages.
- **Study papers**: ten standalone Theory of Computation papers (preliminaries, finite automata, regular languages, transducers, grammars, PDAs, Turing machines, decidability, complexity) and a 40-problem solved workbook, in `docs/papers/`.
- **Animated launch intro in the Windows and Android apps**: a 3D neon orbit with the app icon rising out of it, a warp-speed starfield and the title, about 3 seconds, tap or any key to skip, a short fade with reduced motion; dark launch screen on Android and a dark window on Windows. Studio buttons on the home screen tilt in 3D under the pointer. The website is unchanged.
- **Help page rebuilt**: quick start, Builder and Assistant guide with examples, studio playbooks, a keyboard-shortcut sheet, the ten study papers, app downloads, and the existing theory labs, practice and quiz under a searchable section.
- **Settings page rebuilt**: changes save instantly (no floating save bar), theme cards, text-size, motion and drawing-speed toggles with a live preview, presets including Presenting, sign-in and sign-out of the assignment identity, settings export and import, storage usage, and an About card with the version and download links.
- Concept trailer in the README.
- Tests: `builder.test.mjs` (phrasings run on the studios' own simulators) and `cfg.test.mjs`.
### Fixed
- Home from the Grammar Studio reopened the Grammar Studio (the last-route memory sent it back); Home now always shows the home screen.
- Mealy/Moore drawings were animated with the FA renderer (labels without outputs, a console error at the end).
- The PDA simulator pruned configurations whose final stack was taller than the remaining input, rejecting e.g. `aaaa` for `{aⁱbʲ | i > j}`.
- Netlify deploys: removed AI variables no longer trip secret scanning; the live URL is now `toc-suite.netlify.app`.
### Removed
- The old Grammar Studio regex converter and placeholder RL/REL "plans" (replaced by the real conversions above).

## [2026-11-14] - Restructure, responsive, verified practice everywhere, documentation
### Added
- FA conversion practice: 159 exercises (ε-NFA → NFA, NFA → DFA, DFA → minimal DFA, NFA → minimal DFA); the machine to convert is drawn for you and the checker verifies language *and* shape.
- Mealy/Moore conversion practice (Moore → Mealy, Mealy → Moore) and 7 new verified Mealy/Moore problems.
- Keyboard shortcut sheet (`?`), shared shortcuts in every studio (R rename, P properties, +/−/0 zoom, Shift+Delete clear).
- Animated TM run with live tape; live stack/tape panels open automatically on run.
- Settings: animation speed, share-saves switch, erase all local data; new privacy / terms / accessibility page.
- Documentation: 75-page journey book, study guide, technical guide, ROADMAP.md, generated figures, app screenshots and demo GIFs.
### Removed
- The unused AI generator (password modal, image/text import, `ai-auth.js`, `verify-ai-password` and `ai-generate` functions). No UI reached it any more.
### Changed
- Repository reorganised into `src/`, `data/`, `pages/`, `assets/`, `docs/`, `tests/`, `tools/`; old URLs redirect (netlify.toml + 404.html).
- Icons served from a 20 KB local subset instead of the 487 KB CDN bundle; PDA/TM banks and the NL model load lazily (first load 1.4 MB → 0.64 MB).
- All animations share one timing source and respect reduced motion; machine drawing takes ≤ ~2.5 s regardless of size and is serialised.
### Fixed
- Phones: canvas no longer shrinks to unreadable size, zoom control no longer covers the canvas, Grammar Studio drawer no longer leaves an empty band, empty status boxes hidden.
- Esc no longer clears the canvas; FA toolbar icons no longer stay blank.
- Mealy/Moore save did nothing; PDA/TM save and PNG export needed two clicks; shared dialogs kept handlers from previously opened studios (double or wrong saves).
- Converting a machine while it was still being drawn produced a corrupted result.
- PDA undo button stayed disabled; state-role counts showed 0 after loading.
- Non-regular "prime length" NFA question replaced by a bounded regular version; ambiguous PDA union question made precise.
- File names are safe on every OS.

## [2026-11-14] - Automata Assistant + full audit
### Added
- Automata Assistant panel (FA studio): English/regex → minimal DFA, guided drawing mode with live mistake hints, learn a DFA from examples (RPNI), tidy auto-layout.
- `core/` pure engine: determinize, minimize, product constructions, equivalence with shortest counterexample, regex → DFA, diagnosis; in-browser intent classifier `core/nl-model.json` with reproducible trainer.
- Test suite (`npm test`) and a Tests workflow, including differential tests of the legacy simulators and audits of every practice bank and library.
### Fixed
- 20 FA, 28 PDA, 8 TM and 4 Mealy/Moore practice solutions that accepted the wrong language or produced the wrong output.
- TM library machines (used `direction`, never moved); PDA/FA library machines that accepted extra strings.
- PDA simulator: visited-set search, ε-loop pruning, multi-path correctness; checker now tests all short strings over the problem alphabet.
- TM checker compares final tapes and uses the problem's own alphabet; validator-legal moves only.
- Mealy→Moore conversion (missing start state, prefix-matching bug); exact Mealy/Moore equivalence; multi-character input symbols.
- NFA→DFA stray `{}` state; FA equivalence with different alphabets; regex `+` as union; practice-bank typos (`transition` key, missing trap states).

## [2026-02-21] - Data Ingestion
- Imported **DFA Smoke: Even number of a** into DFA Library
- Imported **PDA Smoke: a^n b^n** into PDA Library

## [2026-01-04] - Data Ingestion
- Imported **NFA for strings containing 'aba'** into NFA Library

# 🕒 Project Changelog
All notable changes to the Automata Practice Studio will be documented in this file.

## [Initial Release] - 2026-01-05
### Added
- Core FA, MM, PDA, and TM Studio modules.
- Machine Intelligence suite with real-time logic highlighting.
- Automated library build and sorting pipeline.
- MIT License protection.