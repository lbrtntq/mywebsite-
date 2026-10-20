---
version: 1
slug: "app-templates-index-html"
primary_target: "app/templates/index.html"
related_targets: ["app/templates/tech.html"]
---

# Surface: home (/) and /tech — Experience mode

Audience: recruiters/engineers, fellow builders, the badminton/pickleball crowd, photo viewers; phone-first.
Job: feel one curious person across photos, data work and PaQueueKa; open a photo, the app, or a profile.
Proof: six real photos (Cloudinary), real PaQueueKa 2.0 captures, verified links. No invented stats, employers, emails.
History: the transit-map direction (seed d7f689c4) was rejected by the owner on 2026-10-20 ("overall look… kinda sucks"): too literal, UI chrome over photographs. Replaced by the owner-requested reimagining below; no new roll was run because the owner's feedback pinned the brief (photographs first, no gimmick components).

## Direction contract

THESIS: The photographs are the site. The page takes its light from the photograph in view, from fireworks at night to daylight streets. Refuses themed chrome (maps, badges, signage) and the card-grid portfolio.

OWN-WORLD: Night navy #0b111a, daylight #f2f3f1, court green #0f2318 for PaQueueKa only, teal accent (lime inside the court room). Rooms sampled from each photo's average colour in the browser. One face, Albert Sans: light 250–300 display against 600 for emphasis; hairline rules; no cards, no badges, no icons beyond arrows.

STORY: A full-bleed night photograph with the name; an index of photographs by title (preview follows the cursor); one photograph per screen at its own proportions with a quiet caption; a short personal statement; PaQueueKa as a court-green chapter with real screens; engineering repos and how this site moves a photo; large typographic links to close.

FIRST VIEWPORT: Cover photograph full-bleed (first landscape in display order), name top-left in two weights at ≤6rem, one-line lede, credit bottom-left (opens the viewer), "N photographs ↓" bottom-right. Minimal nav (name + four links) in white over the photo.

FORM: owner-pinned reimagining (photo-first, night-to-day). Signature interaction: the wall colour follows the photograph in view; photos open in a full-screen viewer that grows out of the thumbnail.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
