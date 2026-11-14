# Part II — Building version three {.part}

January 2026: five studios, one shell, and a library that sorts itself.

# 4. Architectural choices

## No build step

The first decision for version three was that there would be no build step. The application is a set of ES modules loaded directly by the browser. There is no bundler, no transpiler and no framework. Opening `index.html` from a local web server runs the application exactly as it runs in production.

This decision has costs. Without a bundler, every module is a separate network request, and the browser cannot tree-shake unused code. Without a framework, the user interface is built with plain DOM calls and template strings, and keeping the interface consistent with the underlying state is the programmer's responsibility. But for a student project that other students might want to read and modify, the benefits were decisive. Anyone who knows JavaScript can open any file and understand it. The browser's developer tools show the real source, not a compiled bundle. Deployment is copying files. And when a classmate asked how a feature worked, I could point at one file rather than explaining a toolchain.

## One shell, several studios

The second decision came from the failure of the second prototype. Version three has a single entry page, `index.html`, which shows a splash screen and then loads a **studio** for the chosen machine type into the same page. The shell, `unified_main.js`, owns routing (the URL hash `#fa`, `#mm`, `#pda` or `#tm` selects the studio), remembers the last studio used, autosaves the current machine to the browser's local storage every few seconds so that a refresh never loses work, and provides navigation between studios.

![The structure of the application after the November 2026 reorganisation. The same shell-and-studios design existed from January; what changed later is where the files live and the addition of the core engine and the assistant.](../figures/architecture.png)

Each studio has the same shape: an HTML fragment for its controls, a *state* module that holds the current machine together with undo and redo stacks, a *renderer* that draws the machine into an SVG element, a *UI* module that wires up tools and buttons, a *simulation* module, a *file* module for saving, loading and exporting, and a *practice* module. The FA and Mealy/Moore studios build their HTML from template strings inside the shell; the PDA and TM studios fetch their HTML fragments when first opened.

## State as a single object

Each studio keeps the machine it is editing in a single exported object, `MACHINE`, and changes it through a small number of functions. Before every change, the UI calls `pushUndo`, which serialises the current machine onto the undo stack. Undo pops that snapshot back. This is not the most memory-efficient design, since every undo step stores a complete copy, but machines in a course are small and the simplicity is worth it: there is no way for undo to get out of step with the machine, because undo does not try to reverse individual operations.

## The renderer

Drawing automata well is harder than it looks, and the renderer is where the lessons of the first prototype ended up. Each state is an SVG group with a circle, a label and, for accepting states, a second inner circle. The initial state gets an incoming arrow from outside. Transitions between the same pair of states are merged into one arrow with a combined label (`a, b` rather than two arrows). When two states have transitions in both directions, each arrow is curved away from the other so that they do not overlap. Self-loops are drawn as a small loop above the state. Arrowheads are computed so that they end on the edge of the target circle rather than at its centre.

During a simulation, the renderer does not redraw anything; it adds CSS classes to the active state and the transition just taken, and the style sheet handles the highlighting. That separation turned out to be useful much later, when the Automata Assistant needed to mark incorrect states in red: it simply adds another class.

## Hosting and functions

The site is hosted on Netlify as static files. A handful of Netlify Functions (small server-side JavaScript functions) provide the features that need a server: storing submissions in a Postgres database, listing active assignments, saving instructor reviews, and pushing machines into the GitHub repository. Everything else runs in the browser. If the functions are unavailable, the studios still work; only submission and sharing are affected.

# 5. The finite automata studio

The FA studio was the first and is still the largest. It handles DFAs, NFAs and ε-NFAs, and it is where most students spend their time.

![The FA studio. The left panel holds the Automata Assistant and the practice, testing, file and library sections; the canvas shows the minimal DFA for strings ending in "abb".](../media/fa-assistant-build.png){.screenshot}

## Tools

The toolbar has a small number of tools, each also available from the keyboard: add a state by clicking on the canvas, move states by dragging, add a transition by clicking the source and then the target, rename a state, edit a state's properties (initial, accepting), and delete. Transition labels may contain several symbols separated by commas, and the symbol `ε` (or `eps`) marks an ε-transition. An NFA may have several transitions from the same state on the same symbol; a DFA should not, and the validator says so.

## Simulation

Testing a string highlights the path through the machine one symbol at a time, with a speed control. For an NFA, the simulator tracks the *set* of active states, which is both correct and instructive: students can see why an NFA accepts if *any* path accepts. Bulk testing runs many strings at once and reports each result, which is useful for checking an answer against a list from the textbook.

![Simulating "babb" on the DFA. The log at the bottom records each step; the active state is highlighted on the canvas.](../media/fa-simulation.png){.screenshot}

## Conversions, animated

The part of the FA studio I am proudest of from January is the animated conversions. Choosing "NFA → DFA" from the mode menu runs the subset construction on the machine on the canvas, and instead of replacing it instantly, it builds the DFA one state and one transition at a time, logging each step: which subset is being processed, which symbol, what the move and closure produce, and whether the result is a new subset or one already seen. ε-NFA → NFA and DFA minimisation are animated the same way.

![The subset construction for an NFA that accepts strings ending in "abb". Each DFA state is a set of NFA states.](../figures/subset-ends-abb.png){.narrow}

The animations exist because the procedures are the hardest part of the course to learn from a static textbook. Watching the table fill in, and being able to pause and compare it with my own working, was the single most useful study aid I built. It also turned out, much later, to hide two bugs: the January NFA → DFA routine always added an empty `{}` state even when nothing could reach it, and the comparison routine used to check practice answers was confused when the two machines had different alphabets. Chapter 14 tells that story.

## Saving, exporting, sharing

A machine can be saved as JSON (with a title and description, so that it can be added to the shared library), loaded from JSON, and exported as a PNG image for assignments and notes. Loading a file *animates* the machine being drawn, state by state, which looks good in a demonstration but, as November showed, was far too slow for large machines and could collide with a conversion started before the drawing finished.

## Practice

The practice panel offers questions at four difficulty levels for each of DFA, NFA and ε-NFA: one hundred and twenty construction questions in total. "Show solution" draws the reference answer; "Check answer" compares the student's machine with it. In January the comparison ran a list of sample strings through both machines and reported the first difference. That was better than nothing, and it caught most mistakes, but it was not a proof of correctness, and it could not detect when the *reference* answer was wrong.

# 6. The Mealy and Moore studio

Mealy and Moore machines reuse almost everything from the FA studio: the same canvas, tools, undo, saving and library. What changes is the meaning of the machine. A Moore machine stores an output symbol on each state, so adding a state opens a small dialog asking for its output. A Mealy machine stores output on each transition, so transitions are labelled `input/output`.

![A Moore machine that detects the sequence "10" (output 1 exactly when the last two inputs were 1 then 0), shown after a test run. The live I/O trace shows the input and output streams side by side.](../media/mealy-moore.png){.screenshot}

Simulation produces an output string rather than accept or reject, and the studio shows the input and output side by side as the machine runs. The two conversions, Moore → Mealy and Mealy → Moore, are animated like the FA conversions. Moore → Mealy is straightforward: each transition takes the output of the state it enters. Mealy → Moore is not: a Mealy state that is entered with different outputs must be split into one Moore state per output, and the start state needs a copy for the moment before any input is read. That second subtlety is where, months later, I found the conversion could produce a machine with no start state at all.

The practice bank for this studio was the smallest in January (fourteen questions across Moore and Mealy), and it is still the one I would most like to grow, because transducers are where students most often confuse "what the machine remembers" with "what the machine prints".

# 7. The pushdown automata studio

The PDA studio adds a stack. Each transition is labelled with three things: the input symbol to read (or ε), the symbol to pop from the top of the stack (or ε), and the string to push in its place (or ε). The stack is drawn live in the side panel during a simulation, and the header shows the current top of the stack.

![The PDA studio with the classic machine for aⁿbⁿ. Transitions read a symbol, pop a stack symbol and push a string.](../media/pda.png){.screenshot}

## Non-determinism and acceptance

Pushdown automata are naturally non-deterministic: the standard PDA for even-length palindromes must *guess* where the middle of the string is. The simulator therefore explores every possible computation at once, breadth-first, and accepts if any branch accepts. A PDA can accept by final state, by empty stack, or by both, and the studio supports all three.

Breadth-first search over PDA configurations has a well-known trap: a machine with an ε-transition that pushes a symbol can grow its stack forever without reading any input. The January simulator protected itself with a step limit, which meant that some perfectly correct non-deterministic machines were rejected simply because the search ran out of steps before finding the accepting branch. The November version keeps a set of configurations it has already visited and prunes configurations whose stack is taller than the remaining input could ever empty, which removes the problem without a step limit that is too tight.

## The practice bank

The PDA practice bank was the most ambitious in January: thirty-three problems from $a^n b^n$ through balanced brackets, palindromes with and without a centre marker, counting relationships such as "twice as many zeros as ones", and unions such as "$a^i b^j$ with $j = i$ or $j = 2i$". It was also, as Chapter 14 explains, the bank with by far the most wrong answers.

# 8. The Turing machine studio

The TM studio is the most general. A transition reads a tape symbol, writes a symbol and moves the head left or right. The tape is drawn as a row of cells with the head highlighted, and it grows in either direction as the machine moves.

![The TM studio running a binary incrementer on 1011. The tape panel shows the result 1100 with the head position highlighted.](../media/turing.png){.screenshot}

Beyond the standard single-tape machine, the studio supports multi-tape machines (each transition reads and writes a tuple of symbols and moves each head independently), non-deterministic machines (simulated breadth-first, like the PDA), and linear-bounded automata (the head may not leave the cells that held the input). These variants matter in the course because several important results, for example that multi-tape machines are no more powerful than single-tape ones, are easier to believe after watching both run on the same input.

The TM practice bank has twenty challenges across four levels, from "invert every bit" to "accept exactly the strings of the form $w\#w$". Turing machine answers are harder to check than finite automaton answers, because equivalence of Turing machines is undecidable. The checker therefore compares behaviour on every input up to a fixed length, and, since November, compares the final tape as well as the accept/reject decision, so that a machine that halts in the right state with the wrong output is no longer marked correct.

# 9. The library and the commit storm

## A library that sorts itself

From the start I wanted Toc-Suite to have a shared library of machines: examples a student could load, study and modify. The library also had to grow without me editing a JSON file by hand every time a classmate had a good example.

The design that emerged in the first week is a small pipeline. Machines arrive as JSON files in an inbox folder (originally `Data/`, now `data/inbox/`), either committed directly or pushed by a Netlify Function when a student saves to the shared library. A GitHub Action, `build-library.yml`, runs on every push that touches the inbox or the automata folders. It validates each file (every transition must connect states that exist), detects its type, moves it to the right sub-folder (`fa`, `mm`, `pda` or `tm`), removes duplicates, and rebuilds one combined library file per studio. The studios fetch those library files when they open.

![The library pipeline. Students never edit the library files directly; the GitHub Action rebuilds them from the individual machine files.](../figures/library-pipeline.png)

## Four days, more than a hundred commits

The repository history from 4 to 7 January 2026 shows what building that pipeline actually looked like. On 5 January alone there are fifty-nine commits. Many are the same file renamed back and forth between `automata/` and `automata/fa/` while I worked out where the Action expected it. Workflows appear and disappear: an `update_readme_summary.yml` that rewrote statistics into the README, created, edited four times, and deleted two days later because it fought with my own edits; a `create-json-from-image.yml` that tried to turn photographs of hand-drawn machines into JSON and was deleted the same day. The README is renamed to `READ.md` and back twice while I tested whether the Action's README updates were the cause of a loop.

![Commits per day. The January spike is the initial build and the library pipeline; February and March are the classroom features; November is the audit and the assistant.](../figures/chart-activity.png)

It would be easy to present that week as a clean design process. It was not. It was trial and error against a CI system I was learning as I went, with a deadline in the form of a semester that was about to restart. What I learned, and what I would tell anyone building something similar, is that automation which edits the repository it runs in needs to be designed very carefully: it must be idempotent, it must not trigger itself, and it must never overwrite a human's change. The final `build-library.yml` meets all three conditions, and it has run without trouble since, including when the November reorganisation moved every folder it touches.

## Uploads, functions and the database

The last two days of that first week, 6 and 7 January, added the server side: the Netlify Functions that store submissions in Postgres and push machines into the repository, and the package file that declares their dependencies. Most of these arrived as "Add files via upload" commits, because I was developing the functions locally and uploading them through the GitHub web interface, a habit that made the history harder to read and that I have since replaced with ordinary commits.

By the end of 7 January the application had five working studios (FA, Mealy/Moore, PDA, TM and the shared shell), a self-maintaining library and a working submission path. In lines of code, the application was about eleven thousand lines of JavaScript, not counting practice data.
