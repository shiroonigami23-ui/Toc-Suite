<p align="center">
  <img src="icon-512.png" alt="Toc-Suite Logo" width="120">
</p>

# 🌌 Toc-Suite: Unified Automata Studio
**ARCHITECT: [Shiro](https://github.com/shiroonigami23-ui)**

[![GitHub License](https://img.shields.io/github/license/shiroonigami23-ui/Toc-Suite?style=flat-square&color=6366f1)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/shiroonigami23-ui/Toc-Suite/build-library.yml?style=flat-square&label=Library%20Build)](https://github.com/shiroonigami23-ui/Toc-Suite/actions)
[![Deploy Status](https://img.shields.io/badge/Live-Web%20App-10b981?style=flat-square)](https://shiroonigami23-ui.github.io/Toc-Suite/)

**[🚀 Launch Unified Studio](https://shiroonigami23-ui.github.io/Toc-Suite/)**

A mathematically precise environment for constructing and simulating Finite Automata (DFA/NFA/ε-NFA), Pushdown Automata, Mealy/Moore Machines, and Turing Machines.

---

### 📊 Library Metrics
| Studio | Machine Count | Status |
| :--- | :---: | :--- |
| Finite Automata | **0** | Ready |
| Pushdown Automata | **0** | Ready |
| Mealy/Moore | **0** | Ready |
| Turing Machines | **0** | Ready |
---

## 🛠 Project Architecture

The **Toc-Suite** uses a "Source of Truth" pipeline. The web app consumes aggregated libraries, while the GitHub Actions manage data integrity and sorting.

### 📁 Directory Map
* **`/automata`**: Permanent source storage for individual machines.
* **`/Data`**: Ingestion folder for new machine uploads.
* **`library.json` (Root)**: Aggregated data generated automatically by CI/CD.

### 🤖 Automation Suite
- **Auto-Sorting**: Routes `.json` files to correct subfolders based on machine type.
- **Structural Validation**: Ensures transitions point to existing states.
- **Changelog Logic**: Automatically logs machine imports.
- **Metric Sync**: Updates the table above in real-time.

---

## 📝 Governance
- **📜 [License](./LICENSE)**: MIT.
- **🕒 [Changelog](./CHANGELOG.md)**: Full version history.

---
*Built with architectural precision and logic by Shiro.*
