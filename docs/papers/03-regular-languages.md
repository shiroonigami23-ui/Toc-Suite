---
title: "Regular Expressions and the Structure of Regular Languages"
subtitle: "Kleene's theorem, algebraic laws, Arden's lemma, the pumping lemma, the Myhill–Nerode theorem and DFA minimisation"
author: "Aryan Singh Chandel"
affiliation: "B.Tech Computer Science and Engineering, Rustamji Institute of Technology, Gwalior"
date: "November 2026"
paper: true
kicker: "Theory of Computation · Paper 3 of 10"
---

# Introduction {.unnumbered}

Paper 2 defined regular languages through machines. This paper gives two other characterisations — regular expressions and the Myhill–Nerode theorem — and the tools to show that a language is *not* regular. It ends with the algorithm that turns any DFA into the unique smallest one.

# Regular expressions

**Definition 1.** The regular expressions over $\Sigma$ and the languages they denote are defined inductively:

| Expression | Language |
|---|---|
| $\emptyset$ | $\emptyset$ |
| $\varepsilon$ | $\{\varepsilon\}$ |
| $a$ (for $a \in \Sigma$) | $\{a\}$ |
| $R_1 + R_2$ (also written $R_1 \mid R_2$) | $L(R_1) \cup L(R_2)$ |
| $R_1 R_2$ | $L(R_1) L(R_2)$ |
| $R^*$ | $L(R)^*$ |

Precedence, highest first: star, concatenation, union. So $ab^* + c$ means $(a(b^*)) + c$. Common abbreviations are $R^+ = RR^*$, $R^? = R + \varepsilon$, and $\Sigma$ for the union of all symbols.

**Examples** over $\{a, b\}$:

| Language | Expression |
|---|---|
| strings ending in $ab$ | $(a+b)^*ab$ |
| strings containing $aa$ | $(a+b)^*aa(a+b)^*$ |
| strings with an even number of $a$'s | $(b^*ab^*a)^*b^*$ |
| strings with no two consecutive $a$'s | $(b + ab)^*(\varepsilon + a)$ |
| strings of even length | $((a+b)(a+b))^*$ |
| strings whose third symbol from the end is $a$ | $(a+b)^*a(a+b)(a+b)$ |

## Algebraic laws

For all regular expressions $R, S, T$ (equalities of the denoted languages):

| Law | Statement |
|---|---|
| Union | $R + S = S + R$, $(R+S)+T = R+(S+T)$, $R + R = R$, $R + \emptyset = R$ |
| Concatenation | $(RS)T = R(ST)$, $\varepsilon R = R\varepsilon = R$, $\emptyset R = R\emptyset = \emptyset$ |
| Distributivity | $R(S+T) = RS + RT$, $(S+T)R = SR + TR$ |
| Star | $(R^*)^* = R^*$, $\emptyset^* = \varepsilon^* = \varepsilon$, $R^*R^* = R^*$, $R^* = \varepsilon + RR^*$ |
| Shifting | $R(SR)^* = (RS)^*R$ |
| Denesting | $(R + S)^* = (R^*S)^*R^* = (R^*S^*)^*$ |

Concatenation is **not** commutative: $ab \neq ba$. Equivalence of two expressions is decided by converting both to minimal DFAs and comparing.

# Kleene's theorem

**Theorem 1 (Kleene).** A language is regular if and only if it is denoted by a regular expression.

## From expressions to automata (Thompson's construction)

By structural induction, build an ε-NFA with one start state and one accepting state for every expression:

- $\emptyset$: two states, no transition. $\varepsilon$: an ε-move. $a$: an $a$-move.
- $R_1 + R_2$: a new start state with ε-moves to both machines, and ε-moves from both accepting states to a new accepting state.
- $R_1 R_2$: an ε-move from the accepting state of $R_1$ to the start of $R_2$.
- $R^*$: a new state that is both start and accept, with an ε-move into $R$ and an ε-move from $R$'s accepting state back to it.

The automaton has $O(|R|)$ states. The **Glushkov (position) automaton** is an alternative without ε-moves: one state per occurrence of a symbol in $R$, plus a start state, with a transition from position $x$ to position $y$ whenever $y$ can follow $x$ in some word.

## From automata to expressions (state elimination)

Generalise the automaton so that edges carry regular expressions. Add a new start state $s$ with an ε-edge to the old start, and a new final state $f$ with ε-edges from every old accepting state. Then remove the other states one at a time. To remove state $q$ with self-loop $S$, for every pair of edges $p \xrightarrow{R_1} q \xrightarrow{R_2} r$ add (by union with any existing edge $p \to r$) the edge
$$p \xrightarrow{\;R_1 S^* R_2\;} r.$$
When only $s$ and $f$ remain, the label of the edge $s \to f$ is the expression. The order of elimination changes the form of the result but not its language.

## Arden's lemma

**Lemma 2 (Arden).** If $\varepsilon \notin L(P)$, the equation $X = Q + XP$ has the unique solution $X = QP^*$. (Symmetrically, $X = Q + PX$ has the solution $X = P^*Q$.)

*Proof.* $QP^*$ is a solution: $Q + QP^*P = Q(\varepsilon + P^*P) = QP^*$. For uniqueness, unrolling gives $X = Q(\varepsilon + P + \dots + P^k) + XP^{k+1}$ for every $k$. A string $w \in X$ of length $n$ cannot lie in $XP^{n+1}$, because every string of $P$ has length at least 1; so $w \in QP^*$. Conversely every string of $QP^*$ lies in $X$. $\square$

To convert a DFA, write one equation per state: $X_q$ is the set of strings that lead from the start state to $q$, so $X_q = \sum_{p \xrightarrow{a} q} X_p\, a$ (plus $\varepsilon$ for the start state). Solve by substitution and Arden's lemma; the answer is the union of $X_q$ over the accepting states.

**Example.** For the DFA "even number of $a$'s" (states $q_0$ start and accepting, $q_1$):
$$X_0 = \varepsilon + X_0 b + X_1 a, \qquad X_1 = X_0 a + X_1 b.$$
Arden on the second: $X_1 = X_0 a b^*$. Substitute: $X_0 = \varepsilon + X_0(b + ab^*a)$, so $X_0 = (b + ab^*a)^*$.

# Proving languages non-regular

## The pumping lemma

**Theorem 3 (pumping lemma for regular languages).** If $L$ is regular, there is a number $p \ge 1$ (the pumping length) such that every $w \in L$ with $|w| \ge p$ can be written $w = xyz$ with

1. $|xy| \le p$,
2. $|y| \ge 1$,
3. $xy^iz \in L$ for every $i \ge 0$.

*Proof.* Let $p$ be the number of states of a DFA for $L$. Reading the first $p$ symbols of $w$ visits $p + 1$ states, so by the pigeonhole principle some state $r$ repeats: $\hat\delta(q_0, x) = \hat\delta(q_0, xy) = r$ with $|xy| \le p$ and $|y| \ge 1$. The segment $y$ is a loop at $r$, which may be traversed any number of times. $\square$

To show $L$ **not** regular, play the lemma as a game against an adversary:

1. The adversary picks $p$.
2. You pick $w \in L$ with $|w| \ge p$ (your choice may depend on $p$).
3. The adversary picks any split $w = xyz$ satisfying 1 and 2.
4. You pick $i$ with $xy^iz \notin L$.

If you have a winning strategy, $L$ is not regular.

**Example 1.** $L = \{a^nb^n \mid n \ge 0\}$. Choose $w = a^pb^p$. Since $|xy| \le p$, $y = a^k$ with $k \ge 1$. Then $xy^2z = a^{p+k}b^p \notin L$.

**Example 2.** $L = \{ ww \mid w \in \{a, b\}^* \}$. Choose $w = a^pba^pb$. Again $y = a^k$ lies in the first block; $xy^0z = a^{p-k}ba^pb$ is not of the form $ww$.

**Example 3.** $L = \{a^{n^2}\}$. Choose $w = a^{p^2}$, so $y = a^k$ with $1 \le k \le p$. Then $|xy^2z| = p^2 + k$, and $p^2 < p^2 + k \le p^2 + p < (p+1)^2$: not a square.

**Example 4.** $L = \{ a^q \mid q \text{ prime} \}$. Choose a prime $q \ge p + 2$ and $w = a^q$, $y = a^k$. Pump with $i = q - k$: the length is $(q - k) + (q - k)k = (q - k)(1 + k)$, a product of two numbers greater than 1.

The pumping lemma is a *necessary* condition only: some non-regular languages satisfy it (e.g. $\{ a^ib^jc^k \mid i = 0 \text{ or } j = k \}$). The Myhill–Nerode theorem below is exact.

## Closure arguments

Often shorter than pumping: if $L$ were regular, then so would be $L \cap R$ for a regular $R$, or $h(L)$, or $\overline{L}$. $\{ w \mid |w|_a = |w|_b \} \cap a^*b^* = \{a^nb^n\}$ shows the first is not regular.

# The Myhill–Nerode theorem

**Definition 2.** For a language $L$, two strings $x, y$ are **distinguishable** if some $z$ has $xz \in L$ and $yz \notin L$ (or vice versa); otherwise they are **indistinguishable**, written $x \equiv_L y$. $\equiv_L$ is an equivalence relation, and it is **right-invariant**: $x \equiv_L y$ implies $xa \equiv_L ya$.

**Theorem 4 (Myhill–Nerode).** $L$ is regular if and only if $\equiv_L$ has finitely many equivalence classes. Moreover, the number of classes equals the number of states of the smallest DFA for $L$.

*Proof.* (⇒) If DFA $M$ recognises $L$ and $\hat\delta(q_0, x) = \hat\delta(q_0, y)$ then $xz$ and $yz$ reach the same state for every $z$, so $x \equiv_L y$. Hence the number of classes is at most the number of states.
(⇐) Build the DFA whose states are the classes $[x]$: start $[\varepsilon]$, $\delta([x], a) = [xa]$ (well defined by right-invariance), accepting classes $\{[x] \mid x \in L\}$. By induction $\hat\delta([\varepsilon], w) = [w]$, so it accepts exactly $L$. $\square$

**Using it to prove non-regularity:** exhibit infinitely many pairwise distinguishable strings. For $\{a^nb^n\}$, the strings $a^0, a^1, a^2, \dots$ are pairwise distinguishable: $a^ib^i \in L$ but $a^jb^i \notin L$ for $j \neq i$.

**Using it to prove lower bounds:** for "the $k$-th symbol from the end is 1", all $2^k$ strings of length $k$ are pairwise distinguishable (if they differ in position $j$, append $0^{j-1}$), so every DFA needs at least $2^k$ states.

# DFA minimisation

The minimal DFA is unique up to renaming of states. It is obtained from any DFA in two steps.

1. **Remove unreachable states** (graph search from the start state).
2. **Merge indistinguishable states.** States $p, q$ are distinguishable if some $z$ leads one to acceptance and the other not.

## The table-filling algorithm

1. Mark every pair $\{p, q\}$ with exactly one of them accepting (distinguished by $z = \varepsilon$).
2. Repeat until nothing changes: mark $\{p, q\}$ if for some symbol $a$ the pair $\{\delta(p, a), \delta(q, a)\}$ is marked.
3. Unmarked pairs are equivalent; merge each equivalence class into one state.

This is $O(n^2|\Sigma|)$ per round and at most $n$ rounds. **Hopcroft's algorithm** refines the partition $\{F, Q \setminus F\}$ by splitting blocks against "splitter" pairs, processing the smaller half each time, in $O(n|\Sigma|\log n)$.

**Example.** A DFA over $\{0, 1\}$ with states $A$–$E$, start $A$, accepting $E$:

| | 0 | 1 |
|---|---|---|
| $A$ | $B$ | $C$ |
| $B$ | $B$ | $D$ |
| $C$ | $B$ | $C$ |
| $D$ | $B$ | $E$ |
| $E$ | $B$ | $C$ |

Round 0 separates $E$ from the rest. Round 1: on 1, $D \to E$ but $A, B, C \to$ non-accepting, so $D$ is split off. Round 2: on 1, $B \to D$ while $A, C \to C$, so $B$ is split off. Round 3: $A$ and $C$ agree on both symbols (both go to $B$ on 0 and $C$ on 1). The minimal DFA has states $\{A, C\}, B, D, E$ and recognises strings ending in $011$.

# Regular grammars

A **right-linear grammar** has rules $A \to wB$ or $A \to w$ with $w \in \Sigma^*$. A **left-linear grammar** has $A \to Bw$ or $A \to w$. Both generate exactly the regular languages:

- *Right-linear → NFA:* one state per non-terminal plus an accepting state $F$; $A \to aB$ becomes $A \xrightarrow{a} B$, $A \to a$ becomes $A \xrightarrow{a} F$, $A \to \varepsilon$ makes $A$ accepting (longer $w$ use intermediate states).
- *NFA → right-linear:* $p \xrightarrow{a} q$ becomes $P \to aQ$, and $P \to \varepsilon$ for every accepting $p$.
- *Left-linear:* reverse the rules to get a right-linear grammar for $L^R$, build its NFA, and reverse the NFA.

Mixing left- and right-linear rules in one grammar can generate non-regular languages: $S \to aA$, $A \to Sb \mid b$ generates $\{a^nb^n \mid n \ge 1\}$.

# Summary of the characterisations

The following are equivalent for a language $L$:

1. $L$ is accepted by a DFA.
2. $L$ is accepted by an NFA, or an ε-NFA.
3. $L$ is denoted by a regular expression.
4. $L$ is generated by a right-linear (or a left-linear) grammar.
5. $\equiv_L$ has finite index.

# Exercises

1. Give regular expressions for: (a) strings over $\{0,1\}$ not containing $11$; (b) strings with an odd number of 1s; (c) binary numbers divisible by 3 (use state elimination on the DFA of Paper 2).
2. Prove or disprove: $(a + b)^* = (a^*b^*)^*$; $(ab)^*a = a(ba)^*$; $(a + b)^*ab = a^*b^*ab$.
3. Show non-regular with the pumping lemma: $\{ a^ib^j \mid i > j \}$; $\{ w \in \{a,b\}^* \mid w = w^R \}$; $\{ 0^n1^m0^n \}$.
4. Use Myhill–Nerode to find the minimal number of states for: strings over $\{a, b\}$ whose length is divisible by 3 and that end in $b$.
5. Minimise a DFA of your choice with the table-filling algorithm, and check the result by computing the Myhill–Nerode classes directly.

*Answers.* (2) True; true (shifting law); false — $abab$ is in the left side but not the right. (3) For $i > j$ pump *down*: $w = a^{p+1}b^p$, $i = 0$ gives $a^{p+1-k}b^p$ with $p + 1 - k \le p$. (4) Four. A string's future depends on $|x| \bmod 3$, and — only when $|x| \equiv 0$ — on whether $x$ ends in $b$ (the empty suffix). So the classes are: length $\equiv 0$ ending in $b$, length $\equiv 0$ otherwise, length $\equiv 1$, length $\equiv 2$.
