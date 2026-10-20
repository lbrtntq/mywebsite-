# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Initialize the database (first-time or after schema changes)
python init_db.py

# Run development server (debug mode, port 5000)
python app.py

# Run production server
gunicorn wsgi:app

# Run tests
pytest
```

Copy `.env.example` to `.env` and fill in values before running.

## Architecture

Flask portfolio website with a service layer pattern, Cloudinary image storage, and vanilla JS frontend.

### Backend

**App factory** in `app/__init__.py` — `create_app()` registers three blueprints and initializes Flask-SQLAlchemy, Flask-WTF (CSRF), and Flask-Bcrypt.

**Blueprints:**
- `app/routes/main.py` — public pages (`/`, `/tech`)
- `app/routes/auth.py` — admin login/logout at `/admin/*`
- `app/routes/gallery.py` — gallery API (`/api/gallery`) and admin CRUD (`/admin/dashboard`, `/admin/gallery/*`)

**Service layer** (`app/services/`) decouples business logic from routes:
- `GalleryService` handles all gallery operations including Cloudinary upload/delete and file validation
- Auth is session-based (`session['admin_logged_in']`), with credentials from env vars (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)

**Database:** SQLite by default; set `DATABASE_URL` for PostgreSQL. Single model — `GalleryItem` (`app/models/gallery.py`) stores title, description, Cloudinary URL, display order, and created_at.

### Frontend

Pure HTML/CSS/JS with Jinja2 templates. No build step, no JS dependencies.

The public site is designed as a transit system: three lines (P photography red, D data blue, Q PaQueueKa green) meet at an interchange (the home hero). Product truth lives in `PRODUCT.md`; the design direction lives in `.impeccable/surfaces/`.

- `app/templates/base.html` — public layout: SEO/OG/JSON-LD, icon sprite, the fixed **strip map** header and the **route map** dialog. Both are drawn from a `route` list of stops that each view builds (`_stop()` in `app/routes/main.py`); a stop's `id` must match a `data-station` element on the page.
- `app/templates/index.html` — interchange hero, Photography line (timetable + one station per photo), Data line, Q line teaser. `_viewer.html` is the full-screen photo viewer; `_exits.html` is the footer.
- `app/templates/tech.html` — the full PaQueueKa case study (`/tech`).
- `app/templates/admin/_layout.html` + `app/static/css/style.css` — the admin pages keep the old layout and stylesheet.
- `app/static/css/site.css` — all public styles; tokens on `:root`. Self-hosted Archivo variable font in `app/static/fonts/`.
- `app/static/js/site.js` — strip-map tracking, route map, reveals, timetable hover preview, viewer, pipeline diagram, `/tech` sticky phone. Every effect has a reduced-motion path.

`app/services/photo_service.py` turns gallery rows into stations: it asks Cloudinary (`fl_getinfo`) for each photo's size once and caches it in memory (uploads prime the cache), and derives a place name from the title/caption. App screenshots in `app/static/img/paqueueka/` are frames from real PaQueueKa 2.0 simulator recordings (demo session data).

### Image Storage

Images are stored on Cloudinary (not locally in production). `GalleryService` uploads via the Cloudinary SDK and stores the returned secure URL in the database. `app/uploads/` exists for local development but is gitignored except for `.gitkeep`.

### Environment Variables

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Flask session signing |
| `DATABASE_URL` | PostgreSQL URL (optional; defaults to SQLite) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin panel credentials |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image hosting |
| `MAX_CONTENT_LENGTH` | Upload size limit (default 16MB) |
