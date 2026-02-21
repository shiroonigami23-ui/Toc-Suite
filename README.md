# Toc-Suite

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
- Regex bridge to FA studio (via current regex converter capability)
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
- `library.json`
- `pda_library.json`
- `moore_mealy_library.json`
- `tm_library.json`
- `CHANGELOG.md`
- `PREVIEW.md`

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

- Current regex converter is intentionally limited (single-symbol and `ab` demo path).
- Full regex parser (union/concat/star with nested parentheses) can be added as next upgrade.
- Some advanced policy/admin UX can still be expanded in architect portal.

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
