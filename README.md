<p align="center">
  <img src="icon-512.png" alt="Toc-Suite Logo" width="110">
</p>

# Toc-Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg?style=flat-square)](LICENSE)
[![Library Build](https://img.shields.io/github/actions/workflow/status/shiroonigami23-ui/Toc-Suite/build-library.yml?label=Library%20Build&style=flat-square)](https://github.com/shiroonigami23-ui/Toc-Suite/actions/workflows/build-library.yml)
[![Netlify Status](https://img.shields.io/badge/Deploy-Netlify-00c7b7?style=flat-square)](https://toc-suite-v3.netlify.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Toc--Suite-111827?style=flat-square)](https://github.com/shiroonigami23-ui/Toc-Suite)

Links:
- Live App: https://toc-suite-v3.netlify.app/
- GitHub Repository: https://github.com/shiroonigami23-ui/Toc-Suite
- Issues and Tracking: https://github.com/shiroonigami23-ui/Toc-Suite/issues

Unified Theory of Computation workspace for:
- Finite Automata (FA: DFA/NFA/e-NFA + conversions)
- Mealy/Moore Machines
- Pushdown Automata (PDA)
- Turing Machines (TM, multi-tape, NTM, LBA, block templates)
- Grammar Studio (CFG validation, parse tree, derivation timeline, CFG -> NPDA bridge)

This project combines:
- interactive student-facing studios
- a help/theory lab
- a settings/profile system
- assignment/quiz submission flow backed by Netlify Functions + Postgres (Neon)
- architect/admin review and selective GitHub push pipeline

## 0) Recent Enhancements (Current Build)

- Grammar Studio now includes dedicated RL and REL conversion tabs (separate, not merged).
- RL and REL panels now render dynamic transition tables with animated step cards.
- `Open RL in FA` now performs real conversion and opens FA with imported machine data.
- `Open REL in TM` now opens TM with generated TM transition/state data (not only prompt text).
- FA/MM/TM route boot now auto-opens studio directly (splash bypass on routed launch, same feel as PDA).
- Action logs were expanded across FA, MM, and PDA to match TM-level descriptive tracing.
- Architect portal UI upgraded with collapsible sections and advanced dropdown filters for review queue.

## 1) Current App Surfaces

- `index.html`: splash + FA/MM/PDA/TM studio entry and routing
- `splash_help.html`: dynamic help/theory lab (accordion sections, progress state)
- `splash_settings.html`: compact settings center (accordion panels, presets, profile/auth)
- `grammar_studio.html`: dedicated grammar workspace
- `architect-portal-2026.html`: architect moderation/review interface

## 2) Local Development

Do not run this app via `file://` URL. Use a local HTTP server.

### Recommended
```bash
npx serve . -l 5173
```

Then open:
```text
http://localhost:5173
```

## 3) Core Features

### 3.1 Multi-studio workflow
- Splash routes to FA/MM/PDA/TM/Grammar.
- Route persistence via hash + session.
- Back to menu behavior across studios.

### 3.2 Smart cross-studio JSON import
Imports are auto-detected and rerouted to the correct studio:
- FA JSON -> FA studio
- MM JSON -> Mealy/Moore studio
- PDA JSON -> PDA studio
- TM JSON -> TM studio
- Grammar JSON -> Grammar studio

After reroute, pending import is consumed and animated draw is executed in destination studio.

Primary router file:
- `machine_router.js`

### 3.3 Grammar Studio
- CFG parser/validator
- Conversion steps animation
- NPDA JSON generation and bridge to PDA studio
- Parse tree render
- Leftmost derivation + derivation timeline
- Grammar/NPDA logic-table view
- RL conversion designer tab (dynamic transition table + animated conversion steps)
- REL conversion designer tab (dynamic TM-style table + animated conversion steps)
- Regex bridge to FA studio with parser support for union, concat, star, parentheses, and epsilon tokens
- Cross-open flows:
  - RL -> FA (machine import)
  - RL -> Mealy/Moore (prompt handoff)
  - REL -> TM (machine import + prompt handoff)
- Context-free pumping lemma helper

Main files:
- `grammar_studio.html`
- `grammar_main.js`
- `regex-converter.js`

### 3.4 TM advanced modes
- `STANDARD`
- `MULTI_TAPE`
- `STAY_OPTION`
- `NON_DET`
- `LBA`
- Block templates:
  - `COPY_BLOCK`
  - `INCREMENT_BLOCK`
  - `PAL_CHECK_BLOCK`

Template loading is animated and mode-aware.

Main files:
- `tm_studio.html`
- `tm_modes.js`
- `tm_simulation.js`
- `tm_ui.js`
- `tm_validator.js`

### 3.5 Help and settings
- Help is accordion-based and stateful (only opened sections show content)
- Tool guide upgraded with interactive studio playbooks
- Settings compacted with accordion panels, quick status, presets, sticky save bar

Main files:
- `splash_help.html`
- `splash_settings.html`

### 3.6 Architect Portal (admin moderation)
- Collapsible operational panels for cleaner top-level navigation.
- Rich review queue filters:
  - mode
  - assignment
  - machine type
  - repo policy (repo-eligible vs DB-only)
  - integrity flag (flagged vs clean)
- Persistent panel open/closed state via local storage.
- CSV export for filtered rows.
- Assignment creation and active-assignment hints remain function-backed.

Main file:
- `architect-portal-2026.html`

## 4) Assignment / Quiz / Submission Pipeline

### 4.1 Student-side submission behavior
- Student can use studios without login.
- Assignment/quiz submission prompts for valid `@rjit.ac.in` email.
- Roll identity derived from email local-part format.
- Fingerprint + identity checks are applied server-side for protected flows.

Main client bridge:
- `assignment-client.js`

### 4.2 Netlify Functions
Under `netlify/functions`:
- `save-to-db.js`: stores submissions + enforces policy
- `list-active-assignments.js`: fetches active assignments by machine type
- `create-assignment.js`: architect creates assignments
- `get-submissions.js`: architect fetches pending/reviewable items
- `save-review.js`: save grading/feedback/review state
- `push-to-github.js`: push repo-eligible approved item to `Data/`
- `push-to-github-bulk.js`: bulk push flow
- `verify-ai-password.js`: AI access password check

### 4.3 Repo push gating
Only repo-eligible submissions (hard/special category flows) should be pushed to GitHub.
Regular student submissions remain DB-side and are not direct repo writes.

## 5) Deploy-loop Protection (Netlify Free-tier safety)

`netlify.toml` uses an `ignore` script to skip deploys when only data/library sync files changed, including:
- `Data/`
- `automata/`
- `submissions/`
- `archives/`
- `library.json`
- `pda_library.json`
- `moore_mealy_library.json`
- `tm_library.json`
- `CHANGELOG.md`
- `PREVIEW.md`
- `README.md`

This prevents unnecessary redeploy cycles from data-only updates.

## 6) GitHub Workflows

Located in `.github/workflows`:
- `build-library.yml`
- `auto_repair.yml`
- `generate_preview.yml`
- `update_changelog.yml`

These handle aggregation, consistency, preview/changelog updates, and repair tasks.

## 7) Environment Variables

Configured in Netlify project environment variables (never hardcode secrets in source).

Used by current function code:
- `DATABASE_URL`
- `ARCHITECT_KEY`
- `GITHUB_PAT`
- `GITHUB_REPO`
- `AI_ACCESS_PASSWORD`

## 8) Security and Secret Handling

- Do not commit real secrets to git.
- Keep PATs/DB URLs/architect keys only in Netlify environment variables.
- Rotate any exposed secrets immediately.
- Keep `.env` files outside tracked repo paths.

## 9) Project Structure (high-level)

- `automata/`: machine JSON source trees
- `Data/`: ingestion/drop zone for repo-eligible pushes
- `netlify/functions/`: backend API handlers
- studio modules:
  - FA: `ui.js`, `state.js`, `renderer.js`, `file.js`, ...
  - MM: `moore_mealy_*.js`
  - PDA: `pda_*.js`
  - TM: `tm_*.js`
  - Grammar: `grammar_main.js`, `grammar_studio.html`

## 10) Performance Notes

- Serve app over HTTP for module loading and service worker behavior.
- Large logic tables and animated renders are intentionally incremental.
- Drawer/collapsible panels are used for mobile and compact screens.
- Route persistence avoids forcing users back to splash after refresh.

## 11) Known Limitations

- Regex parser handles core operators (union/concat/star/parentheses/epsilon), but this is still not a full industrial regex engine.
- Conversion output quality for REL -> TM is heuristic and intended for editable starting machines.
- Additional policy dashboards (audit analytics, reviewer SLA widgets, role-bound approval workflows) can still be expanded in architect portal.

## 12) Quick Start Checklist

1. Start local server:
```bash
npx serve . -l 5173
```
2. Open `http://localhost:5173`
3. Verify studio routing from splash
4. Import JSON from one studio and confirm smart auto-reroute
5. Verify settings + help persistence
6. Verify assignment/quiz flow with function-backed endpoints

## 13) License

MIT - see `LICENSE`.

---

Maintained by project architect and contributors for TOC learning and structured machine design workflows.
