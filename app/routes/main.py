from flask import Blueprint, render_template, request, Response, url_for
from app.services.gallery_service import GalleryService
from app.services.photo_service import as_stations
from app import db
from app.models.gallery import GalleryItem

bp = Blueprint('main', __name__)

PER_PAGE = 12

# dbt_demo_university's lineage, read from the repo's ref() and source() calls.
LINEAGE = {
    'layers': [
        ('raw', 'PLV.raw', ['raw_course', 'raw_department', 'raw_faculty', 'raw_semester', 'raw_teaching_assignments']),
        ('staging', 'staging', ['staging_course', 'staging_department', 'staging_faculty', 'staging_semester', 'staging_teaching_assignments']),
        ('dims', 'marts', ['dim_course', 'dim_department', 'dim_faculty', 'dim_time']),
        ('fact', 'marts', ['facts_teaching_assignments']),
    ],
    'edges': [
        ['raw_course', 'staging_course'], ['raw_department', 'staging_department'],
        ['raw_faculty', 'staging_faculty'], ['raw_semester', 'staging_semester'],
        ['raw_teaching_assignments', 'staging_teaching_assignments'],
        ['staging_course', 'dim_course'], ['staging_department', 'dim_department'],
        ['staging_faculty', 'dim_faculty'], ['staging_semester', 'dim_time'],
        ['dim_course', 'facts_teaching_assignments'], ['dim_department', 'facts_teaching_assignments'],
        ['dim_faculty', 'facts_teaching_assignments'], ['dim_time', 'facts_teaching_assignments'],
        ['staging_teaching_assignments', 'facts_teaching_assignments'],
    ],
}


@bp.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    pagination = GalleryService.get_paginated_items(page=page, per_page=PER_PAGE)
    photos = as_stations(pagination.items, offset=(pagination.page - 1) * PER_PAGE)

    # The photographs as one day: ordered by the time of day each was taken
    # (from EXIF), so the page can walk from late morning to fireworks.
    # Photos without a capture time follow in display order.
    day = sorted((p for p in photos if p['minute'] is not None), key=lambda p: p['minute'])
    day += [p for p in photos if p['minute'] is None]

    # "Follow one photo": the first photo of the day, as each stage of this
    # site's pipeline actually sees it.
    trace = None
    if day:
        first = day[0]
        row = db.session.get(GalleryItem, first['id'])
        row_dict = row.to_dict() if row else {}
        if len(row_dict.get('description') or '') > 64:
            row_dict['description'] = row_dict['description'][:61].rstrip() + '...'
        trace = {'photo': first, 'row': row_dict}

    latest = GalleryItem.query.order_by(GalleryItem.created_at.desc()).first()
    return render_template(
        'index.html',
        pagination=pagination,
        photos=photos,
        day=day,
        viewer_items=day,
        trace=trace,
        lineage=LINEAGE,
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
