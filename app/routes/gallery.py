from flask import Blueprint, request, jsonify, redirect, url_for, session, render_template
from app.services.gallery_service import GalleryService
from functools import wraps

bp = Blueprint('gallery', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

@bp.route('/api/gallery')
def get_gallery():
    items = GalleryService.get_all_items()
    return jsonify([item.to_dict() for item in items])

@bp.route('/admin/dashboard')
@login_required
def dashboard():
    items = GalleryService.get_all_items()
    return render_template('admin/dashboard.html', items=items)

@bp.route('/admin/gallery/upload', methods=['POST'])
@login_required
def upload():
    title = request.form.get('title')
    description = request.form.get('description')
    file = request.files.get('file')
    
    if GalleryService.save_item(file, title, description):
        return redirect(url_for('gallery.dashboard'))
    return "Upload failed", 400

@bp.route('/admin/gallery/delete/<int:item_id>', methods=['POST'])
@login_required
def delete(item_id):
    if GalleryService.delete_item(item_id):
        return redirect(url_for('gallery.dashboard'))
    return "Delete failed", 400

@bp.route('/admin/gallery/edit/<int:item_id>', methods=['POST'])
@login_required
def edit(item_id):
    title = request.form.get('title')
    description = request.form.get('description')
    file = request.files.get('file')
    
    if GalleryService.update_item(item_id, title, description, file):
        return redirect(url_for('gallery.dashboard'))
    return "Update failed", 400

@bp.route('/admin/gallery/reorder', methods=['POST'])
@login_required
def reorder():
    item_ids = request.json.get('item_ids', [])
    GalleryService.reorder_items(item_ids)
    return jsonify({'status': 'success'})
