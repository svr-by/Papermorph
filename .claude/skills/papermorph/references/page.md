# The interactive study page (page mode)

In page mode a chapter is one self-contained HTML file plus its narration audio. There is no engine, no beats,
no storyboard and no camera: the page teaches with four tabs, two to four interactive experiments and a
self-check quiz, and each theory section has an audio clip made with the book's TTS voice. This reference is
the page's contract — [lint.py](../scripts/lint.py) reads the markers it names. The book folder, cover,
contents and registration work exactly as in film mode ([site.md](site.md)).

    site/<book>/chNN/index.html              the page (CSS, JS and SVG inline; nothing external)
    site/<book>/chNN/audio/<lang>/sN.mp3     one clip per theory section, from tts.py
    content/<book>/chNN/narration.<lang>.json   { "voice", "rate", "sections": { "s0": …, "s1": … } }

Start the chapter from [the template](../assets/templates/page.html); keep its ids and wiring, and with them
the names lint reads: `<meta name="papermorph" content="page">` marks the mode; `CH` carries the chapter
number and the next-chapter link; `AUDIO` is the clips folder and must match `<html lang>`; `SECTIONS` lists
the section ids that have audio; `L` holds the UI strings; every audio button carries `data-sec`. Translate
the labels and set the language before the pilot. Sections: `s0` is the lead card (the book's opening
question), `s1 …` follow the book's sections in order; every id in `SECTIONS` must have a clip, and every
`data-sec` must be in `SECTIONS`.

## Fidelity and language

Write all page text in the book's language. Stay faithful to the textbook: same terminology, same order of
topics, same formulas and their numbering (1), (2) …, same units (SI). Do not invent facts, formulas or
definitions; life examples and simpler wording are welcome when they stay correct. Double-check every number
in examples, steps and quiz answers before writing them.

## The page

Toolbar with a light/dark theme toggle; then the title, styled like the book (§ number
+ title, accent colour); then the lead card; then the tab bar — only one tab visible, the active button
highlighted, switching tabs stops the audio and scrolls to the bar:

1. 📖 **Theory** — the book's sections in the book's order, an h2 per section.
2. 🧮 **Formulas** — the formula card.
3. ✏️ **Worked problems** — the book's worked example plus exercises.
4. 🎯 **Practice** — control questions and the self-check quiz.

A footer returns to the contents (`../#chNN`) and, once it exists, to the next chapter (`CH.next`).

## Tab 1: Theory

- Rewrite each section in short sentences, two to four per paragraph, plain wording; keep the book's terms,
  bold on first use, then no synonyms. A dense source formulation is re-said simply before it is used.
- Frame each definition and named rule in a `.def` box that opens with a `.tag` chip («определение»,
  «правило» — translate for the book), not in larger type; the chip labels match the formula cards' tags.
- After each section a "🌍 In real life" block (translate the label): a bordered paragraph with one to three
  vivid, correct everyday examples from a child's world — pizza, carousel, bicycle, clock hands, kitchen,
  sport — with realistic numbers where numbers appear.
- Interactive experiments sit inside the theory, right after the section they illustrate.
- End the tab with the book's "Main conclusions" box (warm tint).
- Every section has 🔊 Listen and ⏸ Pause buttons (Pause toggles to ▶ Resume); the clip is that section's
  `sN.mp3`. One clip at a time; switching tabs or sections stops the audio.

## Narration

One clip per section, ids matching `SECTIONS`: the section's h2, its paragraphs and its life example, written
for the ear — short sentences, symbols and units said in words ("omega", "radians per second"), the page shows
the symbols. Sections take no `[[marks]]` (nothing on the page waits for a word). Voice, rate and engine come
from `style.json`; `tts.py` writes the clips and a `timings.js` of durations that the page does not load but
lint checks against the narration. Experiments and quiz text are never narrated.

## Tab 2: Formulas

A card per formula, each opening with a small tag chip — its kind («определение», «правило», «свойство»,
«таблица» — translate for the book) or the book's formula number: the formula in large type, a one-line
plain-language meaning, the SI unit where relevant. One colour per quantity, fixed in `style.json`
`look.meaning` and reused in the theory, the experiments and the problems. A final Symbols card lists every
letter and what it means; add the chapter's useful conversion facts.

## Tab 3: Worked problems

The book's worked example plus two or three exercises from the book's exercise set, solvable from the chapter's
content and covering different formulas. Each problem: the full statement, then a small SVG figure in the
book's manner whenever the book has one (`.psvg`, the chapter's palette colours, the unknown marked «?»),
then steps revealed one at a time (Show step / Show all / Reset). In every figure label the foot of a drawn
height (H) and keep each label a few pixels clear of lines, arcs and neighbouring labels — the acceptance
pass zooms figures and rejects touching labels; prefer whole-number coordinates. The first step restates
what is given and what to find and converts to SI; each step is one short sentence with its formula and
substituted numbers and names the tagged formula it uses; the last step is "Answer: …".

## Tab 4: Practice

- **Control questions**: the book's questions, each a collapsible `<details>` with a short, correct answer
  (soft tint).
- **Check yourself**: 12–15 multiple-choice questions, 3–4 options each — definitions, units, formula use with
  simple numbers, conceptual traps. Options shuffle deterministically (not always correct first). A click on
  the right option turns it green with a short explanation; a wrong one turns red with a gentle hint and the
  child tries again. Kind wording only. "Correct answers: X of N" counts each question once, by its first
  attempt — the quiz's end also marks the chapter done on the shelf. A question whose options lean on letter
  notation (a, b, c …) carries the small notation figure (`.psvg`, the theory's triangle and colours) right in
  the card — never assume the child remembers which letter is which side. Feedback shown after a click is
  added dynamically: if it carries TeX, typeset it with `MathJax.typesetPromise([feedback element])`.

## Experiments

Two to four per chapter, chosen to fit the topic (motion, circuits, waves, optics, geometry constructions,
number-line and fraction visualisers; for non-physics subjects the best manipulable model — a sorter, a
matcher, a builder). Each experiment:

- several sliders, each labelled with its symbol, live value and unit;
- live outputs computed with the chapter's formulas, in the same quantity colours, so the child can verify a
  formula by reading the numbers (N / t gives ν);
- checkboxes to show or hide elements such as vectors;
- Pause/Play and Reset for anything animated;
- one hint line: what to try and what to notice.

SVG + vanilla JS, animated with requestAnimationFrame. Arrows have proper arrowheads; everything stays inside
the viewBox at the slider extremes; the loop keeps running with a tab hidden and never throws.

## Dyslexia-friendly design

Soft cream background, dark grey text, good contrast; a dark theme with the same tokens (follow
`prefers-color-scheme`; the manual toggle overrides it). Verdana, Tahoma, Arial; base 20 px;
line-height ≈ 1.9, letter-spacing ≈ 0.04em, word-spacing ≈ 0.12em; left-aligned, never justified; content
width ≈ 40–42 em; no italics, no long ALL CAPS, no underlines except links. Short paragraphs, rounded cards,
one idea per card; colour helps but never carries the meaning alone. Large tap targets, no time pressure, no
flashing, no auto-playing sound. The tinted boxes: conclusions warm yellow, control questions soft pink,
worked problems soft blue.

## Technical requirements

- One file, everything inline (CSS, JS, SVG); no external scripts, fonts, images or network requests; no
  localStorage dependence beyond the optional progress write (wrapped in try/catch). The one allowed extra is
  `lib/mathjax.js` from the book's own folder, for a book whose pages use LaTeX formulas:
  run `engine.py site/<book> --latex` once, load `<script src="../lib/mathjax.js"></script>` right before the
  page's inline script and write TeX inline in `\( … \)` (in JS strings: `\\(`). MathJax typesets the finished
  page by itself; content added later (revealed steps) needs `MathJax.typesetPromise([element])`. Decimal
  commas inside math: `0{,}7071`; `tg`/`ctg` need `\operatorname{}`. The page-wide `svg { … }` rule must be
  scoped off MathJax's inline SVG (`mjx-container svg { width:auto; max-width:none; display:inline; margin:0 }`;
  give `mjx-container` itself `max-width:100%; overflow-x:auto` and split long formula chains into several
  `\( … \)` pieces so they can wrap).
  Strings carrying TeX go in through `innerHTML`, everything else stays `textContent`.
- SVG attributes take a decimal point, never a comma: helpers like `f()` format with the book's comma for
  on-screen text — their output must never feed a `path`, `transform` or coordinate (in `91,1` the comma
  reads as two numbers). Commas are for text nodes only; static figures read best on whole numbers.
- Keep a closing «;» or «.» with the word before it (`&nbsp;`) so punctuation never opens a line alone —
  this matters in long enumerations («а) …&nbsp;; б) …&nbsp;.») and at the end of multi-part statements.
- Colours as CSS variables on `:root`, dark values under `@media (prefers-color-scheme: dark)` guarded as
  `:root:not([data-theme="light"])` and again under `:root[data-theme="dark"]`; the body has an explicit
  background.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`; keep content
  clear of phone system bars with `env(safe-area-inset-*)`; `html { scroll-padding-top: … }`.
- Responsive from 360 px: SVGs `width: 100%` with a max-width, output grids collapse to one column, no
  horizontal page scroll.
- Typographic punctuation in visible text (« » for Russian); straight quotes inside code. Build repeated
  items (formula cards, problems, quiz, collapsibles) from JS data arrays with `textContent`, except strings
  that carry TeX (those go through `innerHTML`, see above).
- Favicon: one fitting emoji as a data URI. Title: "§ N. <chapter title>". Aim for under ~60 KB.

## Progress and registration

The page writes the same progress key the contents page reads (`animebook:progress:<book path>`): `last` on
open, `done` when every quiz question has received its first attempt. The template's bridge does both; keep it
wrapped in try/catch. Register the chapter exactly as in film mode: the contents entry, the previous
chapter's next link (`CH.next` in the page), `chapters.md`. `engine.py` still provisions `lib/` — the contents
page runs on it; the page itself loads none of it, except `lib/mathjax.js` in a book whose pages use LaTeX.

