import json
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor

# Places the site knows how to label. The first one found in a photo's title
# or caption becomes its station's place name; photos without one stay blank.
KNOWN_PLACES = [
    'Hong Kong', 'Macau', 'Bangkok', 'Thailand', 'Philippines', 'Manila',
    'Cebu', 'Baguio', 'Singapore', 'Taipei', 'Taiwan', 'Tokyo', 'Japan',
    'Seoul', 'Korea', 'Vietnam',
]

FALLBACK_SIZE = (3, 4)
_FAILED_TTL = 600  # retry Cloudinary after 10 minutes if a lookup failed

_sizes = {}


def _is_cloudinary(url):
    return bool(url) and 'cloudinary.com' in url and '/upload/' in url


def _fetch_size(url):
    """Ask Cloudinary for the delivered pixel size of an image."""
    info_url = url.replace('/upload/', '/upload/fl_getinfo/', 1)
    try:
        with urllib.request.urlopen(info_url, timeout=3) as res:
            data = json.load(res)
        dims = data.get('output') or data.get('input')
        return int(dims['width']), int(dims['height'])
    except Exception:
        return None


def remember_size(url, width, height):
    """Prime the cache from an upload result so new photos never need a lookup."""
    if url and width and height:
        _sizes[url] = (int(width), int(height), None)


def sizes_for(urls):
    now = time.time()
    missing = [
        u for u in urls
        if _is_cloudinary(u) and (
            u not in _sizes or (_sizes[u][2] is not None and now - _sizes[u][2] > _FAILED_TTL)
        )
    ]
    if missing:
        with ThreadPoolExecutor(max_workers=min(8, len(missing))) as pool:
            for url, size in zip(missing, pool.map(_fetch_size, missing)):
                _sizes[url] = (*size, None) if size else (*FALLBACK_SIZE, now)
    return {u: _sizes.get(u, (*FALLBACK_SIZE, None))[:2] for u in urls}


def place_of(item):
    text = f'{item.title} {item.description or ""}'
    for place in KNOWN_PLACES:
        if place.lower() in text.lower():
            return place
    return None


def as_stations(items, offset=0):
    """Gallery rows shaped for the templates: one station per photo."""
    sizes = sizes_for([i.filename for i in items])
    stations = []
    for n, item in enumerate(items, start=offset + 1):
        w, h = sizes[item.filename]
        stations.append({
            'id': item.id,
            'code': f'P{n}',
            'n': n,
            'title': item.title,
            'description': item.description or '',
            'url': item.filename,
            'width': w,
            'height': h,
            'shape': 'wide' if w > h * 1.15 else ('tall' if h > w * 1.15 else 'square'),
            'place': place_of(item),
            'date': item.created_at,
        })
    return stations
