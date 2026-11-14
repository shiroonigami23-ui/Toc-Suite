---
title: "Computational Complexity"
subtitle: "Time and space as resources, the classes P, NP and PSPACE, polynomial-time reductions, NP-completeness and the Cook–Levin theorem"
author: "Aryan Singh Chandel"
affiliation: "B.Tech Computer Science and Engineering, Rustamji Institute of Technology, Gwalior"
date: "November 2026"
paper: true
kicker: "Theory of Computation · Paper 9 of 10"
---

# Introduction {.unnumbered}

Decidability separates the solvable from the unsolvable. Complexity theory separates the solvable-in-practice from the solvable-in-principle. A problem whose best algorithm takes $2^n$ steps is decidable, but at $n = 100$ no computer will ever finish. This paper measures the cost of computation, defines the central classes, and explains NP-completeness — the reason thousands of practical problems are believed to have no efficient algorithm.

# Measuring time

The **running time** of a decider $M$ is the function $t(n)$ = the maximum number of steps $M$ takes on any input of length $n$ (worst case). The class
$$\mathrm{TIME}(t(n)) = \{ L \mid L \text{ is decided by a single-tape TM in time } O(t(n)) \}.$$

The model matters only polynomially: a $t(n)$-time multitape TM can be simulated by a single-tape TM in $O(t(n)^2)$ (Paper 7). Nondeterminism, as far as anyone knows, matters exponentially: a nondeterministic $t(n)$-time TM is simulated deterministically in $2^{O(t(n))}$.

**Example.** $\{a^nb^n\}$ is in $\mathrm{TIME}(n^2)$ on one tape by crossing off, in $\mathrm{TIME}(n \log n)$ by repeatedly halving the counts, and in $\mathrm{TIME}(n)$ on two tapes. No single-tape TM does it in $o(n \log n)$; in fact every language decidable in $o(n \log n)$ on one tape is regular.

# The class P

$$\mathrm{P} = \bigcup_k \mathrm{TIME}(n^k).$$

P is the class of problems with polynomial-time algorithms. It is robust — the same for every reasonable deterministic model — and it captures, roughly, "efficiently solvable".

**Examples in P.**

| Problem | Algorithm |
|---|---|
| PATH: is there a path from $s$ to $t$ in a directed graph? | breadth-first search |
| RELPRIME: are $x$ and $y$ relatively prime? | Euclid's algorithm, $O(\log x)$ iterations |
| every context-free language | CYK, $O(n^3)$ |
| $A_{\mathrm{DFA}}$, $E_{\mathrm{DFA}}$, $EQ_{\mathrm{DFA}}$ | simulation, reachability, product + reachability |
| PRIMES | AKS algorithm (2002) |
| 2SAT, bipartite matching, shortest paths, linear programming | classical polynomial algorithms |

Input encoding matters: numbers must be written in binary. A naive primality test that tries all divisors up to $x$ takes time exponential in the *length* $\log x$ of the input.

# The class NP

A **verifier** for $L$ is an algorithm $V$ such that $w \in L$ iff there is a string $c$ (a **certificate**) with $V$ accepting $\langle w, c\rangle$. NP is the class of languages with **polynomial-time verifiers** (certificates of polynomial length). Equivalently, NP is the class of languages decided by nondeterministic TMs in polynomial time: the machine guesses the certificate and then verifies it.

**Examples in NP.**

- **HAMPATH**: does a directed graph have a path from $s$ to $t$ through every vertex exactly once? Certificate: the path.
- **CLIQUE** $= \{\langle G, k\rangle \mid G \text{ has a clique of size } k\}$. Certificate: the $k$ vertices.
- **SUBSET-SUM** $= \{\langle S, t\rangle \mid \text{some subset of } S \text{ sums to } t\}$. Certificate: the subset.
- **SAT** $= \{\langle\varphi\rangle \mid \varphi \text{ is a satisfiable Boolean formula}\}$. Certificate: a satisfying assignment.
- **COMPOSITES**: certificate: a non-trivial factor.

Clearly $\mathrm{P} \subseteq \mathrm{NP}$ (verify by solving). Whether $\mathrm{P} = \mathrm{NP}$ — whether every problem whose solutions can be *checked* quickly can also be *solved* quickly — is the central open question of computer science.

**coNP** is the class of complements of NP languages: problems with short certificates for "no" answers (e.g. "this formula is a tautology" has no known short proof). $\mathrm{P} \subseteq \mathrm{NP} \cap \mathrm{coNP}$; whether NP = coNP is also open.

# Polynomial-time reductions and NP-completeness

$A$ is **polynomial-time reducible** to $B$, $A \le_p B$, if a polynomial-time computable $f$ satisfies $w \in A \iff f(w) \in B$. If $A \le_p B$ and $B \in \mathrm{P}$, then $A \in \mathrm{P}$.

$B$ is **NP-hard** if every $A \in \mathrm{NP}$ reduces to it, and **NP-complete** if moreover $B \in \mathrm{NP}$. An NP-complete problem is a "hardest" problem in NP: if any NP-complete problem is in P, then P = NP.

**Theorem 1 (Cook–Levin).** SAT is NP-complete.

*Proof idea.* Let $N$ be a nondeterministic TM deciding $A$ in time $n^k$. An accepting computation of $N$ on $w$ fits in an $n^k \times n^k$ **tableau** whose rows are configurations. Introduce a Boolean variable $x_{i,j,s}$ for "cell $(i, j)$ holds symbol $s$". Build $\varphi = \varphi_{\text{cell}} \wedge \varphi_{\text{start}} \wedge \varphi_{\text{move}} \wedge \varphi_{\text{accept}}$, saying: each cell holds exactly one symbol; the first row is the start configuration on $w$; every $2 \times 3$ window of adjacent rows is consistent with $\delta$; an accepting state appears. $\varphi$ has size $O(n^{2k})$, and it is satisfiable iff $N$ accepts $w$. $\square$

## A web of reductions

From SAT, NP-completeness spreads by reductions. Each arrow $A \to B$ below is a proof that $A \le_p B$, establishing $B$ NP-hard; membership in NP is shown with a certificate.

| Reduction | Idea |
|---|---|
| SAT $\le_p$ 3SAT | convert to CNF with auxiliary variables; split long clauses: $(a \vee b \vee c \vee d) \to (a \vee b \vee z) \wedge (\overline{z} \vee c \vee d)$ |
| 3SAT $\le_p$ CLIQUE | one vertex per literal occurrence; join literals in different clauses unless they are complementary; ask for a clique of size $k$ = number of clauses |
| CLIQUE $\le_p$ INDEPENDENT-SET | complement the graph |
| INDEPENDENT-SET $\le_p$ VERTEX-COVER | $S$ is independent iff $V \setminus S$ is a vertex cover |
| 3SAT $\le_p$ HAMPATH | a "diamond" gadget per variable traversed left-to-right (true) or right-to-left (false), with detours through clause vertices |
| HAMPATH $\le_p$ HAMCYCLE $\le_p$ TSP (decision) | add a vertex; give edge weights 1 and 2 |
| 3SAT $\le_p$ SUBSET-SUM | decimal digits: one column per variable and per clause |
| 3SAT $\le_p$ 3-COLOURING | palette triangle, variable gadgets, clause gadgets |

**Proving a new problem $B$ NP-complete:** (1) show $B \in \mathrm{NP}$ with a certificate and polynomial verifier; (2) pick a known NP-complete $A$ and give a polynomial reduction $A \le_p B$, proving both directions of $w \in A \iff f(w) \in B$.

**Worked example: 3SAT $\le_p$ CLIQUE.** For $\varphi = C_1 \wedge \dots \wedge C_k$ with three literals per clause, make a vertex for each of the $3k$ literal occurrences. Connect two vertices if they belong to different clauses and are not $x$ and $\overline{x}$. If $\varphi$ is satisfiable, pick one true literal per clause: these $k$ vertices are pairwise compatible, a $k$-clique. Conversely a $k$-clique has one vertex per clause (vertices in the same clause are not joined) and no complementary pair, so setting its literals true is a consistent satisfying assignment.

# Space complexity

$\mathrm{SPACE}(f(n))$ is the class of languages decided using $O(f(n))$ tape cells; $\mathrm{PSPACE} = \bigcup_k \mathrm{SPACE}(n^k)$, and $\mathrm{L} = \mathrm{SPACE}(\log n)$ (with a read-only input tape).

**Theorem 2 (Savitch).** $\mathrm{NSPACE}(f(n)) \subseteq \mathrm{SPACE}(f(n)^2)$ for $f(n) \ge \log n$. Hence $\mathrm{NPSPACE} = \mathrm{PSPACE}$.

*Idea.* "Can configuration $c_1$ reach $c_2$ in $2^t$ steps?" holds iff some midpoint $c_m$ is reachable from $c_1$ in $2^{t-1}$ steps and reaches $c_2$ in $2^{t-1}$ steps. Recursion depth $O(f(n))$, each level storing one configuration of size $O(f(n))$.

Space can be reused while time cannot, so space is the more forgiving resource:
$$\mathrm{L} \subseteq \mathrm{NL} \subseteq \mathrm{P} \subseteq \mathrm{NP} \subseteq \mathrm{PSPACE} = \mathrm{NPSPACE} \subseteq \mathrm{EXPTIME}.$$
By the hierarchy theorems, $\mathrm{L} \neq \mathrm{PSPACE}$ and $\mathrm{P} \neq \mathrm{EXPTIME}$, so at least one inclusion in each chain is strict — but which one is unknown.

**PSPACE-complete problems** include TQBF (truth of fully quantified Boolean formulas), generalised geography and other two-player games, and — connecting back to Paper 2 — **universality and equivalence of NFAs and regular expressions**. **NL-complete:** PATH in directed graphs.

# Coping with NP-hardness

An NP-complete problem may still be solved in practice:

- **exact algorithms** that are exponential in the worst case but fast on typical inputs (SAT solvers, branch and bound, integer programming);
- **pseudo-polynomial** algorithms when numbers are small (dynamic programming for SUBSET-SUM in $O(nt)$);
- **fixed-parameter** algorithms, polynomial when a parameter is small (vertex cover in $O(2^k n)$);
- **approximation algorithms** with guarantees (a 2-approximation for vertex cover from a maximal matching);
- **special cases** in P (2SAT, matching, problems on trees and interval graphs).

# Summary

| Class | Definition | Complete problems |
|---|---|---|
| P | deterministic polynomial time | (under logspace reductions) circuit value |
| NP | polynomial-time verifiable | SAT, 3SAT, CLIQUE, VERTEX-COVER, HAMPATH, SUBSET-SUM, 3-COLOURING, TSP |
| coNP | complements of NP | TAUTOLOGY, UNSAT |
| PSPACE | polynomial space | TQBF, NFA universality, regex equivalence |
| EXPTIME | exponential time | generalised chess and go (with suitable rules) |

# Exercises

1. Show that $\{\langle G\rangle \mid G \text{ is a connected undirected graph}\}$ and $\{\langle G\rangle \mid G \text{ is bipartite}\}$ are in P.
2. Show that if P = NP then every language in P except $\emptyset$ and $\Sigma^*$ is NP-complete.
3. Prove that DOUBLE-SAT (formulas with at least two satisfying assignments) is NP-complete.
4. Prove that SET-PARTITION (can a multiset of integers be split into two halves of equal sum?) is NP-complete by reduction from SUBSET-SUM.
5. Why does the dynamic-programming algorithm for SUBSET-SUM not show P = NP?

*Answers.* (2) Given $L \in \mathrm{P}$ with $y \in L$, $n \notin L$, reduce any $A \in \mathrm{NP} = \mathrm{P}$ by deciding $A$ and outputting $y$ or $n$. (3) Reduce SAT: $\varphi \mapsto \varphi \wedge (x \vee \overline{x})$ with a fresh variable $x$ — every satisfying assignment of $\varphi$ yields two. (5) Its running time $O(nt)$ is polynomial in the *value* $t$, but exponential in the length $\log t$ of its encoding.
