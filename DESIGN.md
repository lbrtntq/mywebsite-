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
    fontSize: "clamp(3.5rem, 10.5vw, 8.5rem)"
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

The photographs are the site, and the light comes from them. The heart of the home page is "One long day": a pinned scene where a large clock ticks to the real minute each photograph was taken (read from its EXIF) while the wall moves from late-morning white through golden hour to night, and each photograph is dealt onto the table as a print. Around it sit three fixed tones: a pale morning wall for the hero, night navy for the index and footer, daylight for the statement and engineering, and a court green that belongs to PaQueueKa alone. Scrolling is a change of light, never a change of chrome.

Everything else steps back. One typeface, Albert Sans, does all the work in two registers: very light display (250 to 300) against a 600 for the few words that carry emphasis. Structure is hairline rules, never boxes. There are no cards, no badges, no themed signage, and no decorative icons; the only glyphs are thin line arrows and a close mark. Motion is tactile and physical (prints dealt and flicked with a damped spring, Lenis smooth scrolling), it follows (the clock, the wall, the index preview) and it explains (the /tech phone and rotation diagrams). Every effect has a reduced-motion path.

Density is low and the air is generous: a photograph gets a whole screen, captions are quiet, and section padding runs to a fifth of the viewport. The rejected direction this replaces was themed chrome (a transit map with line colours, strips and exits); nothing of that vocabulary returns.

**Key Characteristics:**
- The wall colour follows the time of day each photograph was taken, on `:root` only.
- Three tones (dark, light, court), each a full set of ink, rule and accent.
- Albert Sans only; display light 250–300 against 600 for emphasis.
- Photographs as physical prints (white border, real proportions) dealt in a pinned scene, ordered by capture time.
- Hairline rules for every list; pill buttons; square photographs.
- Hero entrance only; no scroll reveals. Lenis (lerp 0.11) for scrolling.

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
**The Borrowed Light Rule.** Colour is set on `:root` and nowhere else. Sections only carry `data-tone` and `data-room` as data; the section crossing the middle of the viewport sets `html[data-tone]` and `--room`. Inside "One long day" the scene itself sets the wall from the clock: keyframes at 10:00 (cool white), 11:30, 13:00 (warm white), 15:30, 17:00 (gold), 18:10 (amber), then dusk violet at 18:25, deep blue at 19:20 and night navy by 20:30; the tone flips to dark at dusk. Light walls stay pale and dark walls stay deep, so the ink always reads.

**The Fenced Court Rule.** Court green and lime appear only in PaQueueKa rooms. Elsewhere the accent is teal, and buttons are outline only.

**The Accent On Touch Rule.** The accent answers the visitor (hover, focus, selection), marks a state (a won player) or numbers a sequence (the /tech session steps). It never fills a section or a surface.

## Typography

**Display Font:** Albert Sans (self-hosted variable, 100–900, with ui-sans-serif, system-ui)
**Body Font:** Albert Sans
**Label/Mono Font:** system monospace (ui-monospace, SF Mono, Menlo, Consolas), for repository and code names only

**Character:** One humanist grotesk at two extremes of weight: hairline-light display that lets the photographs stay louder, with a 600 used sparingly where a word must land.

### Hierarchy
- **Clock** (200, clamp(4rem, 12vw, 10rem), 0.9, -0.05em, tabular; AM/PM at 0.2em / 600): the day scene's clock only.
- **Display** (250 with 600 emphasis, clamp(3.5rem, 10.5vw, 8.5rem), 0.92, -0.04em): the name in the hero, "Albert" light over "Antioquia" heavy; PaQueueKa on /tech at 300. The closing "Kumusta?" uses the same scale at 300.
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

The day scene is a track of (photos × 100svh + 50svh) with a sticky 100svh scene: clock top-left, the current caption bottom-left (38ch), the print stack centred at 66% (50% on phones), a hairline progress rail with capture-time ticks along the bottom. Prints are sized by their own aspect ratio against the viewport height, so they are never cropped.

Below 960px everything collapses to one column; the small room keeps its character by sitting right-aligned at 64% width. Below 720px the nav links fold into a full-screen menu, index and repo rows drop their third column under the title, and the nav height drops to 60px. Safe-area insets are respected on nav, cover foot, footer and viewer.

### Named Rules
**The Own Proportions Rule.** A photograph is shown at its own aspect ratio, one per screen. Never crop photographs into a grid, a uniform tile or a card.

## Elevation & Depth

Flat walls. Objects that are objects in life cast shadows: prints (deck and day scene), the phone frame and the cursor-following index preview.

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

### Hero and Deck
Name left at display scale, a one-line lede and a drawn-underline link into the day. Right: a deck of up to five prints (4:5 crops with a white border, thicker at the bottom) fanned with small tilts. Tap or "Next print" throws the top print off and tucks it under the pile; dragging it follows the hand and a fast or long flick throws it. Springs: snap k190/d21, throw k120/d15. Entrance: the name rises in two lines, lede and deck fade up.

### One Long Day
The pinned scene described under Layout. Scroll progress picks the photograph; the clock holds on its capture time for 60% of the stage, then ticks to the next. A sun (a defined warm disc with two faint rings, never a blurred glow) crosses a high arc above the prints and sets at dusk; a small moon disc appears after 18:30. The current print is thrown in from the top right (throw spring) onto the pile of earlier prints, each kept at its own small tilt. Clicking a print opens the viewer. Without JS the stages render as a simple sequence; with reduced motion the scene still follows the scroll but places prints instantly.

### Index
A numbered list of every photograph by title between hairlines: numeral (ink-3), title (light, title scale), place (ink-2). On hover the other rows dim to 38%, the hovered title slides 14px, and a 260px preview follows the cursor with a lerp and a slight lean from horizontal velocity.

### Lineage Graph
The dbt_demo_university models in four columns (PLV.raw, staging, marts dims, the fact) as code-named nodes on 6px-radius hairline boxes, joined by curves measured from the nodes and drawn in layer by layer when the graph arrives. Hover, focus or tap traces everything upstream and downstream in the accent; the rest dims. Edges come from the repo's own ref() and source() calls; never invent models or tests.

### Follow One Photo
A sticky dark inspector beside five steps (phone, upload, Postgres row, EXIF clock read, browser width). Each panel shows the real artifact for the first photo of the day: EXIF time and pixels, the Cloudinary URL, the actual row as JSON, the 64 KB range read, and the srcset with the width this browser actually loaded, highlighted live. Monospace is allowed here because it is data.

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
- **Do** keep light walls pale and dark walls deep so the ink always reads.
- **Do** show every photograph at its own aspect ratio, as a print, ordered by the time it was taken.
- **Do** set display type light (250–300) and reserve 600 for emphasis.
- **Do** separate list items with 1px rules at 14–16% ink.
- **Do** give every motion effect a reduced-motion path; the global fallback collapses durations to 1ms.
- **Do** use the 900ms in-out curve for wall changes and the long ease-out (cubic-bezier(0.16, 1, 0.3, 1)) for everything that moves.

### Don't:
- **Don't** use court green or a lime fill outside PaQueueKa rooms.
- **Don't** add scroll-triggered fade-ins; the hero entrance and the day scene are the motion.
- **Don't** put photographs in cards, uniform grids or cropped tiles.
- **Don't** add themed chrome: maps, line colours, badges, signage or decorative icons. Line arrows and the close mark are the whole icon set.
- **Don't** add a second typeface; monospace is for code names only.
- **Don't** shadow walls or rows; only the phone and the index preview float.
- **Don't** add small uppercase labels or eyebrows above headings.
