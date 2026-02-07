import os
from app import create_app, db
from app.models.gallery import GalleryItem

def init_db():
    app = create_app()
    with app.app_context():
        # Create tables
        db.create_all()
        print("Database tables created.")

        # Ensure upload folder exists
        upload_path = os.path.join(app.root_path, 'static', 'uploads')
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)
            # Create a placeholder or .gitkeep if needed
            with open(os.path.join(upload_path, '.gitkeep'), 'w') as f:
                pass
        print(f"Upload folder verified at {upload_path}")

if __name__ == '__main__':
    init_db()
