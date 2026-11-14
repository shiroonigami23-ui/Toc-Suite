# 8. Mealy and Moore machines

## Machines that produce output

A finite automaton answers yes or no. A **transducer** reads an input string and produces an output string. Two standard models differ only in where the output is attached.

A **Moore machine** $(Q, \Sigma, \Gamma, \delta, \lambda, q_0)$ has an output function $\lambda : Q \to \Gamma$ on **states**. It emits $\lambda(q_0)$ before reading anything and then $\lambda$ of each state it enters, so an input of length $n$ produces an output of length $n + 1$.

A **Mealy machine** $(Q, \Sigma, \Gamma, \delta, \lambda, q_0)$ has an output function $\lambda : Q \times \Sigma \to \Gamma$ on **transitions**. It emits one symbol per input symbol, so an input of length $n$ produces an output of length $n$.

![A Moore machine that outputs the parity of the number of 1s read so far. Each state shows its output.](../figures/moore-parity.png){.narrow}

![A Mealy machine that outputs X when the input changes (0 to 1 or 1 to 0) and S otherwise. Transitions are labelled input/output.](../figures/mealy-change.png){.narrow}

## Converting Moore to Mealy

Give each transition the output of the state it enters: a transition $p \xrightarrow{a} q$ in the Moore machine becomes $p \xrightarrow{a / \lambda(q)} q$. The Mealy machine produces the Moore machine's output without its first symbol $\lambda(q_0)$, and that is the standard sense in which the two are equivalent.

## Converting Mealy to Moore

A Mealy state may be entered with different outputs, and a Moore state can only have one, so such a state must be **split**: one copy for each output with which it can be entered. Each copy keeps all of the original state's outgoing transitions, redirected to the copy of the target that carries the transition's output. The start state needs a copy for the moment before any input is read; its output is arbitrary, because the comparison ignores the first Moore output.

For the change detector above, `last0` is entered with output `S` (from itself on 0) and with output `X` (from `last1` on 0), so it splits into `last0/S` and `last0/X`; `last1` likewise splits into `last1/X` and `last1/S`. The Moore machine has four states.

::: {.callout .try data-title="Try it"}
In the Mealy/Moore studio, draw the change detector as a Mealy machine and choose **Mealy → Moore** in the mode menu to watch the states split. In the practice panel, **Convert: Mealy → Moore** gives you a verified Mealy machine to convert by hand; the checker compares outputs on every input exactly.
:::

## Common mistakes

- Off-by-one comparisons between Moore and Mealy outputs: a Moore machine always prints one more symbol.
- Detecting overlapping patterns: a detector for `11` must still output "yes" after `111`, because the last two symbols are still `11`.
- Forgetting that a Mealy machine's output depends on the symbol being read *now*, not on the state alone.

# 9. Context-free grammars

## Definition

A **context-free grammar** (CFG) is a 4-tuple $G = (V, \Sigma, R, S)$: a set of variables (non-terminals) $V$, terminals $\Sigma$, production rules $R$ of the form $A \to \alpha$ where $A \in V$ and $\alpha$ is a string of variables and terminals, and a start variable $S$. A **derivation** repeatedly replaces a variable by the right-hand side of one of its rules. The language $L(G)$ is the set of terminal strings derivable from $S$.

Example: $S \to aSb \mid \varepsilon$ generates $\{a^n b^n \mid n \ge 0\}$. A derivation of $aabb$ is $S \Rightarrow aSb \Rightarrow aaSbb \Rightarrow aabb$.

## Parse trees and ambiguity

A **parse tree** shows a derivation as a tree: the root is $S$, each internal node is a variable whose children are the right-hand side of the rule applied, and the leaves read left to right give the string. A grammar is **ambiguous** if some string has two different parse trees. The classic example is $E \to E + E \mid E * E \mid a$, in which $a + a * a$ has two trees, one for each order of evaluation. Ambiguity is usually removed by introducing a variable for each precedence level: $E \to E + T \mid T$, $T \to T * F \mid F$, $F \to a$.

::: {.callout .try data-title="Try it"}
In the Grammar Studio, enter `S -> a S b | eps`, open **Parse Tree** and generate the tree for `aabb`. The **Derivation** tab shows the leftmost derivation step by step.
:::

## Normal forms

A grammar is in **Chomsky normal form** if every rule has the form $A \to BC$ or $A \to a$ (plus $S \to \varepsilon$ if needed). Every CFG can be converted to CNF by: adding a new start variable; removing ε-rules; removing unit rules $A \to B$; replacing terminals inside long rules by new variables; and splitting rules with more than two variables. CNF matters because every derivation of a string of length $n$ then takes exactly $2n - 1$ steps, which is what the CYK parsing algorithm relies on.

# 10. Pushdown automata

## Definition

A **pushdown automaton** (PDA) is a finite automaton with a stack. A transition is labelled $a, X \to \gamma$: read input symbol $a$ (or $\varepsilon$), pop stack symbol $X$ (or $\varepsilon$), and push the string $\gamma$ (or $\varepsilon$), whose first symbol becomes the new top. The stack starts with a bottom marker, conventionally $Z$. A PDA accepts **by final state** if it can consume the input and end in an accepting state, or **by empty stack** if it can consume the input and empty its stack. The two modes accept the same class of languages. PDAs are naturally non-deterministic, and the non-deterministic PDA is strictly more powerful than the deterministic one.

## Example: $a^n b^n$

![A PDA for $a^n b^n$ (n ≥ 0), accepting by final state. It pushes an X for each a, pops one for each b, and accepts only when the bottom marker Z is back on top.](../figures/pda-anbn.png){.narrow}

A run on `aabb`, written as (state, remaining input, stack with top on the left):

| Step | Configuration | Transition used |
|---|---|---|
| 0 | (q0, aabb, Z) | start |
| 1 | (q1, abb, XZ) | a, Z → XZ |
| 2 | (q1, bb, XXZ) | a, X → XX |
| 3 | (q2, b, XZ) | b, X → ε |
| 4 | (q2, ε, Z) | b, X → ε |
| 5 | (q3, ε, Z) | ε, Z → Z, accept |

The final ε-move into the accepting state is guarded by popping and re-pushing $Z$. That guard is the most important detail in the machine: without it, the PDA could enter an accepting state while X's remain on the stack and would wrongly accept `aab`. Most wrong PDAs make exactly this mistake.

::: {.callout .warn data-title="The most common PDA mistake"}
An accepting state that can be reached before the stack has been checked. Always ask: *what is on the stack when I enter the accepting state, and does that guarantee the counts matched?*
:::

## From a grammar to a PDA

Every CFG has an equivalent PDA with three states. Push $S$ and move to a looping state. In the loop, if the top of the stack is a variable $A$, replace it by the right-hand side of any rule for $A$ (an ε-move); if the top is a terminal, it must match the next input symbol, and both are consumed. When only $Z$ remains, move to the accepting state. The PDA guesses a leftmost derivation and checks it against the input.

::: {.callout .try data-title="Try it"}
In the Grammar Studio enter `S -> a S b | eps`, open **Conversion** and press **Animate CFG to NPDA**. Then press **Open in PDA Studio** and run `aabb` and `aab`.
:::

## The pumping lemma for context-free languages

If $L$ is context-free, there is a $p$ such that every $s \in L$ with $\lvert s \rvert \ge p$ can be split as $s = uvwxy$ with $\lvert vx \rvert \ge 1$, $\lvert vwx \rvert \le p$, and $u v^i w x^i y \in L$ for all $i \ge 0$. The proof uses a long path in a parse tree on which some variable repeats.

**Example:** $\{a^n b^n c^n\}$ is not context-free. Take $s = a^p b^p c^p$. Since $\lvert vwx \rvert \le p$, the part $vwx$ cannot contain both $a$'s and $c$'s. So pumping changes the count of at most two of the three letters, and $uv^2wx^2y$ is not in the language. The Grammar Studio's **Context-Free Pumping Lemma** tab walks through this kind of argument for your own language.

## Closure properties

Context-free languages are closed under union, concatenation, star and reversal, and under intersection *with a regular language*, but **not** under intersection or complement. For example, $\{a^n b^n c^m\}$ and $\{a^m b^n c^n\}$ are both context-free, but their intersection is $\{a^n b^n c^n\}$, which is not.

# 11. Turing machines

## Definition

A **Turing machine** has a finite control and an unbounded tape divided into cells, each holding a symbol; cells that have never been written hold the blank symbol (Toc-Suite uses `B`). A transition is labelled $a \to b, D$: if the head reads $a$, write $b$ and move in direction $D$ (left `L` or right `R`). The machine starts in $q_0$ with the input on the tape and the head on its first symbol. It **halts** when no transition applies; it accepts if it halts in an accepting state.

## Example: incrementing a binary number

![A Turing machine that adds 1 to a binary number: move right to the end, then carry leftwards.](../figures/tm-increment.png){.narrow}

A run on `1011` (the head position is in brackets):

| Step | State | Tape | Action |
|---|---|---|---|
| 0 | q_right | [1]011 | read 1, write 1, move R |
| 1–3 | q_right | 101[1] … 1011[B] | scan right to the blank |
| 4 | q_carry | 101[1] | at the blank: write B, move L, start carrying |
| 5 | q_carry | 10[1]0 | read 1, write 0, move L |
| 6 | q_carry | 1[0]00 | read 1, write 0, move L |
| 7 | q_accept | 11[0]0 | read 0, write 1, move R, accept |

The tape now holds `1100`, which is 11 + 1 = 12 in binary.

::: {.callout .try data-title="Try it"}
Load the binary incrementer from the TM studio's library, type `1011` and press Play. The tape panel animates every step; the header shows the head position.
:::

## Variants

- **Multi-tape** machines have several tapes and heads. They are no more powerful than single-tape machines, but can be quadratically faster.
- **Non-deterministic** machines may have several transitions for the same state and symbol; they accept if any branch accepts. They are no more powerful either, because a deterministic machine can explore the branches breadth-first.
- **Linear-bounded automata** may only use the cells that hold the input. They recognise exactly the context-sensitive languages.

All three variants are available in the TM studio's machine-type menu.

## Decidability

A language is **decidable** (recursive) if some Turing machine accepts every string in it and rejects every string not in it, always halting. It is **recognisable** (recursively enumerable) if some machine accepts exactly its strings but may run forever on others. The **halting problem**, deciding whether a given machine halts on a given input, is recognisable but not decidable; the proof is a diagonal argument in which a hypothetical decider is run on its own description. Many other problems are shown undecidable by **reduction** from the halting problem. For finite automata, by contrast, almost everything is decidable: emptiness, membership and, crucially, equivalence, which is why Toc-Suite can check FA answers exactly but can only check Turing-machine answers on finitely many inputs.

# 12. Before the examination

## A checklist for every machine you draw

1. Is there exactly one start state?
2. Should $\varepsilon$ be accepted? Is the start state's accepting flag consistent with that?
3. For a DFA: does every state have exactly one transition on every symbol (or is a trap state understood)?
4. Test the five shortest accepted and the five shortest rejected strings.
5. For a PDA: what is on the stack when you enter each accepting state?
6. For a TM: is there a transition for the blank symbol where the input ends? Does the machine halt?
7. For a transducer: is the output length right (one extra for Moore)?

## How to practise with Toc-Suite

| Goal | Where |
|---|---|
| Build DFAs, NFAs and ε-NFAs from descriptions (120 questions) | FA studio → Practice → *Build from a description* |
| Practise ε-removal, subset construction and minimisation (159 exercises) | FA studio → Practice → *Convert: …* |
| Get hints while drawing | FA studio → Automata Assistant → **Guide me** |
| Mealy and Moore construction and conversion (21 machines) | Mealy/Moore studio → Practice |
| Pushdown automata (33 problems) | PDA studio → Practice |
| Turing machines (20 challenges, tape checked) | TM studio → Practice |
| Grammars, parse trees, CFG → PDA, pumping lemma | Grammar Studio |

Every reference answer in these banks is verified automatically against an independent definition of its language, so if the checker says your answer is wrong, it will also show you a string that proves it.
