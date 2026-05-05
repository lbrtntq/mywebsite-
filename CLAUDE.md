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

Pure HTML/CSS/JS with Jinja2 templates. No build step.

- `app/templates/base.html` — shared navbar and footer layout
- `app/static/css/style.css` — CSS variables for theming; light mode default
- `app/static/js/main.js` — carousel (infinite loop via DOM-cloned slides), scroll-reveal via IntersectionObserver, navbar scroll behavior

The carousel clones the first and last slides and listens for `transitionend` to silently jump to the real slide — edit this logic carefully as timing bugs are easy to introduce.

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
