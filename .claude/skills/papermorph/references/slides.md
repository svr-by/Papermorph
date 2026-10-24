# Static slides (tier 0)

For definitions, worked examples, summaries and revision material — any book that wants a calm pace. The beat's picture is composed once, revealed as the narration starts and then holds; gentle ambient motion keeps the frame alive, and the narration and the questions carry the change. The cheapest tier to make: a beat composes the book's slide kit instead of drawing.

- **One reading line**, as in every tier: the eye is never sent hunting — a definition reads top down, a worked example step by step, a summary in numbered rows.
- **Reveal, then hold.** Tie entrances to marks so they follow the speech: `fade` for blocks, `rise` for a new point, the engine's `draw` for a rule or diagram. After the last entrance nothing in the frame changes but the ambient loops — a slide never rearranges itself mid-beat ([authoring.md](authoring.md#beats)). The engine's opening lead-in already nudges a late first entrance earlier; `{ lead: false }` opts out.
- **Ambient motion is decoration, not argument.** One gentle loop (sway, bob, slow spin, pulse) on one accent element per slide is enough; it is a periodic pure function of `t` through `clockRun`, so pause, seek and `?beat=N&t=S` all show the same frame. Two loops on one element? Nest groups.
- **Questions carry the practice.** `quiz`, `blanks` and `grid` keep the reader acting; a slides chapter usually asks more often than an animated one, since the picture does not demonstrate.
- **Vary the composition with the content**: a definition card, a worked example, a big formula on the open board, a two-column compare — not one centred card after another.
- **Draw in code first.** Slides keep one clean vector look: graphs, schemes and arrows come from the kit and the engine, and the objects a subject needs — a car, a person, a kettle — are drawn once into the book's library ([assets.md](assets.md)). Sourced pictures are the exception, with its own rules ([Pictures](#pictures) below).

## The slide kit

Each tier 0 book starts a kit: copy `SKILL/assets/templates/slides.js` to `site/<book>/lib/slides.js`, load it after `engine.js` in every chapter, and adapt the look — head strings, colours, type sizes — to `style.json`. The template gives the frame (safe area, `title`, `card`, `rule`, `points`, `foot`), entrances (`reveal`) and ambient loops (`sway`, `bob`, `spin`, `pulse`), all through the engine's state keys. A beat composes it:

```js
['def-mean', 'The mean', (m, D) => {
  const p = panel(0);
  const t = SLIDE.title(p, 'The mean');
  const c = SLIDE.def(p, { x: 200, y: 240, w: 1200, term: ['mean = (a + b + c) / 3'],
    body: ['The mean shares the total evenly.', 'One far value pulls it — look at the spread.'] });
  SLIDE.reveal(t, m('The'), 'rise');
  SLIDE.reveal(c.g, m('mean'), 'rise');
  SLIDE.pulse(c.accent, D);
}, { ask: done => quiz(BAND, [/* … */], done) }],
```

A card kind or a subject diagram that a second chapter needs is added to the kit, not drawn in the chapter ([assets.md](assets.md)); list the kit under `components` in `style.json`. `T()` never wraps — split long lines in the chapter's data, never by scaling type down.

## Pictures

The default is drawn in code: a slides chapter keeps its clean vector look. Sourced pictures are welcome when the subject is genuinely pictorial — a physics book's cars, people and household objects — under the usual rules: free sources only (CC0 or public domain, credited in `img/CREDITS.md`; the science book's vehicles and figures come from a CC0 pack, its Earth and Moon from NASA), processed like any other asset — crop, recolour to the palette, scale ([assets.md](assets.md)) — and agreed at intake, recorded in `images` in `style.json`. A static slide needs one frame: place the picture, maybe give it a gentle `bob`, done. Illustrations scanned from the source textbook are the one source not to use: they carry the publisher's copyright, and their raster look breaks the vector frame — redraw what the slide needs instead, using the textbook page only as a reference.

## Reviewing slides

Stills over strips: capture one frame per beat with `shot.py` (`?beat=N&t=S`), strip only the two or three beats whose entrance feels off, and let `check_blank.py` and `overlap.py` confirm at delivery. Judge the entrances and the ambient life ([review.md](review.md#watch-it-in-motion)), not change — the hold is the form. `perf.py` matters little here: a slide tweens for about a second, then stands still.