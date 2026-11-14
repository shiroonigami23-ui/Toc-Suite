# Part III — For the class {.part}

February and March 2026: assignments, quizzes, an instructor's portal and a Grammar Studio.

# 10. Assignments, quizzes and the portal

## From a tool to a classroom

Once classmates were using Toc-Suite regularly, the natural next request was a way to hand in work. Until then, "submitting" an automaton meant exporting a PNG and sending it in a chat group, which loses the machine itself: an image cannot be simulated, compared or corrected. On 21 February 2026 I committed the first version of a submission system, and on 26 February a dedicated review page for the instructor.

## How a submission flows

The flow has three parts.

First, an instructor creates an **assignment** through the portal page. An assignment has a title, a machine type (FA, Mealy/Moore, PDA or TM), a mode (*practice*, which can be submitted repeatedly, or *quiz*, which is stricter) and an active window. The `create-assignment` function stores it.

Second, when a student saves a machine in a studio, the client asks the `list-active-assignments` function whether an assignment of that machine type is open. If one is, the student is asked whether this save is a submission. Saying yes requires a college email login of the form `0902CS231028@rjit.ac.in`; the roll number is derived from the email, and the identity is locked for the browser session so that it cannot be changed between submissions. The `save-to-db` function stores the machine, the student's identity and the assignment in Postgres.

Third, the instructor opens the portal's review page, which lists submissions per assignment through `get-submissions`, lets the instructor open any machine directly in the matching studio, and records a review with `save-review`.

## Small defences

A submission system invites gaming, and a few simple defences went in from the start. The email must match the college domain and the roll-number pattern. The identity locks for the session. Each submission carries a coarse device signature (browser, language, time zone and screen size, encoded rather than stored as raw fields) so that an instructor can notice one device submitting for several students. None of this is security in a strong sense, and the policies page now says so plainly, but it is enough to keep a practice system honest.

## What I would do differently

The portal was built quickly and it shows. The review page and the portal page each contain a lot of inline script, and the boundary between "save to the shared library" and "submit to an assignment" was, for a while, confusing to students: an ordinary save was also copied to the review queue without the student necessarily realising. In November I made that explicit. The settings page now has a switch, on by default, that controls whether ordinary saves are shared with the class review queue, while assignment submissions are always sent because that is their purpose. The new privacy policy describes exactly what is sent and when.

# 11. The Grammar Studio

## Why a separate studio

Context-free grammars are the other half of the context-free story. A pushdown automaton recognises a language; a grammar generates it. The course expects students to move between the two, to build parse trees and derivations, and to use the pumping lemma for context-free languages to show that some languages, such as $a^n b^n c^n$, are not context-free. None of that fits naturally on an automaton canvas, so the Grammar Studio has its own page with tabs.

![The Grammar Studio as it is today, after the version 2.0.0 rebuild described in Chapter 21: the grammar on the left, its classification, sets and shortest strings on the right, and a navigation bar to every studio.](../media/grammar.png){.screenshot}

## What it did in February

The **CFG input** tab accepts a grammar in a readable form such as `S -> a S b | eps` and validates it: undefined non-terminals, unreachable productions and malformed rules are reported.

The **conversion** tab builds a non-deterministic PDA from the grammar using the standard construction: push the start symbol, then for every production add a transition that replaces the non-terminal on top of the stack with the right-hand side, and for every terminal add a transition that matches it against the input. The construction is animated as a numbered list of steps, and the resulting PDA can be downloaded as JSON or opened directly in the PDA studio, where it can be simulated on real strings.

The **parse tree** and **derivation** tabs generate a leftmost derivation for an input string and draw the corresponding tree, which is the most direct way to see what "ambiguous grammar" means.

The **regular and recursively enumerable language** tabs connect the grammar world to the other studios: a right-linear grammar or a regular expression can be converted and opened in the FA studio or the Mealy/Moore studio, and a description of a recursively enumerable language can be turned into an editable starting machine in the TM studio.

The **pumping lemma** tab is a proof planner rather than a prover. It walks through the structure of a pumping-lemma argument for a context-free language (choose $p$, choose a string, consider every split $uvwxy$, pump) and helps the student fill in each step for their own language.

## Cross-studio routing

The Grammar Studio is the reason the shell gained *smart routing* in February. A machine produced by one studio can now be handed to another: the grammar's PDA opens in the PDA studio, a regular expression opens in the FA studio, and a file of any machine type loaded in the wrong studio is sent to the right one instead of failing. The router stores the machine to hand over in session storage, switches studio, and the destination studio picks it up on load.

# 12. Help, settings and phones

## A help page that teaches

The help page started as a list of buttons and their meanings. On 21 February I rewrote it as an interactive guide: an accordion of sections that remembers which ones were open, studio-by-studio *playbooks* that walk through a typical task, common pitfalls (an initial state with no outgoing transitions; a PDA that never empties its stack; a Turing machine with no transition on the blank symbol), and a checklist a student can tick through before submitting.

It was useful, but it looked like what it was: a long page of collapsed boxes, with a search field in a coloured banner and a single "Back to Menu" button. For version 2.0.0 I rebuilt the page around what a new user actually needs, in the order they need it. A sticky contents bar jumps to a four-step quick start, a guide to the Automata Builder and the Assistant panel with example phrasings that work, the studio playbooks, a keyboard-shortcut sheet, cards linking to all ten study papers, and the download links for the apps. The February theory labs (Arden's lemma, the closure-property table, the machine recommender, the L-system explorer, the LBA boundary checker, the pumping-lemma coach and the quiz) are still there, under a searchable *Theory labs* section. The header now carries the same navigation bar as the Grammar Studio, so Home, Help, Settings and the studios are always one click away.

![The rebuilt help page: quick start, the Builder and Assistant guide, and a contents bar that stays at the top while scrolling.](../media/help.png){.screenshot}

## Settings

The settings page gives each student a display name, a college email identity for submissions, a theme, a text size and a motion preference, with presets for "focus" and "calm" and the ability to export and import settings as a file. In November it gained an animation-speed setting that applies to every animation in the application, the sharing switch described above, a button to erase all local data, and links to the new privacy, terms and accessibility page.

The page had one persistent annoyance: nothing was saved until the student pressed a floating *Save All Settings* bar, which on smaller screens sat on top of the very controls it was meant to save. In version 2.0.0 every control saves the moment it changes and confirms with a small toast, so the bar is gone. Themes are chosen from four colour cards, text size, motion and drawing speed are segmented toggles beside a live preview, and a *Presenting* preset (largest text, slow drawing) joins *focus* and *calm* for use on a classroom projector. The identity section now says plainly whether the student is signed in and offers sign-out; an *About* card shows the version, whether the app is running on the web, Windows or Android, and links to the downloads and the changelog. Every storage key from the old page was kept, so nobody lost their settings.

![The rebuilt settings page. Every change is saved immediately; the preview strip follows the chosen theme.](../media/settings.png){.screenshot}

## Phones

Most of my classmates use Toc-Suite on a phone, and phones were a constant source of small problems. The control panel becomes a slide-in drawer below a certain width, and on 20 March 2026 I fixed an accessibility problem where the drawer toggle in the Grammar Studio could not be reached. But the deeper phone problems were not fixed until November: on a narrow screen the 1400-by-900 drawing area was scaled down until states were seven pixels wide, the zoom control stretched into a tall white bar over the canvas, and the Grammar Studio left a large empty band where the hidden drawer still occupied space. Chapter 17 describes those fixes.
