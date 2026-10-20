# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who land on Albert Antioquia's personal site from a shared link, his GitHub, LinkedIn or YouTube, or from PaQueueKa: recruiters and engineers sizing up a data engineer, fellow builders curious about the app, friends and players from the badminton and pickleball community, and anyone who saw a photo and wanted more. Mostly on phones, a fair share on desktop at work.

## Product Purpose

A personal site that shows one person's curiosity across three outlets: mobile photography of cities and streets, data engineering, and an indie app (PaQueueKa) that runs badminton and pickleball queues. Success: a visitor leaves thinking "this person has taste, builds real things, and sees the world differently", then opens a photo, the app, or a profile link.

## Positioning

The site owner watches how things move and puts them in order. His own photo captions are about flow (cars through Bangkok, pedestrians across Senado Square, a vertical city's rhythm); his job moves data through pipelines; his app decides who plays next. No other portfolio can truthfully claim that particular thread.

## Operating Context

- Flask app on Render (gunicorn), Jinja templates, vanilla CSS/JS, no build step.
- Gallery items live in Postgres (Supabase) with images on Cloudinary; an admin dashboard at /admin uploads, edits, reorders and deletes them. The public site must keep rendering whatever the admin adds.
- Public routes: `/`, `/tech`, `/api/gallery`; admin routes under `/admin`.

## Capabilities and Constraints

- Photos: six published items (After the Fireworks, Urban Pulse at Studio City Macau, Streets of Thailand, Crossing, Vertical City, Flow Through Senado). One landscape (16:9-ish), five portrait 3:4 phone captures. Places: Hong Kong Disneyland, Macau, Bangkok/Thailand, Hong Kong.
- PaQueueKa: iOS + Android, free to start, Pro Host subscription. Verified features: scan/code to join with no account, skill-tier matchmaking, rotation modes (PaQueueKa Rotation, First in first out, Challenger's Court), live courts, Next Up planning, score entry that rotates the queue, fee splitting, clubs and Discover (find clubs near you). Site: paqueueka.info. Store links verified.
- Owner: data engineer from the Philippines; enjoys mobile photography and vlogging; builds apps; occasionally makes videos. Public dbt/Airflow demo repos on GitHub.

## Brand Commitments

- Name lockup "albertantioquia" / "AA" monogram existed; may be redrawn.
- First person, plain, warm, a little dry. Taglish allowed sparingly.

## Evidence on Hand

- Photos: Cloudinary URLs via the gallery DB (`/api/gallery`).
- App screens: real 2.0 iOS captures with demo-session data in `app/static/img/paqueueka/` (extracted from the founder's own simulator recordings).
- App icon: `app/static/img/paqueueka/app-icon.png`.
- Links: github.com/lbrtntq, linkedin.com/in/albert-antioquia-ph, youtube.com/@LBRTNTQ, paqueueka.info, App Store id6770977347, Play com.paqueueka.app.
- Absent and never to be invented: employer names, clients, awards, download counts, ratings, testimonials, user numbers, email address.

## Product Principles

1. The photographs lead; interface recedes around them.
2. Every claim traces to the shipped app, the repo, or the old site.
3. One thread ties the three worlds: things in motion, put in order.
4. Fast on a phone on mobile data; motion is optional, never required to read.

## Accessibility & Inclusion

WCAG 2.2 AA. Full reduced-motion alternative. Keyboard-operable gallery and lightbox. Alt text from each photo's own caption.
