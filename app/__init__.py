import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_wtf.csrf import CSRFProtect
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()
csrf = CSRFProtect()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    
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
    def inject_year():
        import datetime
        return {'current_year': datetime.datetime.now().year}

    return app
