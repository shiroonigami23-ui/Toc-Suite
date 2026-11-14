---
title: "Toc-Suite Study Guide"
subtitle: "Theory of Computation, from finite automata to Turing machines, with worked examples you can run in the app"
author: "Aryan Singh Chandel"
affiliation: "B.Tech Computer Science and Engineering, Rustamji Institute of Technology, Gwalior"
date: "November 2026"
kicker: "Toc-Suite · Study Guide"
repo: "Open any example at toc-suite.netlify.app"
cover: "../figures/subset-ends-abb.png"
---

# How to use this guide {.unnumbered}

This guide covers the Theory of Computation syllabus in the order most courses teach it: languages and finite automata, non-determinism and the conversions between machines, regular expressions and their limits, transducers, context-free grammars and pushdown automata, and Turing machines. Each chapter gives the definitions you need, works through at least one example completely, and ends with a short list of common mistakes.

Every diagram of an automaton in this guide was produced by Toc-Suite's own engine, so every one of them is correct by construction: the same code that checks your practice answers drew it. Wherever you see a **Try it** box, the example can be reproduced in the app in a minute or two, and doing so is the fastest way to make the idea stick.

::: {.callout .try data-title="Try it"}
Open the FA studio, expand **Automata Assistant**, type *strings over {a,b} that end with abb* and press **Build DFA**. You will get the machine in Figure 1. Then press **Guide me** instead, and draw it yourself: the assistant will tell you what is wrong after every change, without showing the answer.
:::

## Notation {.unnumbered}

| Symbol | Meaning |
|---|---|
| $\Sigma$ | an alphabet: a finite, non-empty set of symbols, such as $\{0, 1\}$ or $\{a, b\}$ |
| $\varepsilon$ | the empty string, of length 0 |
| $\lvert w \rvert$ | the length of string $w$ |
| $\lvert w \rvert_a$ | the number of occurrences of symbol $a$ in $w$ |
| $\Sigma^*$ | all strings over $\Sigma$, including $\varepsilon$ |
| $\Sigma^+$ | all non-empty strings over $\Sigma$ |
| $L(M)$ | the language accepted by machine $M$ |
| $\delta$ | a transition function |
| $q_0$, $F$ | the start state and the set of accepting (final) states |

In diagrams, the start state has an arrow coming in from nowhere, accepting states are drawn with a double circle (and shaded), and an arrow labelled `a, b` stands for two transitions, one on `a` and one on `b`.
