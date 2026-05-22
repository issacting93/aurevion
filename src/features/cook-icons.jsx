// Step-representative cooking icons — replaces generic Material set in cook mode.
// Each glyph is a 24x24 SVG path designed to actually communicate the kitchen action.

const COOK_ICONS = {
  // Knife work — vertical chops with descending blade
  dice:    'M5 4l6 6 M11 10l8-8 M5 4l-2 2 m12 12l4 4 m-4-4l-2 2 m-3-3l-3 3',
  chop:    'M4 19l16-7 M14 5l5 5 M14 5l-3 3 M19 10l-3 3',
  slice:   'M3 12h18 M6 12l2-3 M10 12l2-3 M14 12l2-3 M18 12l2-3',

  // Heat — flame variations
  sear:    'M12 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-2-1-3-2-4 M9 17l-3 4 M15 17l3 4',
  roast:   'M4 19h16 M5 19V9a7 7 0 0 1 14 0v10 M9 14l3-3 3 3',
  bake:    'M4 4h16v16H4z M4 8h16 M7 13h6 M16 14v.01 M8 17l3-3 3 3',
  saute:   'M3 14h14a2 2 0 0 0 2-2V8a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v6z M19 10h2l-1 4 M7 14v6 M13 14v6',
  grill:   'M4 5h16M4 9h16M4 13h16M4 17h16 M7 5v12 M17 5v12',

  // Wet methods
  boil:    'M5 11h14v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-6z M8 8l1-3 M12 8l1-3 M16 8l1-3 M19 12h2v3',
  simmer:  'M6 12h12 M6 12c0 4 3 7 6 7s6-3 6-7 M9 8c0 1 1 1 1 2s-1 1-1 2 M14 7c0 1 1 1 1 2s-1 1-1 2',
  steam:   'M5 14h14 M5 14c0 4 3 7 7 7s7-3 7-7 M9 9c0 1 1 1 1 2 M13 7c0 1 1 1 1 2 M17 9c0 1 1 1 1 2',
  pour:    'M4 6h6v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z M10 8l4-2 4 2 M14 14v6 M14 20l-2-2 M14 20l2-2',

  // Mix / combine
  mix:     'M7 7h10l-1 12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L7 7z M5 7l1-3h12l1 3 M10 11s2 2 4 0',
  fold:    'M4 12c4-4 12-4 16 0 M4 12c4 4 12 4 16 0 M12 8v8',
  whisk:   'M12 3v6 M9 9h6l-1 12a2 2 0 0 1-2 2 a2 2 0 0 1-2-2L9 9z M11 12l-1 2 M13 12l1 2 M11 16l-1 2 M13 16l1 2',
  blend:   'M8 3h8v4l-1 7a3 3 0 0 1-3 3 a3 3 0 0 1-3-3L8 7V3z M10 10h4 M9 21h6',

  // Prep
  prep:    'M4 6h16v3H4z M5 9v11h14V9 M9 12h6 M9 15h4',
  measure: 'M3 8h12v8H3z M6 8v3 M9 8v5 M12 8v3 M18 6l3 3-9 9-3-3z',
  season:  'M9 4h6v3a4 4 0 0 1-4 4h2v9h-4v-9h2a4 4 0 0 1-4-4V4z M10 4V2h4v2 M11 11h2',
  rest:    'M5 5h14v2H5z M6 7l1 14h10l1-14 M9 11v6 M15 11v6 M12 11v6',

  // Service
  plate:   'M3 12c0 5 4 9 9 9s9-4 9-9 M3 12h18 M8 12c0 2 2 4 4 4s4-2 4-4',
  garnish: 'M12 8a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4z M12 8V4 M9 4l3-2 3 2 M12 14v6 M9 18h6',
  serve:   'M2 14c0 0 4-3 10-3s10 3 10 3 M5 14v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3 M12 6V3 M9 6h6',
  portion: 'M4 4h16v16H4z M12 4v16 M4 12h16',
};

Object.assign(window, { COOK_ICONS });
