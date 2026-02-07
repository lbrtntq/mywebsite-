# Production-Ready Portfolio Website

A clean, minimalist, and performant portfolio website built with Python (Flask) and Vanilla JavaScript. Features a secure admin CMS for image management.

## Tech Stack
- **Backend**: Flask (Factory Pattern)
- **Database**: SQLite (SQLAlchemy)
- **Frontend**: HTML5, Vanilla CSS, Vanilla JS
- **Production**: Gunicorn, CSRF Protection, Secure File Handling

## Features
- **Dynamic Gallery**: Images load from the SQLite database.
- **Admin Panel**: Secure dashboard to upload, delete, and reorder projects.
- **Lightbox**: Custom-built, responsive image modal with metadata.
- **Responsive Design**: Optimized for mobile and desktop.
- **Production Ready**: Configured for Gunicorn and environment variables.

## Local Setup

1. **Clone the project**
2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   ```
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Setup environment variables**
   Copy `.env.example` to `.env` and fill in your secrets.
   ```bash
   cp .env.example .env
   ```
5. **Initialize the database**
   ```bash
   python init_db.py
   ```
6. **Run the development server**
   ```bash
   python app.py
   ```

## Admin Access
Login at `/admin/login` using the credentials defined in your `.env` file.
