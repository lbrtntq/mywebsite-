from datetime import datetime

import pytest

from app import create_app, db
from app.models.gallery import GalleryItem
from app.services import photo_service

CLOUD = 'https://res.cloudinary.com/demo/image/upload/v1/portfolio/{}.jpg'


@pytest.fixture
def client(monkeypatch):
    # Never call Cloudinary from tests: wide for "a", upright for everything else.
    monkeypatch.setattr(photo_service, '_fetch_size', lambda url: (3672, 2066) if url.endswith('/a.jpg') else (3024, 4032))
    photo_service._sizes.clear()
    app = create_app({
        'TESTING': True,
        'SECRET_KEY': 'test',
        'SQLALCHEMY_DATABASE_URI': 'sqlite://',
        'WTF_CSRF_ENABLED': False,
        'UPLOAD_FOLDER': '/tmp',
    })
    with app.app_context():
        db.create_all()
        for n, (name, title, desc) in enumerate([
            ('a', 'After the Fireworks', 'A night portrait.'),
            ('b', 'Urban Pulse at Studio City Macau', 'Studio City Macau at night.'),
            ('c', 'Vertical City', 'A cityscape capture of Hong Kong.'),
        ]):
            db.session.add(GalleryItem(title=title, description=desc, filename=CLOUD.format(name),
                                       order=n, created_at=datetime(2026, 2, 7)))
        db.session.commit()
        yield app.test_client()


def test_home_renders_every_photo_as_a_station(client):
    html = client.get('/').get_data(as_text=True)
    assert 'id="p1"' in html and 'id="p3"' in html
    assert 'After the Fireworks' in html and 'Vertical City' in html
    assert 'station--wide' in html and 'station--tall' in html
    assert 'c_limit,w_1600' in html  # srcset reaches the large widths


def test_poster_is_the_first_upright_photo(client):
    html = client.get('/').get_data(as_text=True)
    poster = html[html.index('class="poster"'):html.index('</figure>', html.index('class="poster"'))]
    assert 'Urban Pulse at Studio City Macau' in poster


def test_places_come_from_captions(client):
    html = client.get('/').get_data(as_text=True)
    assert 'Hong Kong' in html and 'Macau' in html


def test_tech_page_and_seo_routes(client):
    assert client.get('/tech').status_code == 200
    assert 'Disallow: /admin/' in client.get('/robots.txt').get_data(as_text=True)
    assert '/tech</loc>' in client.get('/sitemap.xml').get_data(as_text=True)


def test_empty_gallery_still_renders(client):
    GalleryItem.query.delete()
    db.session.commit()
    res = client.get('/')
    assert res.status_code == 200
    assert 'No photographs on this line yet.' in res.get_data(as_text=True)
