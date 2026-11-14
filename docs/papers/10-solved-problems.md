---
title: "Theory of Computation: A Workbook of Solved Problems"
subtitle: "Forty exam-style problems across finite automata, regular expressions, transducers, grammars, pushdown automata, Turing machines, decidability and complexity — with complete solutions"
author: "Aryan Singh Chandel"
affiliation: "B.Tech Computer Science and Engineering, Rustamji Institute of Technology, Gwalior"
date: "November 2026"
paper: true
kicker: "Theory of Computation · Paper 10 of 10"
---

# How to use this workbook {.unnumbered}

Each problem is followed by a full solution. Try each one for at least ten minutes before reading the solution; when you read it, check *why* each step is needed, not just what it is. Problems marked ★ are harder than a typical examination question. Notation follows Papers 1–9.

# Part A — Finite automata

**A1.** Design a DFA over $\{0, 1\}$ for strings that do **not** contain $011$.

*Solution.* Build the DFA for "contains $011$" by tracking the longest suffix that is a prefix of $011$: states $s_\varepsilon, s_0, s_{01}, s_{011}$ with
$s_\varepsilon \xrightarrow{0} s_0$, $s_\varepsilon \xrightarrow{1} s_\varepsilon$; $s_0 \xrightarrow{0} s_0$, $s_0 \xrightarrow{1} s_{01}$; $s_{01} \xrightarrow{0} s_0$, $s_{01} \xrightarrow{1} s_{011}$; $s_{011}$ loops on both. It accepts in $s_{011}$. The DFA is complete, so complementing the accepting set gives the answer: accept in $s_\varepsilon, s_0, s_{01}$.

**A2.** Give a DFA for binary strings whose value is divisible by 5 (MSB first; ε counts as 0).

*Solution.* States $0$–$4$ for the remainder, start and accept $0$, and $\delta(r, b) = (2r + b) \bmod 5$:

| $r$ | 0 | 1 |
|---|---|---|
| 0 | 0 | 1 |
| 1 | 2 | 3 |
| 2 | 4 | 0 |
| 3 | 1 | 2 |
| 4 | 3 | 4 |

Correctness: by induction, after reading $w$ the state is $\mathrm{val}(w) \bmod 5$, because $\mathrm{val}(wb) = 2\,\mathrm{val}(w) + b$.

**A3.** Convert to a DFA the NFA over $\{a, b\}$ with states $1, 2, 3$, start 1, accepting 3, and moves $1 \xrightarrow{a} \{1, 2\}$, $1 \xrightarrow{b} \{1\}$, $2 \xrightarrow{a} \{3\}$, $2 \xrightarrow{b} \{3\}$.

*Solution.* Reachable subsets from $\{1\}$:

| subset | $a$ | $b$ |
|---|---|---|
| $\{1\}$ | $\{1,2\}$ | $\{1\}$ |
| $\{1,2\}$ | $\{1,2,3\}$ | $\{1,3\}$ |
| $\{1,2,3\}$* | $\{1,2,3\}$ | $\{1,3\}$ |
| $\{1,3\}$* | $\{1,2\}$ | $\{1\}$ |

The NFA accepts strings whose second-to-last symbol is $a$; the DFA has 4 states, which is minimal (it must remember the last two symbols).

**A4.** Eliminate the ε-moves from the ε-NFA with start $p$, accepting $r$, and moves $p \xrightarrow{\varepsilon} q$, $p \xrightarrow{a} p$, $q \xrightarrow{b} q$, $q \xrightarrow{\varepsilon} r$, $r \xrightarrow{c} r$.

*Solution.* ε-closures: $E(p) = \{p, q, r\}$, $E(q) = \{q, r\}$, $E(r) = \{r\}$. All three states can reach $r$ by ε-moves, so all are accepting. New moves $\delta'(s, x) = E(\delta(E(s), x))$: $p \xrightarrow{a} \{p,q,r\}$, $p \xrightarrow{b} \{q, r\}$, $p \xrightarrow{c} \{r\}$; $q \xrightarrow{b} \{q, r\}$, $q \xrightarrow{c} \{r\}$; $r \xrightarrow{c} \{r\}$. The language is $a^*b^*c^*$.

**A5.** Use the product construction to build a DFA for strings over $\{a, b\}$ with an even number of $a$'s **and** an odd number of $b$'s. How many states?

*Solution.* Pair the two-state parity automata: states $(p_a, p_b) \in \{E, O\}^2$, start $(E, E)$, $a$ flips the first component, $b$ the second; accept only $(E, O)$. Four states, all necessary (the four parity combinations are pairwise distinguishable).

**A6.** ★ Show that every DFA for $L_k = \{ w \in \{a,b\}^* \mid \text{the } k\text{-th symbol from the end is } a \}$ has at least $2^k$ states.

*Solution.* Let $x \neq y$ be strings of length $k$; they differ at some position $i$, say $x_i = a$, $y_i = b$. Append $z = b^{i-1}$: in $xz$ and $yz$ the $k$-th symbol from the end is $x_i$ and $y_i$ respectively, so $xz \in L_k$, $yz \notin L_k$. All $2^k$ strings of length $k$ are pairwise distinguishable, so (Myhill–Nerode) they need $2^k$ distinct states. An NFA needs only $k + 1$.

# Part B — Regular expressions and regular languages

**B1.** Write a regular expression for strings over $\{0,1\}$ in which every 1 is followed immediately by 00.

*Solution.* $(0 + 100)^*$. Every 1 must be part of a block $100$, and the blocks and stray 0s may appear in any order.

**B2.** Use state elimination (or Arden's lemma) on the DFA of A2 restricted to divisibility by 3 to obtain a regular expression.

*Solution.* With states $0, 1, 2$ and Arden's lemma: $X_2 = X_1 0 + X_2 1$ gives $X_2 = X_1 0 1^*$. $X_1 = X_0 1 + X_2 0 = X_0 1 + X_1 01^*0$, so $X_1 = X_0 1 (01^*0)^*$. $X_0 = \varepsilon + X_0 0 + X_1 1 = \varepsilon + X_0(0 + 1(01^*0)^*1)$, giving
$$X_0 = (0 + 1(01^*0)^*1)^*.$$

**B3.** Prove that $L = \{ a^ib^j \mid i \neq j \}$ is not regular.

*Solution.* If $L$ were regular, so would be $\overline{L} \cap a^*b^* = \{a^nb^n\}$, which is not. (A direct pumping proof is harder, because pumping must avoid landing exactly on $i = j$; the closure argument sidesteps that.)

**B4.** Prove that $L = \{ w \in \{a, b\}^* \mid |w|_a > |w|_b \}$ is not regular, using Myhill–Nerode.

*Solution.* The strings $b^0, b^1, b^2, \dots$ are pairwise distinguishable: for $i < j$, the suffix $a^{i+1}$ gives $b^ia^{i+1} \in L$ but $b^ja^{i+1} \notin L$. Infinitely many classes, so $L$ is not regular.

**B5.** Minimise the DFA over $\{a, b\}$ with states $1$–$6$, start 1, accepting $\{3, 4\}$:

| | $a$ | $b$ |
|---|---|---|
| 1 | 2 | 5 |
| 2 | 3 | 6 |
| 3 | 3 | 4 |
| 4 | 3 | 4 |
| 5 | 2 | 5 |
| 6 | 3 | 6 |

*Solution.* Initial partition $\{3,4\}$, $\{1,2,5,6\}$. On $a$: $1 \to 2$, $5 \to 2$ (non-accepting) but $2 \to 3$, $6 \to 3$ (accepting): split into $\{1,5\}$, $\{2,6\}$. Check $b$: $1 \to 5$, $5 \to 5$ (same block); $2 \to 6$, $6 \to 6$ (same); $3 \to 4$, $4 \to 4$ (same). Stable. Minimal DFA: $A = \{1,5\}$, $B = \{2,6\}$, $C = \{3,4\}$ with $A \xrightarrow{a} B$, $A \xrightarrow{b} A$, $B \xrightarrow{a} C$, $B \xrightarrow{b} B$, $C$ loops, $C$ accepting: strings with at least two $a$'s.

**B6.** ★ Is $L = \{ a^ib^jc^k \mid i = 0 \text{ or } j = k \}$ regular? Does it satisfy the pumping lemma?

*Solution.* It is not regular: $L \cap ab^*c^* = \{ab^nc^n\}$, which is not regular. Yet it satisfies the pumping lemma with $p = 1$. If $w$ starts with $a$, take $y$ to be that $a$: pumping changes only the number of $a$'s, and since $w \in L$ has at least one $a$, it has $j = k$, which pumping preserves (and with no $a$'s left the string is in $L$ anyway). If $w$ has no $a$'s, take $y$ to be its first symbol: every pumped string still has no $a$'s. So the pumping lemma is only a necessary condition for regularity.

# Part C — Transducers

**C1.** Design a Mealy machine over $\{0,1\}$ that outputs 1 when the last two inputs are equal (output 0 for the first input).

*Solution.* States $s$ (start), $z$ (last input 0), $o$ (last input 1). $s \xrightarrow{0/0} z$, $s \xrightarrow{1/0} o$, $z \xrightarrow{0/1} z$, $z \xrightarrow{1/0} o$, $o \xrightarrow{0/0} z$, $o \xrightarrow{1/1} o$.

**C2.** Convert the machine of C1 to a Moore machine.

*Solution.* Split states by incoming output: $(s, 0)$ start; $(z, 0)$, $(z, 1)$, $(o, 0)$, $(o, 1)$ with outputs $0, 1, 0, 1$. Moves: from any $(z, \cdot)$: $0 \to (z, 1)$, $1 \to (o, 0)$; from any $(o, \cdot)$: $0 \to (z, 0)$, $1 \to (o, 1)$; from $(s, 0)$: $0 \to (z, 0)$, $1 \to (o, 0)$. Five states.

**C3.** Design a Moore machine that outputs the remainder of the number of 1s read so far modulo 3.

*Solution.* States $0, 1, 2$, output equals the state, $1$ moves $r \to r + 1 \bmod 3$, $0$ stays.

# Part D — Context-free grammars

**D1.** Give a CFG for $\{ a^ib^jc^k \mid i + k = j \}$.

*Solution.* Split $b^j = b^ib^k$: the string is $a^ib^i\,b^kc^k$. $S \to XY$, $X \to aXb \mid \varepsilon$, $Y \to bYc \mid \varepsilon$.

**D2.** Give a CFG for $\{ w \in \{a,b\}^* \mid |w|_a = 2|w|_b \}$.

*Solution.* Use every arrangement of two $a$'s and one $b$, with $S$ in the gaps:
$$S \to \varepsilon \mid SS \mid aSaSbS \mid aSbSaS \mid bSaSaS.$$
Each production keeps the 2:1 ratio. Completeness: for $w \ne \varepsilon$ in $L$, consider the running value $2|x|_b - |x|_a$ over prefixes; split $w$ at the first return to 0 if it occurs inside $w$ (rule $SS$), otherwise the first symbol and the structure of the walk identify one of the three triple rules.

**D3.** Show that $S \to aSb \mid aSbb \mid \varepsilon$ is ambiguous and describe its language.

*Solution.* $L = \{ a^nb^m \mid n \le m \le 2n \}$. The string $aabbb$ has two derivations: $S \Rightarrow aSb \Rightarrow aaSbbb \Rightarrow aabbb$ and $S \Rightarrow aSbb \Rightarrow aaSbbb \Rightarrow aabbb$ — the "short" and "long" rules are applied in different orders, giving different trees. An unambiguous grammar: $S \to aSb \mid T$, $T \to aTbb \mid \varepsilon$ (all single-$b$ steps outside).

**D4.** Convert $S \to aSa \mid bSb \mid \varepsilon$ to Chomsky normal form.

*Solution.* START: $S_0 \to S$. DEL ($S$ nullable): $S \to aSa \mid aa \mid bSb \mid bb$, $S_0 \to S \mid \varepsilon$. UNIT: $S_0 \to aSa \mid aa \mid bSb \mid bb \mid \varepsilon$. TERM: $A \to a$, $B \to b$. BIN:
$$S_0 \to AX \mid AA \mid BY \mid BB \mid \varepsilon,\quad S \to AX \mid AA \mid BY \mid BB,\quad X \to SA,\quad Y \to SB,\quad A \to a,\quad B \to b.$$

**D5.** Run CYK on $w = aab$ for $S \to AB \mid BB$, $A \to AB \mid a$, $B \to AA \mid b$.

*Solution.* Length 1: $T[1,1] = T[2,1] = \{A\}$, $T[3,1] = \{B\}$. Length 2: $aa$: $AA \to B$, so $\{B\}$; $ab$: $AB \to S, A$, so $\{S, A\}$. Length 3: split $a \mid ab$: $A \cdot \{S, A\}$ gives $AA \to B$; split $aa \mid b$: $B \cdot B$ gives $BB \to S$. $T[1,3] = \{B, S\}$ contains $S$: accepted.

**D6.** Compute FIRST and FOLLOW for $S \to AB$, $A \to aA \mid \varepsilon$, $B \to bB \mid c$, and build the LL(1) table.

*Solution.* FIRST$(A) = \{a, \varepsilon\}$, FIRST$(B) = \{b, c\}$, FIRST$(S) = \{a, b, c\}$. FOLLOW$(S) = \{\$\}$, FOLLOW$(A) = \{b, c\}$, FOLLOW$(B) = \{\$\}$. Table: $[S, a] = [S, b] = [S, c] = S \to AB$; $[A, a] = A \to aA$; $[A, b] = [A, c] = A \to \varepsilon$; $[B, b] = B \to bB$; $[B, c] = B \to c$. No conflicts: LL(1).

**D7.** Prove that $\{ a^n b^n c^m \mid m \le n \}$ is not context-free.

*Solution.* Take $w = a^pb^pc^p$. If $vxy$ contains no $c$'s, pump down ($i = 0$): the number of $a$'s or $b$'s falls below $p$ (or they become unequal), so either $n$ changes on one side only (unequal $a$/$b$ counts) or $m = p > n$. If $vxy$ contains $c$'s, it contains no $a$'s (window $\le p$); pumping up adds $c$'s or $b$'s: if $c$'s are added, $m > n$; if $b$'s are added, $a$ and $b$ counts differ. Either way the result leaves $L$.

# Part E — Pushdown automata

**E1.** Give a PDA for $\{ a^ib^jc^k \mid i = k \}$ and trace it on $abbc$.

*Solution.* $q_0$: on $a$ push $X$; ε-move to $q_1$; $q_1$: on $b$ leave the stack; ε-move to $q_2$; $q_2$: on $c$ pop $X$; ε-move to accepting $q_3$ when $Z$ is on top. Trace: push $X$; switch; read $b, b$; switch; pop on $c$; $Z$ on top; accept.

**E2.** Convert $S \to aSb \mid \varepsilon$ to a PDA and show its moves on $aabb$.

*Solution.* Moves: $(q_0, \varepsilon, Z / SZ)$, $(q_1, \varepsilon, S / aSb)$, $(q_1, \varepsilon, S / \varepsilon)$, $(q_1, a, a / \varepsilon)$, $(q_1, b, b / \varepsilon)$, $(q_1, \varepsilon, Z / Z) \to q_2$. On $aabb$ the stack goes $SZ \to aSbZ \to SbZ \to aSbbZ \to SbbZ \to bbZ \to bZ \to Z$ while reading $a, a, b, b$, then accept.

**E3.** ★ Show that $L = \{ a^nb^n \mid n \ge 1 \} \cup \{ a^nb^{2n} \mid n \ge 1 \}$ is not a deterministic CFL.

*Solution.* Suppose DPDA $P$ accepts $L$. Make two copies $P_1$, $P_2$ of $P$; run $P_1$ normally and, from every accepting state of $P_1$, continue in $P_2$ — but $P_2$ reads $c$ wherever $P$ read $b$. Determinism guarantees that after reading $a^nb^n$ the machine is in the unique configuration reached by $P$, from which $P$ would accept $a^nb^{2n}$ after $n$ more $b$'s. So the combined machine accepts $a^nb^nc^n$ — and only strings of that shape among $a^*b^*c^*$ — making $\{a^nb^nc^n\}$ context-free (intersect with $a^*b^*c^*$), a contradiction.

# Part F — Turing machines

**F1.** Describe a TM that decides $\{ w \in \{a, b\}^* \mid |w|_a = |w|_b \}$ and give its running time.

*Solution.* Repeat: scan right for an unmarked $a$; if found, mark it, return to the left end, scan for an unmarked $b$ and mark it (reject if none), return. If no unmarked $a$ is found, scan for an unmarked $b$: reject if one exists, otherwise accept. Each round costs $O(n)$ and there are at most $n/2$ rounds: $O(n^2)$.

**F2.** Give a TM computing $f(1^m01^n) = 1^{m+n}$ and trace it on $11011$.

*Solution.* $q_0$: skip 1s rightwards; on 0 write 1, go to $q_1$. $q_1$: skip 1s; on the blank move left to $q_2$. $q_2$: on 1 write a blank and halt. Trace on $11011$: $q_0$ passes the first two 1s, rewrites the 0 as 1 (tape $11111$); $q_1$ runs to the blank; $q_2$ erases the last 1. The tape holds $1111 = 1^{2+2}$.

**F3.** Show that a TM with a two-way infinite tape can be simulated by one with a one-way tape.

*Solution.* Use two tracks: the upper track holds cells $0, 1, 2, \dots$ and the lower track holds cells $-1, -2, \dots$. A marker in cell 0 lets the machine switch tracks when crossing the origin; while on the lower track, left and right moves are reversed. The state remembers the current track.

# Part G — Decidability

**G1.** Show that $\{ \langle D \rangle \mid D \text{ is a DFA accepting some palindrome} \}$ is decidable.

*Solution.* The palindromes form a CFL $P$. $L(D) \cap P$ is context-free and a grammar for it can be built (product of a PDA for $P$ with $D$, then PDA → CFG). Test emptiness with $E_{\mathrm{CFG}}$.

**G2.** Show that $\{ \langle M \rangle \mid M \text{ is a TM and } L(M) \text{ is finite} \}$ is undecidable.

*Solution.* By Rice's theorem — finiteness of $L(M)$ is a non-trivial property of the language ($\emptyset$ is finite, $\Sigma^*$ is not).

**G3.** Show that $\{ \langle M, w \rangle \mid M \text{ writes a 1 on its tape when run on } w \}$ is undecidable.

*Solution.* Reduce $A_{\mathrm{TM}}$. Given $\langle M, w\rangle$, build $M'$ that uses a renamed tape alphabet so that it never writes 1, simulates $M$ on $w$, and writes a 1 just before accepting. $M'$ writes 1 iff $M$ accepts $w$. (Rice does not apply: this is a property of the machine's behaviour, not of its language.)

**G4.** ★ Show that $\overline{A_{\mathrm{TM}}} \le_m EQ_{\mathrm{TM}}$, and conclude that $EQ_{\mathrm{TM}}$ is not recognisable.

*Solution.* Map $\langle M, w\rangle$ to $\langle M_1, M_2\rangle$ where $M_1$ rejects everything and $M_2$ on any input runs $M$ on $w$ and accepts if $M$ does. $L(M_2) = \Sigma^*$ if $M$ accepts $w$, else $\emptyset$; so $L(M_1) = L(M_2)$ iff $M$ does not accept $w$. Since $\overline{A_{\mathrm{TM}}}$ is not recognisable, neither is $EQ_{\mathrm{TM}}$.

# Part H — Complexity

**H1.** Show that VERTEX-COVER $= \{\langle G, k\rangle \mid G \text{ has a vertex cover of size } k\}$ is in NP.

*Solution.* Certificate: a set $C$ of $k$ vertices. Verifier: check $|C| = k$ and that every edge has an endpoint in $C$ — $O(|V| + |E|)$ time.

**H2.** Reduce INDEPENDENT-SET to VERTEX-COVER.

*Solution.* $\langle G, k\rangle \mapsto \langle G, |V| - k\rangle$. $S$ is independent iff no edge has both endpoints in $S$, iff every edge has an endpoint in $V \setminus S$, iff $V \setminus S$ is a vertex cover.

**H3.** Show that 2SAT is in P.

*Solution.* Build the implication graph: for each clause $(a \vee b)$ add edges $\overline{a} \to b$ and $\overline{b} \to a$. The formula is unsatisfiable iff some variable $x$ has $x$ and $\overline{x}$ in the same strongly connected component. SCCs are found in linear time.

**H4.** ★ Show that HAMCYCLE $\le_p$ TSP (decision version: is there a tour of cost $\le B$?).

*Solution.* Given $G = (V, E)$, build the complete graph on $V$ with cost 1 on edges of $E$ and cost 2 on the others, and set $B = |V|$. A Hamiltonian cycle of $G$ is a tour of cost $|V|$; conversely a tour of cost $|V|$ uses only cost-1 edges, i.e. edges of $G$.

# Quick reference

| To show $L$ is… | Do this |
|---|---|
| regular | build a DFA/NFA/regex, or use closure properties |
| not regular | pumping lemma, Myhill–Nerode (infinitely many distinguishable strings), or closure (intersect with a regular language) |
| context-free | build a CFG or PDA, or use closure (union, concatenation, ∩ regular) |
| not context-free | CFL pumping lemma, or intersect with a regular language and get a known non-CFL |
| decidable | describe an algorithm that always halts |
| undecidable | reduce a known undecidable problem to $L$, or Rice's theorem |
| not recognisable | show $\overline{L}$ is recognisable and $L$ undecidable, or reduce $\overline{A_{\mathrm{TM}}}$ to $L$ |
| in NP | give a certificate and a polynomial verifier |
| NP-complete | in NP, plus a polynomial reduction from a known NP-complete problem |
