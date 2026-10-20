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
    stations = as_stations(pagination.items, offset=(pagination.page - 1) * PER_PAGE)

    # The poster on the interchange wall: the first upright photo in display order.
    first = GalleryItem.query.order_by(GalleryItem.order.asc()).limit(PER_PAGE).all()
    candidates = as_stations(first)
    poster = next((s for s in candidates if s['shape'] == 'tall'), candidates[0] if candidates else None)

    latest = GalleryItem.query.order_by(GalleryItem.created_at.desc()).first()

    route = [_stop('interchange', 'Interchange', 'x')]
    route.append(_stop('photography', 'Photography line', 'p', 'P'))
    route += [_stop(f"p{s['n']}", s['title'], 'p', s['code']) for s in stations]
    route += [
        _stop('about', 'About me', 'd', 'D1'),
        _stop('pipeline', 'How a photo gets here', 'd', 'D2'),
        _stop('experiments', 'Experiments', 'd', 'D3'),
        _stop('paqueueka', 'PaQueueKa', 'q', 'Q'),
        _stop('exits', 'Exits', 'x'),
    ]
    return render_template(
        'index.html',
        pagination=pagination,
        stations=stations,
        poster=poster,
        total_photos=pagination.total,
        latest_upload=latest.created_at if latest else None,
        route=route,
        branch={'href': url_for('main.tech'), 'line': 'q', 'letter': 'Q', 'label': 'PaQueueKa, the full route'},
    )


@bp.route('/tech')
def tech():
    route = [
        _stop('interchange', 'Interchange', 'x', href=url_for('main.index')),
        _stop('q-top', 'PaQueueKa', 'q', 'Q'),
        _stop('q-why', 'Why I built it', 'q', 'Q1'),
        _stop('q-ride', 'One session, start to finish', 'q', 'Q2'),
        _stop('q-modes', 'Rotation modes', 'q', 'Q3'),
        _stop('q-stack', 'Under the hood', 'q', 'Q4'),
        _stop('q-get', 'Get the app', 'q', 'Q5'),
        _stop('exits', 'Exits', 'x'),
    ]
    return render_template(
        'tech.html',
        route=route,
        branch={'href': url_for('main.index') + '#photography', 'line': 'p', 'letter': 'P', 'label': 'Back to the photographs'},
    )


def _stop(stop_id, label, line, code=None, href=None):
    return {'id': stop_id, 'label': label, 'line': line, 'code': code, 'href': href or f'#{stop_id}'}


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
