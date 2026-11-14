# Part I — Beginnings {.part}

Why a student builds a tool instead of just studying, and what the subject asks of that tool.

# 1. Why Toc-Suite exists

## The problem in the classroom

Theory of Computation arrives in the third year of the B.Tech Computer Science programme at Rustamji Institute of Technology, and for many students it is the first course that feels genuinely abstract. Data structures and operating systems have obvious running examples; a finite automaton is a drawing on paper that is supposed to "accept a language", and the only way to know whether the drawing is right is to reason about every string it might ever see.

That last point was the source of most of my frustration. When I drew a DFA for "binary strings with an even number of zeros and an odd number of ones", I could test it on five or six strings in my head, but I had no way to know whether it was correct for all of them. The textbook answers were sometimes drawn differently from mine, with states named differently, a trap state included or omitted, or transitions merged on a single arrow. Comparing two drawings by eye is unreliable, and asking a teacher to check every homework drawing is not practical for a class of sixty.

The conversions were worse. The subset construction that turns an NFA into a DFA is mechanical, but it is long. A four-state NFA can produce eight or more subset states, and one wrong closure early in the table silently corrupts everything after it. Minimisation has the same character: a partition table that must be refined until it stops changing, where one missed distinction leaves two states merged that should be separate. These are exactly the procedures that a computer does perfectly and a tired student does badly at eleven at night.

## What already existed

I was not the first person to want a tool for this. JFLAP is the standard teaching tool and is excellent, but it is a Java desktop application. Installing a Java runtime on a lab machine or on a phone is a hurdle that many classmates never got past. On my phone I used an Android port of the same ideas (the repository still contains a screenshot of it from October 2025, which I kept as a reference for layout), but it was limited to finite automata and could not share work with anyone.

Several websites could draw a DFA from a regular expression or simulate an input string, but each covered only a slice of the syllabus. None of them covered the whole path from finite automata through Mealy and Moore machines, pushdown automata and Turing machines, and none could check a student's answer against a reference other than by running a handful of test strings.

## The first goal

The goal I wrote down at the start was simple: a single web page that works on a phone, covers every machine in the syllabus, can save and load machines as files, and can tell me whether my automaton is correct. "Correct" had to mean correct for every string, not for the five strings I happened to try.

That goal turned out to be harder than it sounds, and the last part of it, real correctness checking, was only fully achieved in November 2026. But it set the direction for every decision that followed: no installation, no build step, everything in the browser, and machines stored as plain JSON that a student can download, share and reload.

## From my problem to the class's tool

The second motivation arrived once the first version worked. Classmates who saw it on my phone asked for the link. Juniors preparing for the same course asked whether they could practise with it. Within a few weeks the question was no longer "can this help me study" but "can this help a class study", and that question brought new requirements: practice questions with answers, a way to submit work, and a way for an instructor to see what had been submitted. Those requirements shaped the February and March phases described in Part III.

Looking back, the project has always had these two faces. It is a tool I built for my own understanding, and it is a tool I maintain for other students. The first face explains why the code favours transparency (every conversion can be animated step by step) over cleverness. The second explains why, in November, I became so concerned with whether the reference answers were actually right.

# 2. The subject in one chapter

The rest of this book assumes a working map of the subject. This chapter gives that map briefly; the companion *Study Guide* covers it properly.

## The hierarchy of machines

Theory of Computation studies what different kinds of abstract machine can compute, and the classic organising idea is the Chomsky hierarchy. Each level of the hierarchy corresponds to a kind of grammar and a kind of machine, and each machine is strictly more powerful than the one below it.

![The hierarchy of languages and the Toc-Suite studio that covers each level.](../figures/chomsky.png){.narrow}

**Regular languages** are recognised by finite automata: machines with a fixed, finite number of states and no other memory. Deterministic finite automata (DFAs) have exactly one move for each state and symbol; non-deterministic finite automata (NFAs) may have several, or none; ε-NFAs may also move without reading a symbol. All three recognise exactly the same languages, and regular expressions describe the same class again. In Toc-Suite these live in the **FA studio**.

**Finite-state transducers** are not a separate level of the hierarchy, but they are part of the syllabus: Mealy and Moore machines have the same finite memory as a DFA but produce output as they read. A Moore machine attaches output to states; a Mealy machine attaches it to transitions. They live in the **Mealy/Moore studio**.

**Context-free languages** need one unbounded stack. A pushdown automaton (PDA) is a finite automaton with a stack it can push to and pop from, and it recognises exactly the languages generated by context-free grammars. The classic example is $a^n b^n$: equal numbers of a's followed by b's, which no finite automaton can recognise because it would need to count without limit. These live in the **PDA studio** and, from the grammar side, in the **Grammar Studio**.

**Context-sensitive and recursively enumerable languages** need a tape. A Turing machine reads and writes an unbounded tape and can move in both directions; it is the standard model of general computation. A linear-bounded automaton is a Turing machine restricted to the portion of tape that holds its input. These live in the **TM studio**, which also supports multi-tape and non-deterministic variants.

## The procedures a student must learn

Beyond drawing machines, the syllabus is built around procedures:

- **ε-removal**: turning an ε-NFA into an NFA by computing ε-closures.
- **Subset construction**: turning an NFA into an equivalent DFA whose states are sets of NFA states.
- **Minimisation**: merging equivalent states of a DFA by partition refinement until no two remaining states can be distinguished by any input.
- **Regular expression to automaton**: Thompson's construction, which builds an ε-NFA piece by piece from the expression.
- **Moore ↔ Mealy conversion**: moving output from states to transitions and back, which may split states.
- **CFG to PDA**: building a pushdown automaton that simulates leftmost derivations of a grammar.
- **Pumping lemmas**: arguments that a language is *not* regular or *not* context-free.

Each of these became a feature, and several of them became the source of bugs that the November audit uncovered. That is not a coincidence: a procedure that is easy to describe but long to carry out is exactly where both students and software make mistakes.

## What "correct" means

A recurring theme in this book is the difference between an automaton that *seems* right and one that *is* right. Two automata are equivalent if they accept exactly the same set of strings. For finite automata, equivalence is decidable: we can build the product of the two machines and search for a string that one accepts and the other rejects. If no such string exists, they are equivalent; if one exists, the shortest such string is the most useful possible feedback to a student, because it is a concrete counterexample.

The early versions of Toc-Suite checked answers by running a list of sample strings. That is not the same as checking equivalence, and Chapter 14 explains how much difference it made.

# 3. Before version three

The live site is called `toc-suite`, and the name is honest: there were two earlier attempts before the version that is in this repository.

## The first prototype

The first prototype was a single HTML file with a canvas and some JavaScript. It could add states, connect them with arrows and run a string through a DFA. It had no undo, no saving, and no idea what an NFA was. Its main value was teaching me how awkward it is to draw arrows between circles: self-loops, two arrows in opposite directions between the same pair of states, labels that overlap, and arrowheads that end inside the circle instead of on its edge. Every one of those problems reappears in the later code, and the solutions in the current renderer (curved paired edges, offset self-loops, labels placed at the midpoint of the curve) were first worked out, badly, in that file.

## The second prototype

The second attempt tried to cover more of the syllabus by giving each kind of machine its own page. It worked, in the sense that each page did its job, but the pages shared almost nothing. Each had its own copy of the drawing code, its own idea of what a saved file looked like, and its own bugs. Fixing a rendering issue in the DFA page did not fix it in the PDA page. When I added undo to one page I had to add it four times.

The lesson from the second prototype was architectural. The machines differ in what their transitions mean, but they share almost everything else: states with positions, transitions between states, a canvas, tools for adding and moving and deleting, undo and redo, saving and loading, a log of what happened. Version three was designed around that observation: one shell application that loads a *studio* for each kind of machine, with shared utilities underneath.

## What carried over

Two decisions from the prototypes survived unchanged. The first is the file format. A machine is a JSON object with a `type`, a list of `states` (each with an `id`, a position, and flags such as `initial` and `accepting`) and a list of `transitions` (each with `from`, `to` and whatever the machine type needs: a `symbol` for a finite automaton, `pop` and `push` for a PDA, `read`, `write` and `move` for a Turing machine). That format is human-readable, easy to diff in Git, and simple enough that classmates could write machines by hand.

The second decision is SVG for drawing. A canvas element would have been faster for very large machines, but SVG elements can be styled with CSS, highlighted during a simulation by adding a class, exported as an image, and inspected in the browser's developer tools. For machines with tens of states, which is what a course uses, SVG is more than fast enough.
