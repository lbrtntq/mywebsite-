---
name: Albert Antioquia
description: Photographs first; the page takes its light from the photograph in view.
colors:
  night: "#0b111a"
  day: "#f2f3f1"
  court: "#0f2318"
  lime: "#c6f24e"
  lime-bright: "#d8fb78"
  teal-glow: "#6fd3c9"
  teal-deep: "#0c7a74"
  night-ink: "#eceff2"
  night-ink-2: "#aeb7c0"
  night-ink-3: "#8a949e"
  day-ink: "#0e141a"
  day-ink-2: "#46505a"
  day-ink-3: "#5c6670"
  court-ink: "#eef3ea"
  court-ink-2: "#b9c8b3"
  court-ink-3: "#93a68d"
  night-rule: "rgba(236, 239, 242, 0.14)"
  day-rule: "rgba(14, 20, 26, 0.14)"
  court-rule: "rgba(238, 243, 234, 0.16)"
  viewer-black: "#06090d"
typography:
  display:
    fontFamily: "'Albert Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 9vw, 6rem)"
    fontWeight: 250
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  display-emphasis:
    fontFamily: "'Albert Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 9vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Albert Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6.4vw, 5.25rem)"
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  statement:
    fontFamily: "'Albert Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4.4vw, 3.75rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Albert Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.6rem)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  body-lg:
    fontFamily: "'Albert Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "'Albert Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
  label:
    fontFamily: "'Albert Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "0.95rem"
    fontWeight: 400
rounded:
  hairline: "2px"
  app-icon: "15px"
  pill: "999px"
  round: "50%"
  phone: "15% / 7.4%"
spacing:
  gutter: "clamp(20px, 4.5vw, 72px)"
  column-gap: "clamp(16px, 2.4vw, 40px)"
  nav-height: "68px"
  row: "18px"
  section: "clamp(96px, 18vh, 200px)"
  section-lg: "clamp(120px, 22vh, 240px)"
components:
  button-lime:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.court}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
    typography: "{typography.body}"
  button-lime-hover:
    backgroundColor: "{colors.lime-bright}"
    textColor: "{colors.court}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.court-ink}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  button-line-hover:
    backgroundColor: "{colors.court-ink}"
    textColor: "{colors.court}"
  nav:
    backgroundColor: "transparent"
    textColor: "{colors.night-ink}"
    height: "{spacing.nav-height}"
    padding: "0 {spacing.gutter}"
  index-row:
    textColor: "{colors.night-ink}"
    typography: "{typography.title}"
    padding: "{spacing.row} 0"
  viewer:
    backgroundColor: "{colors.viewer-black}"
    textColor: "{colors.night-ink}"
---

# Design System: Albert Antioquia

## Overview

**Creative North Star: "Borrowed Light"**

The photographs are the site. Every surface is a wall in a room built for one photograph, and the wall takes its colour from that photograph: a deep shade of the picture's dominant hue for night shots, a pale tint for daylight ones. Between the photo rooms sit three fixed tones: night navy for the cover, index and footer, daylight for the personal statement and engineering, and a court green that belongs to PaQueueKa alone. Scrolling is a slow change of light, never a change of chrome.

Everything else steps back. One typeface, Albert Sans, does all the work in two registers: very light display (250 to 300) against a 600 for the few words that carry emphasis. Structure is hairline rules, never boxes. There are no cards, no badges, no themed signage, and no decorative icons; the only glyphs are thin line arrows and a close mark. Motion exists to arrive (the cover), to follow (the wall colour, the index preview) and to explain (the /tech phone and rotation diagrams), and every effect has a reduced-motion path.

Density is low and the air is generous: a photograph gets a whole screen, captions are quiet, and section padding runs to a fifth of the viewport. The rejected direction this replaces was themed chrome (a transit map with line colours, strips and exits); nothing of that vocabulary returns.

**Key Characteristics:**
- The wall colour follows the photograph in view, on `:root` only, over 900ms.
- Three tones (dark, light, court), each a full set of ink, rule and accent.
- Albert Sans only; display light 250–300 against 600 for emphasis.
- Photographs at their own aspect ratio, one per screen, in a four-step composition cycle.
- Hairline rules for every list; pill buttons; square photographs.
- Entrance motion on the cover only; no scroll reveals.

## Colors

A night-to-day palette with one fenced-off green: neutrals carry the page, a teal accent appears only on interaction, and the photographs supply every other colour.

### Primary
- **Teal Glow** (teal-glow): the accent in dark rooms. Focus rings, text selection, the hover colour of outbound arrows. Never a fill for a surface.
- **Deep Teal** (teal-deep): the same accent in daylight rooms: repo-name hover, step numerals on /tech, the "won, stays on" dot in rotation diagrams.

### Secondary
- **Court Lime** (lime): PaQueueKa's accent. The solid App Store button and the accent token inside court rooms. Hover lifts to **Bright Lime** (lime-bright).

### Neutral
- **Night Navy** (night): the cover, the photograph index, pagination and footer wall; also the phone-menu background and the base under the cover photograph.
- **Daylight** (day): the wall for the personal statement, engineering and the /tech chapters.
- **Court Green** (court): the wall for PaQueueKa rooms on both pages, and the text colour of the lime button.
- **Night ink** (night-ink, night-ink-2, night-ink-3): primary text, secondary text (intros, descriptions), tertiary (numerals, arrows at rest, footer base) on night and on dark photo walls.
- **Day ink** (day-ink, day-ink-2, day-ink-3): the same three steps on daylight and pale photo walls.
- **Court ink** (court-ink, court-ink-2, court-ink-3): the same three steps on court green.
- **Rules** (night-rule, day-rule, court-rule): the 1px hairlines between index rows, repos, flow steps, modes, spec rows and footer links; the ink at 14–16% alpha.
- **Viewer Black** (viewer-black): the full-screen viewer, a fixed near-black independent of the room behind it.

### Named Rules
**The Borrowed Light Rule.** Colour is set on `:root` and nowhere else. Sections only carry `data-tone` and `data-room` as data; the section crossing the middle of the viewport sets `html[data-tone]` and `--room`. Photo walls are computed from a 12×12 sample (chroma-weighted hue bins): dark photos get `hsl(hue, 24–48%, 13%)`, light photos `hsl(hue, 26–42%, 87%)`. Hue and saturation vary; lightness never does, so the ink always reads.

**The Fenced Court Rule.** Court green and lime appear only in PaQueueKa rooms. Elsewhere the accent is teal, and buttons are outline only.

**The Accent On Touch Rule.** The accent answers the visitor (hover, focus, selection), marks a state (a won player) or numbers a sequence (the /tech session steps). It never fills a section or a surface.

## Typography

**Display Font:** Albert Sans (self-hosted variable, 100–900, with ui-sans-serif, system-ui)
**Body Font:** Albert Sans
**Label/Mono Font:** system monospace (ui-monospace, SF Mono, Menlo, Consolas), for repository and code names only

**Character:** One humanist grotesk at two extremes of weight: hairline-light display that lets the photographs stay louder, with a 600 used sparingly where a word must land.

### Hierarchy
- **Display** (250 with 600 emphasis, clamp(3.25rem, 9vw, 6rem), 0.92, -0.04em): the name on the cover, "Albert" light over "Antioquia" heavy; PaQueueKa on /tech at 300. The closing "Kumusta?" uses the same scale at 300.
- **Headline** (300, clamp(2.5rem, 6.4vw, 5.25rem), 0.95, -0.04em): section titles (Photographs, PaQueueKa, Engineering, /tech chapters).
- **Statement** (300, clamp(1.9rem, 4.4vw, 3.75rem), 1.1, -0.03em, max 22ch, balanced): the personal statement and the /tech close; a small variant (clamp(1.5rem, 2.8vw, 2.25rem), 30ch) opens a chapter body.
- **Title** (300, clamp(1.75rem, 3vw, 2.6rem), 1.08, -0.025em): photo captions; the index rows use a smaller step (clamp(1.35rem, 2.6vw, 2.1rem)) and footer links a larger one (clamp(1.9rem, 4.4vw, 3.25rem)).
- **Body** (400, 1.0625rem, 1.6, tabular numerals): running text; the large step (1.125rem) carries intros and chapter bodies at 44–62ch.
- **Label** (400, 0.875rem): numerals, places, dates, notes and credits in ink-2 or ink-3. Never uppercase, never tracked out.
- **Emphasis** (600): the nav name, buttons, the cover credit title, flow-step names, spec terms.

### Named Rules
**The Two Weights Rule.** Display sizes are light (250–300). Weight 600 is for emphasis at any size; nothing in between is used for headings except the flow and mode titles at 400.

**The One Face Rule.** Albert Sans for everything; system monospace only for repository and code names. No second display face, no system display fallback by design.

## Layout

A 12-column grid (column gap clamp(16px, 2.4vw, 40px)) inside a fluid gutter (clamp(20px, 4.5vw, 72px)). Section heads put the headline on columns 1–6 and the intro on 8–12, bottom-aligned. Sections breathe: top padding runs clamp(96px, 18vh, 200px) to clamp(120px, 22vh, 240px).

Photo rooms are a full viewport tall. The composition cycles large (photo columns 1–8, caption 9–12 at the bottom), small (photo 8–11 in a lot of air, caption 2–5 at the top), offset (photo 4–9 centred, caption 10–12), full-height (photo at 100svh, no vertical padding). Landscapes break the cycle and bleed edge to edge with the caption below. Each photograph's width is capped by its own aspect ratio against the viewport height, so it is never cropped.

Below 960px everything collapses to one column; the small room keeps its character by sitting right-aligned at 64% width. Below 720px the nav links fold into a full-screen menu, index and repo rows drop their third column under the title, and the nav height drops to 60px. Safe-area insets are respected on nav, cover foot, footer and viewer.

### Named Rules
**The Own Proportions Rule.** A photograph is shown at its own aspect ratio, one per screen. Never crop photographs into a grid, a uniform tile or a card.

## Elevation & Depth

Flat. Depth comes from the change of light between rooms and from the photographs themselves; surfaces never lift. Two objects float, because they are objects: the phone frame and the cursor-following index preview.

### Shadow Vocabulary
- **Device drop** (`box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), 0 40px 70px -36px rgba(0,0,0,0.6)`): the phone frame only.
- **Preview lift** (`box-shadow: 0 24px 50px -20px rgba(0,0,0,0.55)`): the floating index preview only.
- **Hairline** (`box-shadow: 0 1px 0 var(--rule)`): the solid nav's bottom edge.

### Named Rules
**The Flat Wall Rule.** Walls, rows and sections carry no shadow and no border box. Separation is a 1px rule or a change of tone.

## Shapes

Photographs are square-cornered rectangles at their own proportions. Interactive controls are fully round: pill buttons (999px) and circular icon buttons (48px; 56px for viewer arrows). The only other corners belong to things that are curved in life: the phone (15% / 7.4% outer, 12.4% / 5.8% screen) and the app icon (15px). Diagram marks are 20px circles; legend keys 12px. Lines are 1px rules; icons are 24-unit line drawings at 1.6 stroke.

## Components

### Buttons
- **Shape:** full pill (999px), min-height 52px, 26px side padding, weight 600.
- **Primary (Court Lime):** lime fill with court-green text, only inside court rooms; hover to bright lime.
- **Outline:** a 1.5px inset ring of the ink at 45%; hover fills with the ink and inverts the text.
- **Active:** scale 0.97.
- **Icon button:** 48px circle, transparent; hover a faint light wash (viewer and menu, which are always dark).

### Text Links
- **Style:** weight 500, an underline that draws in from the left on hover (1px, 400ms), the arrow nudging 4px right. Nav links use the same drawn underline, held on for the current page.

### Navigation
- **Style:** fixed, 68px, name at 600 on the left, four links at 0.9375rem / 500 on the right.
- **States:** transparent with white text over the cover; after the cover, solid in the current room colour with a hairline bottom; slides away when scrolling down past 480px and returns on the way up or on focus.
- **Mobile:** a "Menu" text button opens a full-screen night dialog with the links at display scale, weight 300.

### Cover
Full-bleed first landscape at 100svh with a top and bottom navy shade; name top-left, a one-line lede at 30ch, the photo credit bottom-left (opens the viewer) and "N photographs" with a down arrow bottom-right. Entrance: the photo settles from 1.06 scale (1800ms), the name rises in two staggered lines, lede and foot fade up.

### Index
A numbered list of every photograph by title between hairlines: numeral (ink-3), title (light, title scale), place (ink-2). On hover the other rows dim to 38%, the hovered title slides 14px, and a 260px preview follows the cursor with a lerp and a slight lean from horizontal velocity.

### Room
One photograph per screen at its own aspect ratio, opening the viewer on click (a 1.02 zoom on hover). The caption is a light title, a meta line (numeral, place, month and year) and an optional description, all at most 38ch.

### Viewer
A full-screen dialog on viewer black: count, title and close along the top; the photograph contained in the stage; meta and description beneath. It grows out of the clicked thumbnail (560ms), swipes on touch, and steps with arrow buttons.

### Phone Frame
A device at 433:882 with a bezel in the tone's bezel colour, used for real PaQueueKa screens only. On /tech a sticky phone crossfades between screens (450ms opacity, 700ms scale) as the session steps pass the middle of the screen; inactive step headings dim to 42% on wide screens.

### Hairline Rows
Repo rows (mono name, description, outbound arrow that turns accent and shifts up-right on hover), spec rows (600 term, ink-2 definition), flow steps (six columns, each a top rule with a thin chevron where one step hands to the next), and footer links: a large light name whose weight animates from 300 to 500 on hover while the arrow turns accent.

### Rotation Diagram
Six players on a hairline track with a bracket marking the next court. Played players are solid ink, a winner who stays on is the accent, waiting players are hollow rings. On arrival or hover the queue replays its shuffle (700ms); with reduced motion it rests in the played state.

## Do's and Don'ts

### Do:
- **Do** set tone and wall colour on `:root` only and let sections carry them as data.
- **Do** keep computed photo walls at 13% lightness for dark photographs and 87% for light ones.
- **Do** show every photograph at its own aspect ratio and cycle large, small, offset and full-height; let landscapes bleed.
- **Do** set display type light (250–300) and reserve 600 for emphasis.
- **Do** separate list items with 1px rules at 14–16% ink.
- **Do** give every motion effect a reduced-motion path; the global fallback collapses durations to 1ms.
- **Do** use the 900ms in-out curve for wall changes and the long ease-out (cubic-bezier(0.16, 1, 0.3, 1)) for everything that moves.

### Don't:
- **Don't** use court green or a lime fill outside PaQueueKa rooms.
- **Don't** add scroll-triggered reveals; the cover entrance is the only entrance.
- **Don't** put photographs in cards, uniform grids or cropped tiles.
- **Don't** add themed chrome: maps, line colours, badges, signage or decorative icons. Line arrows and the close mark are the whole icon set.
- **Don't** add a second typeface; monospace is for code names only.
- **Don't** shadow walls or rows; only the phone and the index preview float.
- **Don't** add small uppercase labels or eyebrows above headings.
