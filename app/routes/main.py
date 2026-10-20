from flask import Blueprint, render_template, request, Response, url_for
from app.services.gallery_service import GalleryService
from app.services.photo_service import as_stations
from app.models.gallery import GalleryItem

bp = Blueprint('main', __name__)

PER_PAGE = 12


@bp.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    pagination = GalleryService.get_paginated_items(page=page, per_page=PER_PAGE)
    photos = as_stations(pagination.items, offset=(pagination.page - 1) * PER_PAGE)

    # The opening frame: the first landscape photo in display order fills the
    # screen, and the rest of the page's photos follow it one room at a time.
    first = as_stations(GalleryItem.query.order_by(GalleryItem.order.asc()).limit(PER_PAGE).all())
    cover = next((p for p in first if p['shape'] == 'wide'), first[0] if first else None)
    rooms = [p for p in photos if not cover or p['id'] != cover['id']]

    latest = GalleryItem.query.order_by(GalleryItem.created_at.desc()).first()
    return render_template(
        'index.html',
        pagination=pagination,
        photos=photos,
        rooms=rooms,
        cover=cover,
        viewer_items=([cover] if cover and cover not in photos else []) + photos,
        total_photos=pagination.total,
        latest_upload=latest.created_at if latest else None,
    )


@bp.route('/tech')
def tech():
    return render_template('tech.html')


@bp.route('/robots.txt')
def robots():
    body = f"User-agent: *\nDisallow: /admin/\nSitemap: {url_for('main.sitemap', _external=True)}\n"
    return Response(body, mimetype='text/plain')


@bp.route('/sitemap.xml')
def sitemap():
    urls = [url_for('main.index', _external=True), url_for('main.tech', _external=True)]
    rows = ''.join(f'<url><loc>{u}</loc></url>' for u in urls)
    xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{rows}</urlset>'
    return Response(xml, mimetype='application/xml')
