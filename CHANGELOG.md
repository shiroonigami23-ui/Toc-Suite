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