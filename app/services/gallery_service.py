import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image, ImageOps
from app import db
from app.models.gallery import GalleryItem
from flask import current_app

class GalleryService:
    @staticmethod
    def get_all_items():
        return GalleryItem.query.order_by(GalleryItem.order.asc()).all()

    @staticmethod
    def allowed_file(filename):
        extensions = current_app.config.get('ALLOWED_EXTENSIONS', 'png,jpg,jpeg,gif').split(',')
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions

    @staticmethod
    def save_item(file, title, description):
        if file and GalleryService.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Use unique filename to avoid collisions
            unique_filename = f"{uuid.uuid4().hex}_{filename}"
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            
            # Save and optimize image
            img = Image.open(file)
            img = ImageOps.exif_transpose(img) # Fix orientation
            # Optional: resize or optimize here
            img.save(filepath, optimize=True, quality=85)

            # Create DB entry
            item = GalleryItem(
                title=title,
                description=description,
                filename=unique_filename,
                order=GalleryItem.query.count()
            )
            db.session.add(item)
            db.session.commit()
            return item
        return None

    @staticmethod
    def delete_item(item_id):
        item = GalleryItem.query.get(item_id)
        if item:
            # Delete file
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], item.filename)
            if os.path.exists(filepath):
                os.remove(filepath)
            
            # Delete DB entry
            db.session.delete(item)
            db.session.commit()
            return True
        return False

    @staticmethod
    def update_item(item_id, title, description, file=None):
        item = GalleryItem.query.get(item_id)
        if not item:
            return None
        
        item.title = title
        item.description = description
        
        if file and GalleryService.allowed_file(file.filename):
            # Delete old file
            old_filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], item.filename)
            if os.path.exists(old_filepath):
                os.remove(old_filepath)
                
            # Save new file
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4().hex}_{filename}"
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            
            img = Image.open(file)
            img = ImageOps.exif_transpose(img) # Fix orientation
            img.save(filepath, optimize=True, quality=85)
            item.filename = unique_filename
            
        db.session.commit()
        return item

    @staticmethod
    def reorder_items(item_id_list):
        for index, item_id in enumerate(item_id_list):
            item = GalleryItem.query.get(item_id)
            if item:
                item.order = index
        db.session.commit()
