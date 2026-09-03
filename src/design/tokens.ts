/**
 * Design tokens for the ambassador portal.
 *
 * Every value here is lifted from the `D-Rail-Coverflow v3` design canvas. The
 * canvas repeats raw literals inline on hundreds of elements; naming them once
 * here means a palette change is a single edit rather than a find-and-replace,
 * and it makes the intent of each colour legible at the call site.
 */

/** Core palette. */
export const color = {
  /** Page ground, behind the stage. */
  void: '#06080c',
  /** Panel card fill in rail and coverflow modes. */
  card: 'rgba(11,15,22,.82)',
  /** Panel card fill in deck mode, where the card is full-bleed. */
  cardDeck: 'rgba(6,8,12,.55)',
  /** Chrome surfaces: header pills, drawers, overlay bodies. */
  surface: 'rgba(10,14,20,.6)',
  surfaceSolid: 'rgba(10,14,20,.96)',
  drawer: 'rgba(8,11,16,.96)',
  /** Input fill. */
  field: 'rgba(8,11,16,.7)',
  /** The faint white wash used for inset cards inside a panel. */
  inset: 'rgba(255,255,255,.02)',

  /** Brand blue, and its lighter readable variants. */
  brand: '#1e7cf2',
  brandHover: '#3b8ff7',
  accent: '#4d9bff',
  accentSoft: '#8ec0ff',

  /** Text ramp, brightest to dimmest. */
  textBright: '#f2f5fa',
  text: '#eef2f8',
  textBody: '#e6ebf3',
  textSoft: '#c9d2e0',
  textMuted: '#8a96a8',
  textDim: '#7f8ca0',
  textFaint: '#5c6b80',
  placeholder: '#4a5566',

  /** Status colours. Green approved, amber pending, blue open/informational. */
  approved: '#3ddc97',
  pending: '#f0b34a',
  open: '#4d9bff',
  danger: '#f08080',
  dangerBorder: 'rgba(240,90,90,.3)',
} as const

/** Hairline borders and dividers, in ascending prominence. */
export const border = {
  faint: 'rgba(140,170,220,.06)',
  subtle: 'rgba(140,170,220,.08)',
  soft: 'rgba(140,170,220,.1)',
  base: 'rgba(140,170,220,.12)',
  strong: 'rgba(140,170,220,.14)',
  bright: 'rgba(140,170,220,.2)',
  accent: 'rgba(77,155,255,.4)',
  accentStrong: 'rgba(77,155,255,.5)',
  accentVivid: 'rgba(77,155,255,.6)',
} as const

/** Translucent brand fills, for selected and highlighted states. */
export const brandFill = {
  faintest: 'rgba(30,124,242,.06)',
  faint: 'rgba(30,124,242,.08)',
  soft: 'rgba(30,124,242,.12)',
  medium: 'rgba(30,124,242,.18)',
  strong: 'rgba(30,124,242,.35)',
} as const

/** Font shorthands. Matches the canvas's `font:` shorthand usage. */
export const font = {
  sans: "'IBM Plex Sans',sans-serif",
  display: "'Barlow Condensed',sans-serif",
  mono: "'JetBrains Mono',monospace",
} as const

/**
 * The uppercase monospace kicker that labels almost every block in the design.
 * `size` and `tracking` vary slightly by context, so both are parameters.
 */
export function kicker(size = 10, tracking = '.2em') {
  return {
    font: `500 ${size}px/1 ${font.mono}`,
    letterSpacing: tracking,
    color: color.textFaint,
  } as const
}

/** Motion. One easing curve carries the whole design. */
export const motion = {
  ease: 'cubic-bezier(.22,.8,.2,1)',
  /** Panel transition while settled; drag swaps this for `none`. */
  panel: 'transform .7s cubic-bezier(.22,.8,.2,1), opacity .5s cubic-bezier(.22,.8,.2,1), box-shadow .5s',
  /** Parallax background layers, which lag the panels slightly. */
  background: 'transform .8s cubic-bezier(.22,.8,.2,1), background-position .8s cubic-bezier(.22,.8,.2,1)',
  drawer: 'transform .5s cubic-bezier(.22,.8,.2,1)',
} as const

/** Elevation and glow. */
export const shadow = {
  /** Focused panel in rail mode. */
  railFocused:
    '0 0 0 1px rgba(77,155,255,.25),0 0 80px rgba(30,124,242,.18),0 40px 100px rgba(0,0,0,.6)',
  railResting: '0 30px 80px rgba(0,0,0,.5)',
  /** Focused panel in coverflow mode — deeper, since cards sit further back. */
  coverFocused:
    '0 0 0 1px rgba(77,155,255,.28),0 0 70px rgba(30,124,242,.16),0 50px 120px rgba(0,0,0,.7)',
  coverResting: '0 40px 100px rgba(0,0,0,.6)',
  /** Floating chrome: overlays, palette. */
  float: '0 0 60px rgba(30,124,242,.25),0 30px 80px rgba(0,0,0,.6)',
  /** The blue halo on primary buttons and the points pill. */
  glow: '0 0 24px rgba(30,124,242,.4)',
  glowSoft: '0 0 22px rgba(30,124,242,.18)',
} as const

/** Layout constants shared between the stage and its chrome. */
export const layout = {
  /** Header height; the stage starts directly below it. */
  headerHeight: 72,
  /** Side drawer width. */
  drawerWidth: 380,
  /** Horizontal padding inside a panel body. */
  panelPadX: 44,
} as const

/** Stacking order, named so the relationships stay legible. */
export const z = {
  panelLabel: 6,
  chrome: 40,
  header: 50,
  edgeArrow: 60,
  drawer: 80,
  overlay: 90,
  toast: 95,
  palette: 96,
} as const
