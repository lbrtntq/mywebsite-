import os
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_wtf.csrf import CSRFProtect
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

db = SQLAlchemy()
bcrypt = Bcrypt()
csrf = CSRFProtect()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    # Render terminates TLS in front of gunicorn; trust its forwarded headers
    # so canonical URLs, the sitemap and Open Graph tags come out as https.
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
    
    # Load configuration
    if test_config is None:
        db_url = os.environ.get('DATABASE_URL', 'sqlite:///portfolio.db')
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
            
        app.config.from_mapping(
            SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
            SQLALCHEMY_DATABASE_URI=db_url,
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            UPLOAD_FOLDER=os.path.join(app.root_path, 'static', 'uploads'),
            MAX_CONTENT_LENGTH=int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)),
        )
    else:
        app.config.from_mapping(test_config)

    # Ensure upload folder exists
    try:
        os.makedirs(app.config['UPLOAD_FOLDER'])
    except OSError:
        pass

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    csrf.init_app(app)

    # Register blueprints
    from .routes import main, auth, gallery
    app.register_blueprint(main.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(gallery.bp)
    
    @app.context_processor
    def inject_site():
        import datetime
        return {
            'current_year': datetime.datetime.now().year,
            'links': {
                'github': 'https://github.com/lbrtntq',
                'linkedin': 'https://www.linkedin.com/in/albert-antioquia-ph/',
                'youtube': 'https://www.youtube.com/@LBRTNTQ',
                'paqueueka': 'https://paqueueka.info',
                'app_store': 'https://apps.apple.com/ph/app/paqueueka-court-queue/id6770977347',
                'play_store': 'https://play.google.com/store/apps/details?id=com.paqueueka.app',
            },
        }

    @app.template_global('asset')
    def asset_url(filename):
        """A static URL that changes whenever the file does, so deploys bust caches."""
        from flask import url_for
        path = os.path.join(app.static_folder, filename)
        try:
            version = int(os.path.getmtime(path))
        except OSError:
            version = 0
        return url_for('static', filename=filename, v=version)

    @app.template_filter('cl')
    def cloudinary_transform(url, transforms='f_auto,q_auto,w_1200'):
        """Insert Cloudinary transforms after /upload/. No-ops on non-Cloudinary URLs."""
        if url and 'cloudinary.com' in url and '/upload/' in url:
            return url.replace('/upload/', f'/upload/{transforms}/', 1)
        return url

    @app.template_filter('srcset')
    def cloudinary_srcset(url, widths=(480, 800, 1200, 1600, 2200)):
        """A responsive srcset of auto-format, auto-quality widths."""
        if not (url and 'cloudinary.com' in url and '/upload/' in url):
            return ''
        return ', '.join(f"{cloudinary_transform(url, f'f_auto,q_auto,c_limit,w_{w}')} {w}w" for w in widths)

    @app.template_filter('photo_json')
    def photo_json(station):
        """What the full-screen viewer needs to know about one photo."""
        return {
            'id': station['id'],
            'code': station['code'],
            'title': station['title'],
            'description': station['description'],
            'place': station['place'],
            'date': station['date'].strftime('%B %Y') if station['date'] else '',
            'width': station['width'],
            'height': station['height'],
            'src': cloudinary_transform(station['url'], 'f_auto,q_auto,c_limit,w_1600'),
            'srcset': cloudinary_srcset(station['url']),
        }

    @app.template_filter('natural_join')
    def natural_join(items):
        """['a', 'b', 'c'] -> 'a, b and c'."""
        items = list(items)
        if len(items) < 2:
            return ''.join(items)
        return f"{', '.join(items[:-1])} and {items[-1]}"

    @app.template_filter('stamp')
    def date_stamp(value):
        return value.strftime('%d.%m.%Y') if value else ''

    return app
