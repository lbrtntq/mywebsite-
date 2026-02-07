from flask import Blueprint, render_template, request
from app.services.gallery_service import GalleryService

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    # Get latest 5 items for the hero carousel
    carousel_items = GalleryItem.query.order_by(GalleryItem.created_at.desc()).limit(5).all()
    # Get paginated items for the gallery grid
    pagination = GalleryService.get_paginated_items(page=page, per_page=12)
    return render_template('index.html', pagination=pagination, carousel_items=carousel_items)
