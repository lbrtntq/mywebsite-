import os
import cloudinary.uploader
from app import db
from app.models.gallery import GalleryItem
from flask import current_app

class GalleryService:
    @staticmethod
    def get_all_items():
        return GalleryItem.query.order_by(GalleryItem.order.asc()).all()

    @staticmethod
    def get_paginated_items(page, per_page=12):
        return GalleryItem.query.order_by(GalleryItem.order.asc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

    @staticmethod
    def allowed_file(filename):
        extensions = current_app.config.get('ALLOWED_EXTENSIONS', 'png,jpg,jpeg,gif').split(',')
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions

    @staticmethod
    def save_item(file, title, description):
        if file and GalleryService.allowed_file(file.filename):
            try:
                print(f"Attempting to upload to Cloudinary: {file.filename}")
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    file,
                    folder="portfolio",
                    resource_type="image"
                )
                print(f"Cloudinary upload successful: {upload_result.get('secure_url')}")
                
                # Create DB entry using Cloudinary's secure URL
                item = GalleryItem(
                    title=title,
                    description=description,
                    filename=upload_result['secure_url'], # Store full URL
                    order=GalleryItem.query.count()
                )
                db.session.add(item)
                db.session.commit()
                print("Database entry created successfully.")
                return item
            except Exception as e:
                print(f"CLOUDINARY UPLOAD ERROR: {str(e)}")
                db.session.rollback()
                return None
        return None

    @staticmethod
    def delete_item(item_id):
        item = GalleryItem.query.get(item_id)
        if item:
            # Delete from Cloudinary
            # Extract public_id from URL: e.g., https://res.cloudinary.com/.../portfolio/xyz.jpg -> portfolio/xyz
            try:
                public_id = item.filename.split('/')[-2] + '/' + item.filename.split('/')[-1].split('.')[0]
                cloudinary.uploader.destroy(public_id)
            except Exception as e:
                print(f"Error deleting from Cloudinary: {e}")
            
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
            # Delete old image from Cloudinary
            try:
                public_id = item.filename.split('/')[-2] + '/' + item.filename.split('/')[-1].split('.')[0]
                cloudinary.uploader.destroy(public_id)
            except Exception:
                pass
                
            # Upload new to Cloudinary
            upload_result = cloudinary.uploader.upload(
                file,
                folder="portfolio",
                resource_type="image"
            )
            item.filename = upload_result['secure_url']
            
        db.session.commit()
        return item

    @staticmethod
    def reorder_items(item_id_list):
        for index, item_id in enumerate(item_id_list):
            item = GalleryItem.query.get(item_id)
            if item:
                item.order = index
        db.session.commit()
