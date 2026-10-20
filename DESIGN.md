---
name: Albert Antioquia
description: A personal site drawn as one transit interchange; three lines meet at a name.
colors:
  wall: "#eef1f3"
  wall-deep: "#e1e6e9"
  sign-panel: "#f8fafb"
  ink: "#121413"
  ink-2: "#434845"
  ink-3: "#626864"
  tunnel: "#0b0c0c"
  on-dark: "#f1f2ef"
  on-dark-2: "#b9bdba"
  line-p: "#d42a1f"
  line-d: "#0a63ad"
  line-q: "#3b7a1b"
  line-q-deep: "#2f6414"
  line-d-lit: "#3d8fd6"
  line-q-lit: "#5ea52f"
  exit-yellow: "#ffcd00"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.1rem, 12.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 122"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 115"
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.9vw, 1.45rem)"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'tnum'"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.25
    fontFeature: "'tnum'"
  code:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 105"
    fontFeature: "'tnum'"
rounded:
  frame: "3px"
  panel: "4px"
  control: "6px"
  slab: "8px"
  plate: "0.3em"
  full: "999px"
spacing:
  gutter: "clamp(16px, 4.2vw, 64px)"
  rail: "clamp(40px, 5vw, 72px)"
  strip: "56px"
  strip-mobile: "64px"
  stroke: "6px"
  tile: "56px"
  section: "clamp(72px, 12vh, 140px)"
components:
  button-q:
    backgroundColor: "{colors.line-q}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0 1.15em"
    height: "48px"
  button-q-hover:
    backgroundColor: "{colors.line-q-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 1.15em"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wall}"
  line-plate:
    textColor: "#ffffff"
    rounded: "{rounded.plate}"
    size: "2em"
  roundel:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.full}"
    height: "1.9em"
  exit-plate:
    backgroundColor: "{colors.exit-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "48px"
  strip-map:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    height: "{spacing.strip}"
  sign-panel:
    backgroundColor: "{colors.sign-panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(24px, 3vw, 44px)"
  route-map:
    backgroundColor: "{colors.wall}"
    textColor: "{colors.ink}"
    width: "min(460px, 100vw)"
  ink-slab:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.slab}"
    padding: "18px 20px"
  viewer:
    backgroundColor: "{colors.tunnel}"
    textColor: "{colors.on-dark}"
---

# Design System: Albert Antioquia

## Overview

**Creative North Star: "The Interchange"**

The public site is one Hong Kong / Bangkok metro station. Three lines (P for photography, D for data, Q for PaQueueKa) meet at a single interchange, and that interchange is Albert's name. Everything on the page is wayfinding: a cool enamel wall, signage-black ink, line colours used as state, lettered yellow exits, and a black tunnel where photographs are viewed. Nothing is decorative unless a real station would carry it.

Density is calm and generous: big wide station names, long rows of timetable, photographs given most of a viewport. The interface recedes around the photos; colour is spent on lines, plates and dots, never on surfaces. Navigation is a single system: the strip map at the top, the P/D/Q line plates, the route-map dialog and the footer exits are all drawn from the same `route` list, so every page shows the same stops in the same order.

Motion is mechanical and transit-literal: a name rises out of its sign line, tracks draw in, photos open like platform doors, and the in-car display scrambles once when the current station changes. Every motion has a reduced-motion path that lands on the final state.

**Key Characteristics:**
- Cool enamel-tile wall, signage-black ink, three line colours as the only saturation.
- Archivo variable, stretched wide (wdth 105-125) and heavy (800) for station names; normal width for reading.
- Tabular figures everywhere: station codes, dates and counts line up.
- Thick line strokes (6px rails, 8px rules, 10px bands) and dot-on-track stations.
- Only the current station is ever fully lit; passed stations dim, unvisited ones are hollow ghosts.
- One navigation system, drawn from one route list.
- A black tunnel viewer for photographs.

## Colors

A cool, near-colourless station with three saturated line colours and one yellow, each reserved for a single meaning.

### Primary
- **Signal Red, Line P** (line-p): the photography line. Station roundels, the vertical rail beside the photo stations, the timetable's line rule, the first meta item on each station, the P plate.
- **Platform Blue, Line D** (line-d): the data line. The D section's rail, the pipeline track and its stop stamps, repo arrows, the D plate.
- **Court Green, Line Q** (line-q): the PaQueueKa line. The Q rail down /tech, waiting-player dots in the mode diagrams, and the store buttons (deepening to line-q-deep on hover).

### Secondary
- **Exit Yellow** (exit-yellow): exits and endings only. Lettered exit plates in the footer, the buffer stop at the end of the footer line band, the terminal dot of the data pipeline, the winner token in Challenger's Court, the skip link, text selection and the outer focus halo.

### Tertiary
- **Lit Blue and Lit Green** (line-d-lit, line-q-lit): lightened line colours for marks that sit on ink, where the base blue and green lose contrast (the Map button glyph, the arrow on the dark ride link). Red needs no lit variant.

### Neutral
- **Enamel Wall** (wall): the page ground and the route-map dialog. On hero walls it carries the glazed tile pattern.
- **Grout Wall** (wall-deep): the recessed band behind the D section, hover fill in the route map, placeholder behind loading photos, the mode-diagram trough.
- **Sign Panel** (sign-panel): the enamel panel the hero name is mounted on; brighter than the wall so the sign reads as a separate object.
- **Signage Ink** (ink): text, the strip map, the footer, 2-3px table rules, ghost-button strokes, dark slabs.
- **Ink 2 / Ink 3** (ink-2, ink-3): secondary copy and quiet metadata (places, dates, captions).
- **Tunnel** (tunnel): the photo viewer and its backdrop, poster frame fill.
- **On-dark / On-dark 2** (on-dark, on-dark-2): text on ink and tunnel.

### Named Rules
**The Colour-Is-State Rule.** P, D and Q carry only section identity and station state. They never fill a large surface, never decorate a heading, and never appear outside their own line's content (the Map glyph, which shows all three lines, is the one place they sit together).

**The Exit Rule.** Yellow means "a way out or an end". If it is not an exit, a terminus, a buffer or focus, it is not yellow.

**The Lit Station Rule.** Only the current station is fully lit. Passed stops dim (line colour mixed 45% into ink); unvisited stops are hollow ghosts (ink fill, line-coloured ring). States swap in place; nothing slides between them.

## Typography

**Display Font:** Archivo (self-hosted variable, weight 100-900, width 62-125%), falling back to ui-sans-serif, system-ui.
**Body Font:** Archivo at normal width.
**Label/Mono Font:** Archivo for codes and labels; ui-monospace only for inline `code`.

**Character:** One family doing two jobs. Pushed wide and heavy it becomes station signage; at normal width and weight it is plain, warm reading text. Tabular figures are on for the whole body, so codes and dates sit in columns.

### Hierarchy
- **Display** (800, wdth 125, clamp(3.1rem, 12.4vw, 6rem), 0.9): station names only. The hero name, the /tech hero, the footer terminus name.
- **Headline** (800, wdth 122, clamp(2.25rem, 6vw, 4.25rem), 0.95): line titles and the closing "get the app" title; always paired with its line plate and an 8px line rule underneath.
- **Title** (800, wdth 115, clamp(1.6rem, 3.2vw, 2.6rem), 1.02, balanced): individual stations (photo titles, ride steps). Sub-section titles step down to clamp(1.75rem, 3.6vw, 2.75rem).
- **Lede** (600, clamp(1.2rem, 1.9vw, 1.45rem), 1.4): one opening paragraph per stop, 34-62ch.
- **Body** (400, 1.0625rem, 1.6): reading copy, kept to 40-62ch, usually in ink-2.
- **Label** (600-700, 0.875rem): metadata, captions, "Change here for", station meta.
- **Code** (800, wdth 105, 0.8125rem, tabular): station codes inside roundels (P1, Q2, D3).

### Named Rules
**The Stretch-Means-Sign Rule.** Width goes up with importance: 125 for station names, 108-122 for titles and row names, 100 for reading. Reading text is never stretched.

**The Tabular Rule.** Every code, date and count uses tabular figures; codes live in roundels, dates in timetable columns.

## Layout

A 12-column grid with fluid gutters (clamp(16px, 4.2vw, 64px)) under a fixed 56px strip map (64px and two rows below 720px). Line sections hang off a left **rail** (clamp(40px, 5vw, 72px)) that carries the line's vertical 6px track; station roundels sit centred on the rail and content starts one column-gap to its right. Sections breathe with clamp(72px, 12vh, 140px) top padding.

The home hero splits 7/5: the sign panel left, a backlit poster frame right; three line bands at the base converge on the name (an SVG route drawing on desktop, stacked bands below 960px). On phones the photograph leads: the poster moves above the name as a 16:11 crop.

Photo stations alternate three compositions so the line never becomes a grid: wide photos run the full line with text below right; upright photos alternate left-photo / right-text, right-photo / left-text, and a centred narrower photo. Below 960px everything collapses to rail + one column. Lists of things (timetable, repos, modes, spec, exits) are ruled rows: a 2-3px ink rule on top, 1px ink-at-20% dividers between rows, 60-84px row height.

Breakpoints: 1100px (line plates leave the strip), 960px (single column, sticky phone becomes inline), 720px (two-row strip, compact timetable, swipeable phones).

## Elevation & Depth

Flat by default. Depth comes from material, not from floating cards: a tiled wall, an enamel sign bolted to it with a hairline lip, a lightbox whose own photograph glows onto the tiles, and phones that sit on the page with a soft cast shadow. Dark surfaces (strip, footer, tunnel) read as separate planes by value, not by shadow.

### Shadow Vocabulary
- **Sign lip** (`box-shadow: 0 1px 0 rgba(18,20,19,0.14), 0 0 0 1px rgba(18,20,19,0.06)`): the hero sign panel; a mounted panel's edge.
- **Lightbox drop** (`box-shadow: 0 1px 0 rgba(11,12,12,0.2), 0 26px 50px -26px rgba(11,12,12,0.45)`): the poster lightbox, with a blurred screen-blended copy of the photo behind it as backlight spill.
- **Device cast** (`box-shadow: inset 0 0 0 1.5px #3a3e3c, 0 2px 0 #0b0c0c, 0 30px 50px -24px rgba(11,12,12,0.55)`): phone frames holding app captures.
- **Preview lift** (`box-shadow: 0 18px 40px -18px rgba(11,12,12,0.6)`): the cursor-following timetable preview only.

### Named Rules
**The Mounted-Not-Floating Rule.** Shadows describe a physical object on the wall (sign, lightbox, phone). Rows, buttons and sections never get shadows; their state is a fill change.

## Shapes

Station hardware geometry. Plates are near-square with small corners (line plates 0.3em, exit plates 6px). Roundels and station dots are full pills and circles. Panels and frames barely round (3-4px), interactive controls take 6px, dark slabs 8px. Lines are drawn thick and square-ended: 6px rails, 8px section rules, 10px bands, 4px strip tracks. Arrows and controls are 2px square-cap strokes from one inline SVG sprite. The footer line band ends at a 10px yellow buffer block.

## Components

### Buttons
Solid and ticket-like.
- **Shape:** gently cornered (6px), 48px tall, wide 700-weight label (wdth 108).
- **Primary (Q):** court green with white text; deepens on hover; scales to 0.97 on press.
- **Ghost:** 2px inset ink stroke; inverts to ink with wall-coloured text on hover.
- **Pill link:** the same ghost behaviour on a full pill, 44px tall.
- **Icon button:** 44px circle, wall-deep fill on hover; on-dark variant for the tunnel.

### Line Plates and Roundels
The signage atoms every other component is built from.
- **Line plate:** a 2em square in the line colour, white wide 800 letter (P, D, Q). Large variant opens each line title.
- **Roundel:** white pill with a 3px line-coloured ring holding a station code; the dark variant sits on tunnel.
- **Exit plate:** 48px yellow square, 900-weight ink letter (A, B, C...).

### Rows (timetable, repos, change lines, exits)
- **Style:** ruled rows on the wall, code/plate left, name and quiet description centre, arrow right.
- **Hover:** the row inverts to ink (timetable, repos) or lifts to white (change lines) and its content slides 12-14px right; the arrow nudges forward. Hover effects only apply on hover-capable devices.

### Navigation
- **Strip map:** fixed ink bar. AA home roundel left; the page's stops as dots on line-coloured track segments; a "Now" readout that scrambles once to the new station name; P/D/Q plates (current plate full opacity, others 35%); a pill Map button with a three-line glyph.
- **Route map:** a right-hand wall-coloured dialog listing every stop as a vertical 6px track with ring dots; the current stop fills with its line colour and goes bold. A dark branch slab links to the other page's line.
- **Exits:** the footer is plain ink with a display-size terminus name and lettered exit rows; the line band beneath ends at the yellow buffer.

### Station Wall and Sign Panel (signature)
The glazed tile wall (56px enamel tiles with 2px grout, authored SVG at 224px repeat) appears on hero walls only. Copy on a tiled wall is mounted on the enamel sign panel; the hero name rises out of its sign line on entry.

### Photo Station and Tunnel Viewer (signature)
Photographs keep their real aspect ratio, sit on the rail with a roundel code, and open through **platform doors** (clip-path from centre, with a slight scale settle). Opening one morphs into the full-screen tunnel viewer: black ground, title and count across the top, round prev/next controls, caption and dated meta below; swipe and keys work.

### Phone Frame
App captures are shown only in a drawn device frame (433:882, dark bezel, device cast). On /tech a sticky phone crossfades between captures as ride steps scroll by.

## Do's and Don'ts

### Do:
- **Do** take every new page's navigation from the shared route list: strip dots, route map and line plates must show the same stops.
- **Do** give every line section its plate, its wide 800 title, its 8px line rule, and a 6px rail with roundel-coded stops.
- **Do** mount copy on the sign panel when it sits over the tiled wall.
- **Do** use tabular figures and roundels for any code, date or count.
- **Do** ship a reduced-motion path for every animation that lands directly on the final state.
- **Do** keep focus visible as a 3px ink outline with a 6px yellow halo (on dark grounds, an on-dark or yellow outline with no halo).

### Don't:
- **Don't** use P, D or Q as a background fill, a heading colour, or outside its own line.
- **Don't** use yellow for anything that is not an exit, a terminus or focus.
- **Don't** light more than one station at a time, or animate a highlight sliding between stops.
- **Don't** set body copy directly on the tile pattern.
- **Don't** add shadows to rows, buttons or sections; only wall-mounted objects and devices carry them.
- **Don't** apply this system to the admin pages (app/templates/admin, style.css); they keep their own look.
