// Slide kit for tier 0 (slides) books: static vector slides that hold while the narration
// speaks, kept alive by entrance reveals and gentle ambient motion. Copy to
// site/<book>/lib/slides.js (loaded after engine.js), then adapt the look — head strings,
// colours, type sizes — to the book's style.json. Beats compose the kit instead of drawing
// (references/slides.md has the idiom). Everything rides the engine's state keys and clockRun,
// so pause, seek and ?beat=N&t=S show the same frame. One ambient loop per element; nest
// groups to combine. Draw content around (0,0) and place with x/y.
'use strict';
(() => {
  const TAU = Math.PI * 2;
  // Safe area of the 1600x900 stage; the title band sits at its top, the question band
  // (BAND) covers the bottom — keep foot() off beats that ask.
  const MX = 110, MY = 76, W = 1600, H = 900, PAD = 30;

  const rounded = (x, y, w, h, r) =>
    `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}` +
    `A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}` +
    `A${r} ${r} 0 0 1 ${x + r} ${y}`;

  const SLIDE = {
    MX, MY, W, H,

    // Heading of a beat: title in the top band, optional dim subtitle. Hidden; rise it in.
    title(p, str, { sub, size = 44 } = {}) {
      const g = G(p, { o: 0 });
      T(g, str, { x: MX, y: MY + 40, size, fill: COL.chalk, weight: 600, anchor: 'start' });
      if (sub) T(g, sub, { x: MX, y: MY + 86, size: 26, fill: COL.dim, anchor: 'start' });
      return g;
    },

    // A content card: filled rounded panel, small dim head, a corner accent that can pulse.
    // Returns { g, body, accent }; draw the content into body — it is inset by the padding
    // and its (0,0) is the card's inner top-left corner.
    card(p, { x, y, w, h, head, headFill = COL.dim }) {
      const g = G(p, { x, y, o: 0 });
      path(g, rounded(0, 0, w, h, 18),
        { fill: mix(COL.board, COL.chalk, .06), stroke: mix(COL.dim, COL.board, .35), 'stroke-width': 2.5 });
      if (head) T(g, head, { x: PAD, y: 40, size: 23, fill: headFill, weight: 600, anchor: 'start' });
      const body = G(g, { x: PAD, y: head ? 74 : PAD });
      const accent = put(mk('circle', { r: 9, fill: COL.task }, g), { x: w - PAD, y: 34 });
      return { g, body, accent };
    },

    // A thin accent rule prepared for the engine's draw idiom: draw(SLIDE.rule(...), t0, .5).
    rule(p, x, y, w, { stroke = COL.task, width = 3 } = {}) {
      return path(p, `M${x} ${y}H${x + w}`, { stroke, 'stroke-width': width }, { d: 0 });
    },

    // Numbered rows down the stage; items are callbacks drawing one row around its origin.
    // Returns the row groups — reveal each in turn, tied to its mark.
    points(p, items, { x, y, gap = 120, dot = COL.task } = {}) {
      return items.map((row, i) => {
        const g = G(p, { x, y: y + i * gap, o: 0 });
        mk('circle', { cx: 16, cy: -10, r: 22, fill: dot }, g);
        T(g, String(i + 1), { x: 16, y: -1, size: 26, fill: COL.board, weight: 700, anchor: 'middle' });
        row(g);
        return g;
      });
    },

    // A definition card (an example composition — adapt the kinds to the book): a term set
    // large, short lines under it. body lines never wrap, keep each under ~46 characters.
    // Returns the card; c.h is the height to keep clear below the card's top edge.
    def(p, { x, y, w, head = 'Definition', term, body, h }) {
      const rows = Array.isArray(body) ? body : [body];
      const c = SLIDE.card(p, { x, y, w, h: h ?? 130 + rows.length * 46, head });
      M(c.body, term, { x: 0, y: 34, size: 44, anchor: 'start' });
      rows.forEach((s, i) => T(c.body, s, { x: 0, y: 96 + i * 46, size: 30, fill: COL.chalk, anchor: 'start' }));
      c.h = h ?? 130 + rows.length * 46;
      return c;
    },

    // Entrance of a kit piece. 'fade' for blocks, 'rise' for a new point; stroke paths that
    // were made with {d: 0} enter with the engine's draw() instead.
    reveal(g, t0, how = 'fade', dur = how === 'rise' ? .6 : .5) {
      if (how === 'rise') {
        const y0 = g._st.y;
        put(g, { y: y0 + 26 });
        tw(g, { o: 1, y: y0 }, t0, dur, soft);
      } else tw(g, { o: 1 }, t0, dur);
    },

    // Gentle ambient loops, periodic in t: they keep a holding frame alive. Exactly one
    // loop per element; sway owns r, bob owns y, spin owns r, pulse owns s.
    sway(el, D, { amp = 2.4, period = 5, phase = 0 } = {}) {
      clockRun(t => put(el, { r: amp * Math.sin(TAU * t / period + phase) }), D);
    },
    bob(el, D, { amp = 6, period = 4, phase = 0 } = {}) {
      const y0 = el._st.y;
      clockRun(t => put(el, { y: y0 + amp * Math.sin(TAU * t / period + phase) }), D);
    },
    spin(el, D, { period = 24, phase = 0 } = {}) {
      clockRun(t => put(el, { r: (360 * t / period + phase) % 360 }), D);
    },
    pulse(el, D, { amp = .06, period = 2.4, phase = 0 } = {}) {
      clockRun(t => put(el, { s: 1 + amp * (.5 - .5 * Math.cos(TAU * t / period + phase)) }), D);
    },

    // A quiet progress line at the bottom edge; skip on beats that ask.
    foot(p, left, right) {
      T(p, left, { x: MX, y: 854, size: 21, fill: COL.faint, anchor: 'start' });
      if (right) T(p, right, { x: W - MX, y: 854, size: 21, fill: COL.faint, anchor: 'end' });
    },
  };

  window.SLIDE = SLIDE;
})();