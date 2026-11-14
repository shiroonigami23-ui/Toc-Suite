# 13. How the class used it

## Three patterns of use

Watching classmates use Toc-Suite over the spring taught me more about its design than any amount of testing on my own. Three patterns of use stood out, and each one pushed the design in a particular direction.

The first pattern was **checking homework**. A student would solve a problem on paper, draw the answer in the FA or PDA studio, and run the strings from the question. This is the use I had built the tool for, and it worked well for finite automata, where the strings in a textbook question usually include the tricky cases. It worked less well for pushdown automata, because students would run three or four strings of the "right shape" and stop. That is exactly the behaviour that let my own wrong PDA answers survive, and it is the reason the November PDA checker tests every string up to length six over the problem's alphabet instead of a short fixed list.

The second pattern was **learning a procedure**. Students preparing for an examination would load an NFA from the library and run the subset construction with the animation slowed down, pausing at each step to compare with their own table. Several asked for a way to practise the procedure itself rather than just watch it, which is what the conversion practice added in November finally provides: the machine to convert is drawn for you, you perform the conversion, and the checker tells you not only whether the language is right but whether the result is actually a DFA, or actually minimal.

The third pattern was **studying together**. Groups of two or three would sit around one phone, one person drawing while the others suggested changes. In that setting the canvas is small and attention is shared, and what helps most is a single, clear message about what is wrong. That observation shaped guided mode more than anything else. The assistant shows the most useful problem first, in a sentence, with a button that runs the string that proves it, rather than a list of every difference.

## What students asked for

The requests that came back most often were, roughly in order: "tell me *which* string fails, not just that it fails"; "let me practise conversions"; "it is too small on my phone"; "the loading animation is slow"; and "let me draw it myself but stop me when I go wrong". Every one of those is addressed by the November work, and the order of the list is close to the order in which they were tackled.

There were also requests I decided against. Several students asked for the practice checker to show the reference answer automatically after a wrong attempt. I kept "Show solution" as a separate, deliberate action, because seeing the answer immediately after a mistake removes the most valuable part of practice, which is finding the mistake yourself. Guided mode is the compromise: it never shows the answer, but it never leaves you stuck either.

## Phones first

The single most important fact about the class's usage is that most of it happened on phones. That was not what I had designed for in January; the canvas was sized for a laptop, and the side panel was simply squeezed. The phone fixes in November (a minimum canvas size with scrolling, a compact zoom control, a drawer that does not leave empty space) were overdue, and in hindsight I should have tested on a phone from the first day. Every new feature is now checked at phone, tablet, laptop and desktop sizes before it is committed.

![The splash screen. Every studio is one tap away; the footer links to the privacy policy and shows the keyboard-shortcut hint.](../media/splash.png){.screenshot}
