# 6. Regular expressions

## Syntax and meaning

A **regular expression** describes a language using three operations on smaller expressions:

| Expression | Language |
|---|---|
| $\varnothing$ | the empty language |
| $\varepsilon$ | $\{\varepsilon\}$ |
| $a$ (a symbol) | $\{a\}$ |
| $R + S$ (also written $R \mid S$) | union: $L(R) \cup L(S)$ |
| $RS$ | concatenation: $L(R)L(S)$ |
| $R^*$ | Kleene star: zero or more repetitions |
| $R^+$ | one or more repetitions, $RR^*$ |
| $R?$ | optional, $R + \varepsilon$ |

Star binds tightest, then concatenation, then union, so $ab^* + c$ means $(a(b^*)) + c$. Toc-Suite accepts both `+` and `|` for union in the FA studio, the Grammar Studio and the Automata Assistant's description box.

Some expressions worth knowing by heart, over $\{a, b\}$:

| Language | Expression |
|---|---|
| all strings | $(a+b)^*$ |
| ending in $abb$ | $(a+b)^*abb$ |
| containing $aa$ | $(a+b)^*aa(a+b)^*$ |
| even length | $((a+b)(a+b))^*$ |
| no two consecutive $b$'s | $(a + ba)^*(\varepsilon + b)$ |
| an even number of $a$'s | $(b^* a b^* a)^* b^*$ |

## From expression to automaton: Thompson's construction

Every regular expression can be turned into an ε-NFA by building small machines for symbols and combining them:

- **symbol $a$**: two states joined by an $a$-transition;
- **union**: a new start state with ε-transitions into both machines, and ε-transitions from both accepting states into a new accepting state;
- **concatenation**: an ε-transition from the first machine's accepting state to the second's start;
- **star**: a new start and accept state, with ε-transitions that allow skipping the machine entirely or repeating it.

![Thompson's construction for $ab^*$. The construction is mechanical and produces many ε-transitions; ε-removal and the subset construction then turn it into a DFA, and minimisation makes it small.](../figures/thompson-ab-star.png)

## From automaton to expression

The reverse direction, from a DFA to a regular expression, is done by **state elimination**: add a new start and a new accepting state, then remove the original states one at a time. When a state $q$ with a self-loop labelled $S$ is removed, every path $p \xrightarrow{R} q \xrightarrow{T} r$ is replaced by a single edge $p \xrightarrow{R S^* T} r$, combined by union with any edge already from $p$ to $r$. When only the new start and accept states remain, the label between them is the expression. The result depends on the order of elimination but always describes the same language.

**Arden's theorem** gives an algebraic route: if $X = AX + B$ and $\varepsilon \notin L(A)$, then $X = A^*B$. Writing one equation per state and solving them gives an expression for the language of the start state.

## Useful identities

$R + R = R$; $\ R\varepsilon = \varepsilon R = R$; $\ R\varnothing = \varnothing$; $\ (R^*)^* = R^*$; $\ (R + S)^* = (R^* S^*)^*$; $\ R^*R^* = R^*$; $\ (RS)^*R = R(SR)^*$.

::: {.callout .try data-title="Try it"}
Type `(a+b)*abb` into the Automata Assistant and press **Build DFA**: the reader recognises a regular expression and builds the minimal DFA. Type the same expression into the Grammar Studio's regular-expression tab and choose **Convert Regex and Open FA** to see the same machine reached by a different route.
:::

# 7. What finite automata cannot do

## Closure properties

The regular languages are closed under union, intersection, complement, difference, concatenation, star and reversal: applying any of these operations to regular languages gives a regular language. The proofs are constructions: product automata for intersection and union, swapping accepting and non-accepting states of a *complete* DFA for complement, ε-transitions for concatenation and star, and reversing every arrow (then determinising) for reversal.

Closure properties are also a tool for proving that a language is *not* regular. If $L$ were regular, then $L \cap a^*b^*$ would be regular too; so if that intersection is known to be non-regular, so is $L$.

## The pumping lemma for regular languages

**Lemma.** If $L$ is regular, there is a number $p$ (the pumping length) such that every string $s \in L$ with $\lvert s \rvert \ge p$ can be split as $s = xyz$ with

1. $\lvert y \rvert \ge 1$,
2. $\lvert xy \rvert \le p$, and
3. $x y^i z \in L$ for every $i \ge 0$.

The reason is the pigeonhole principle: a DFA with $p$ states that reads $p$ symbols must visit some state twice, and the part of the input between the two visits ($y$) can be repeated or removed without changing whether the machine accepts.

## Using it: $\{a^n b^n \mid n \ge 0\}$ is not regular

Suppose it were regular, with pumping length $p$. Take $s = a^p b^p$, which is in the language and has length at least $p$. Any split $s = xyz$ with $\lvert xy \rvert \le p$ has $y$ consisting only of $a$'s, and $\lvert y \rvert \ge 1$. Then $xy^2z$ has more $a$'s than $b$'s, so it is not in the language, contradicting condition 3. So the language is not regular.

::: {.callout .warn data-title="Common mistakes with the pumping lemma"}
You choose the string $s$, but you do **not** choose the split: the argument must work for **every** split allowed by conditions 1 and 2. And the lemma can only prove that a language is *not* regular. A language that satisfies the pumping conditions may still be non-regular.
:::

## The Myhill–Nerode view

Two strings $x$ and $y$ are **distinguishable** with respect to $L$ if some suffix $z$ makes exactly one of $xz$, $yz$ belong to $L$. A language is regular if and only if it has finitely many classes of mutually indistinguishable strings, and the number of classes is exactly the number of states of its minimal DFA. For $a^n b^n$, the strings $a, aa, aaa, \dots$ are pairwise distinguishable (append $b^i$), so there are infinitely many classes and no DFA exists. This view is also how Toc-Suite's guided mode explains that one of your states is "doing two jobs": it has found two strings that reach the same state of your machine but are distinguishable in the target language.
