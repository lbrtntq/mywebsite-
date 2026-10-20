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
    # Capture times: the fireworks at night, the others by day, one with no EXIF.
    taken = {'a': datetime(2024, 11, 6, 20, 19), 'b': datetime(2024, 11, 5, 19, 14), 'c': datetime(2024, 11, 4, 11, 5)}
    monkeypatch.setattr(photo_service, '_read_taken', lambda url: taken.get(url.rsplit('/', 1)[-1][:-4]))
    photo_service._sizes.clear()
    photo_service._taken.clear()
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


def test_day_orders_photos_by_the_time_they_were_taken(client):
    html = client.get('/').get_data(as_text=True)
    day = html[html.index('data-day'):html.index('id="photographs"')]
    # 11:05 AM (Vertical City) before 7:14 PM (Studio City) before 8:19 PM (fireworks).
    assert day.index('Vertical City') < day.index('Urban Pulse') < day.index('After the Fireworks')
    assert '11:05 AM' in day and '8:19 PM' in day
    assert 'data-minute="665"' in day
    assert 'c_limit,w_1600' in html  # srcset reaches the large widths


def test_hero_deck_starts_with_the_earliest_photo(client):
    html = client.get('/').get_data(as_text=True)
    deck = html[html.index('data-deck'):html.index('data-day')]
    assert deck.index('Vertical City') < deck.index('Urban Pulse')


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
    assert 'No photographs here yet.' in res.get_data(as_text=True)
