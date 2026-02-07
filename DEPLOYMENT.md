# Deployment Guide

This project is designed to be deployed on most modern PaaS providers or a VPS.

## Environment Variables Required
Ensure the following are set in your production environment:
- `SECRET_KEY`: A long, random string.
- `ADMIN_USERNAME`: Your desired admin username.
- `ADMIN_PASSWORD`: Your desired admin password.
- `DATABASE_URL`: `sqlite:///portfolio.db` (or path to your persistent volume).
- `MAX_CONTENT_LENGTH`: e.g., `16777216` (16MB).

## Deploying to Render / Railway / Fly.io
1. Connect your GitHub repository.
2. Set the **Build Command**: `pip install -r requirements.txt && python init_db.py`
3. Set the **Start Command**: `gunicorn wsgi:app`
4. Add the environment variables listed above.

## Deploying to VPS (Ubuntu + Nginx)
1. Install system dependencies:
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx
   ```
2. Setup the project and `gunicorn` as a systemd service.
3. **Example Nginx Config**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /static/ {
           alias /path/to/mywebsite/app/static/;
       }
   }
   ```
