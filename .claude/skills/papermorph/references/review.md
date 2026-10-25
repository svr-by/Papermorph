# Delivery pass

Serve `site/` with `python3 SKILL/scripts/serve.py 8765 site` (no browser caching, so an engine edit is never hidden by a stale file). Use this pass once per chapter: watch, fix what you find, recheck those parts, then deliver for the user's judgement of aesthetics, pacing and teaching. Offer the chapter URL with `?review` added: the user can press N at any moment to leave a note and Shift+N to copy them all for you, each with the `?beat=N&t=S` that opens that frame. Keep the evidence in `books/<book>/review/chNN/`.

## Watch it in motion

```sh
uv run --with playwright --with pillow --with numpy SKILL/scripts/strip.py chNN OUT --url http://localhost:8765/<book>/ push/0.25 law3/0.5@w roll/0.2@o
```

A strip shows one beat at small steps; `@w` adds a motion WebP; `@o` adds an onion skin, the same frames laid over each other in one picture, later ones stronger, so spacing reads at a glance: even gaps are even speed, bunched ghosts are easing in or out, a ghost that jumps is a pop. Look at each action as a viewer would: do actors perform what the narration says, do props stay on the hands, does the camera move with purpose, does each frame still match the storyboard, do arrows, labels and readouts agree with the motion? Then watch a few beats live in Firefox with sound, which is how the user watches. In a tier 0 (`slides`) chapter the hold is the form: judge whether the entrances landed and the ambient loops keep the frame alive, not whether the picture changes.

Watch every beat to its end, question cards included; problems hide in the beats nobody looked at. A strip is a row of still pictures, so it cannot tell you that nothing is moving: a wave drawn once at a fixed phase looks right in every frame and is dead on screen. `uv run --with playwright --with pillow SKILL/scripts/still.py chNN --url …` lists the stretches of each beat where the stage does not change. Some holds are right (a moment to read a result); a wave, a ray of light or an actor that stands for something in motion should be moving whenever it is on screen, because the motion is what it explains.

## Static checks first

`python3 SKILL/scripts/lint.py site/<book> chNN` takes a second and needs no browser: a global name that clashes with the engine or a library (which stops the page script), beats without timings or MP3, marks the code waits for that the narration lacks, narration edited since `tts.py` ran, and a malformed `style.json`. Run it after every edit, before the passes below.

## Page mode

`lint.py` detects a page chapter by its `<meta name="papermorph" content="page">` marker and checks the page contract instead: ids the script reads, the tab bar and the four tabs, the SECTIONS/audio/narration agreement, narration staleness, duplicate and external references, global clashes, viewport, title and size. A page needs no strips, overlap, perf or e2e: it has no timeline. The other automated pass is `pageshot.py`, which audits in a browser everything no eyes should be spent on and captures the frames for visual acceptance:

```sh
uv run --with playwright SKILL/scripts/pageshot.py <book> chNN                          # audit + 9 frames
uv run --with playwright SKILL/scripts/pageshot.py <book> chNN --only task,quiz_dark    # re-shoot after a fix
```

It exits non-zero on any failure: console errors, a tab not switching, a section clip not answering 200, sliders pushed to both extremes while anything leaves its SVG's viewBox (measured in screen coordinates, so a rotated car's wheels count; MathJax glyphs are exempt), task-figure labels colliding, the quiz not scoring each question exactly once or not marking the chapter done, the theme not toggling, page or formula overflow at 360 and 390 px, a broken footer link. Fix and rerun until it prints `AUDIT: PASS` — that machine gate is free; do not spend a worker's tokens on what it already checked.

What remains for eyes is aesthetics: did the design land. The script saves small element captures (a def box, formula cards, a problem with its figure, revealed steps, the quiz in the dark theme, two phone frames) under `books/<book>/review/chNN/pages/`. Hand that folder to one multimodal worker (pm-small in [team.md](team.md) terms) in a single pass; for a book's first chapter add `--full` (every def, formula card, figure and steps card). After a fix, re-shoot only what changed with `--only name1,name2` and have the worker re-judge just those frames — never re-review a whole chapter over a one-label fix. Element captures replaced full-page screenshots on purpose: the target is guaranteed in frame and each PNG is a fraction of the size, so a review pass costs minutes and a few hundred K tokens instead of hours and millions.

## Frames and openings

```sh
uv run --with playwright --with pillow SKILL/scripts/shot.py chNN --url http://localhost:8765/<book>/ --out OUT
uv run --with playwright SKILL/scripts/check_blank.py site/<book> chNN --url http://localhost:8765/<book>/
uv run --with playwright SKILL/scripts/overlap.py chNN --url http://localhost:8765/<book>/
```

`shot.py` captures open/end frames of every beat as 4-up sheets and reports console errors. Look for an empty or unrelated opening, text over drawings or clipped at the edge, a card covering what it asks about, leftovers half faded, geometry contradicting its values, shapes inside circles or curves crossing the outline (check thin geometry on the full-size `chNN_bII_T.png`, not only the sheet), text too small at half size or too much at once, and the same idea in different colours. An end frame is taken seconds after the beat ends, so a beat that fades its picture before its narration ends shows an empty end frame by design; check a live frame (`?beat=N&t=<dur − 1>`) before calling that a bug. `check_blank.py` reports openings empty for more than a second after speech starts. `overlap.py` samples every beat and lists where an arrow runs through text or two texts collide, with times, so you can look at exactly those frames; exponent digits beside their base, an eqLine's own sign and neighbouring glyphs of one formula are expected pairs — act on whole words or labels colliding.

## Smoothness

`uv run --with playwright SKILL/scripts/perf.py chNN --url …` measures frame times in Firefox, which repaints SVG on the main thread and is the slowest common browser for these pages; headless Chromium hides paint cost. Look at the worst beats and transitions; the remedies are in [engine.md](engine.md#performance-firefox).

## Interaction tests

Adapt `assets/templates/e2e.py` into `tools/<book>/e2e_chNN.py`: it checks playback, that every beat replays the same frame when seeked, that quiz cards stay readable and on stage at two viewport sizes, and walks the answers, practice and finish card. Run it in Chromium and with `BROWSER=firefox`. Run existing tests of approved chapters after changing the book's engine or library. Feedback text comes from the book's language: assert on the word `translate('correct')` yields («Верно» in ru), not the English one.

After scoring changes, check a wrong first try stays recorded after revisiting and a restart clears it; after progress changes, check book isolation and missing or malformed stored data. Fix engine bugs at the engine source and copy them to the books with `scripts/engine.py`; book-specific settings stay in each book's `lib/book.css`.

Test details: keyboard first (Enter checks, Esc leaves a box, press Esc before S, R replays on the finish card); a page opened with `?beat=` is not started, so start it before pressing keys; `seek(i, false)` stops before the old panel's fade, so seek playing or evaluate past it; compare text in lower case (CSS uppercases kickers); avoid assertions on totals that grow with the book; Python's server lacks Range requests, so let audio play rather than setting `currentTime`.
