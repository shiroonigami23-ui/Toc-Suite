## [2026-11-14] - Restructure, responsive, verified practice everywhere, documentation
### Added
- FA conversion practice: 159 exercises (ε-NFA → NFA, NFA → DFA, DFA → minimal DFA, NFA → minimal DFA); the machine to convert is drawn for you and the checker verifies language *and* shape.
- Mealy/Moore conversion practice (Moore → Mealy, Mealy → Moore) and 7 new verified Mealy/Moore problems.
- Keyboard shortcut sheet (`?`), shared shortcuts in every studio (R rename, P properties, +/−/0 zoom, Shift+Delete clear).
- Animated TM run with live tape; live stack/tape panels open automatically on run.
- Settings: animation speed, share-saves switch, erase all local data; new privacy / terms / accessibility page.
- Server-side AI proxy (`ai-generate`); the Gemini key never reaches the browser.
- Documentation: 75-page journey book, study guide, technical guide, ROADMAP.md, generated figures, app screenshots and demo GIFs.
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