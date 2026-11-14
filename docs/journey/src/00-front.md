---
title: "Toc-Suite: The Journey"
subtitle: "How a study tool for Theory of Computation grew from a semester problem into a verified, assistant-driven automata workbench — and shipped as version 2.0.0 on the web, Windows and Android"
author: "Aryan Singh Chandel"
affiliation: "B.Tech Computer Science and Engineering, Rustamji Institute of Technology, Gwalior"
date: "November 2026 · updated for v2.0.0"
kicker: "Toc-Suite · Project Journey"
repo: "github.com/shiroonigami23-ui/Toc-Suite · toc-suite.netlify.app"
cover: "../media/builder-tm.png"
---

# Preface {.unnumbered}

This document records how Toc-Suite came to exist, how it was built, what went wrong along the way, and what it has become. It is written for three kinds of reader. The first is a student who uses the tool and wants to know why it behaves the way it does. The second is a developer who might extend it and needs to understand the decisions behind the code. The third is me, a year or two from now, when I have forgotten why a particular folder exists or why a test checks every string up to length seven.

Toc-Suite is a browser-based workbench for Theory of Computation. It lets a student draw and simulate deterministic and non-deterministic finite automata, ε-NFAs, Mealy and Moore machines, pushdown automata and Turing machines; convert between them step by step; work with context-free grammars; practise against several hundred exercises whose answers are checked by the computer rather than by eye; and, since November 2026, describe a language in plain English and either have the automaton built or be guided while drawing it. It runs entirely in the browser, has no build step, and is deployed as a static site with a few serverless functions for classroom features.

The project has had four distinct phases. In January 2026 I built the core studios in an intense week, most of it visible in the repository history as a burst of more than a hundred commits across four days. In February and March I added the features that turned a personal tool into something a class could use: assignments, quizzes, an instructor portal and a Grammar Studio. In November 2026 I returned to the project, audited every part of it, and found that a large fraction of the stored practice answers were wrong, that several conversions had subtle bugs, and that the code had grown into a flat directory of more than ninety files. That third phase produced the verification engine, the Automata Assistant, a reorganised codebase, and the test suite that now guards all of it. The fourth phase followed the very next day and became version 2.0.0: an Automata Builder that turns a description into a verified machine of *any* type in the right studio, a Grammar Studio rebuilt on an exact engine, the assistant in every studio, a set of ten study papers, rebuilt help and settings pages, and native apps for Windows and Android with their own animated launch screen.

I have tried to be honest about the struggles as well as the results. Some of the most useful lessons came from mistakes: building features faster than I could check them, trusting answers because they looked right, and letting the structure of the repository drift because every individual change seemed small. The chapters on the audit are, in a sense, the centre of the book, because they explain why the later work looks the way it does.

## How this document is organised {.unnumbered}

Part I explains the motivation and gives a short map of the theory, so that the rest of the book can refer to it. Part II covers the January build of the five studios and the library pipeline. Part III covers the classroom features added in February and March. Part IV covers the November audit, the verification engine, the Automata Assistant and the restructuring. Part V covers version 2.0.0: the Automata Builder, the rebuilt Grammar Studio, the assistant in every studio, the study papers, and shipping the apps. Part VI reflects on the process, summarises the project in numbers, and sets out where it goes next. The appendices contain a dated timeline, a map of the repository and a glossary.

Two companion documents accompany this one. The *Toc-Suite Study Guide* explains the theory itself with worked examples that can be reproduced in the app. The *Toc-Suite Technical Guide* documents the architecture, modules and data formats for anyone who wants to modify the code. The ten study papers in `docs/papers/` cover the syllabus itself, independently of the app. The repository's `ROADMAP.md` gives a shorter, step-by-step version of the development path described here.

<div class="pagebreak"></div>
