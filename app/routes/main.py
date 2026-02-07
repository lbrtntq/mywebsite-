from flask import Blueprint, render_template
from app.services.gallery_service import GalleryService

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    gallery_items = GalleryService.get_all_items()
    return render_template('index.html', gallery_items=gallery_items)
