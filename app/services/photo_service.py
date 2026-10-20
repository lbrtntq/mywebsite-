import json
import struct
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

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
_taken = {}


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


def _read_taken(url):
    """When the photo was taken, from the EXIF in the first 64 KB of the original.

    Phones write DateTimeOriginal in local time, which is the time we want on
    the clock. Returns None for photos without EXIF.
    """
    try:
        req = urllib.request.Request(url, headers={'Range': 'bytes=0-65535'})
        with urllib.request.urlopen(req, timeout=3) as res:
            data = res.read(65536)
        start = data.find(b'Exif\x00\x00')
        if start < 0:
            return None
        tiff = data[start + 6:]
        order = '<' if tiff[:2] == b'II' else '>'

        def u16(o):
            return struct.unpack(order + 'H', tiff[o:o + 2])[0]

        def u32(o):
            return struct.unpack(order + 'I', tiff[o:o + 4])[0]

        def entries(offset):
            return {u16(offset + 2 + 12 * k): offset + 2 + 12 * k for k in range(u16(offset))}

        def text(entry):
            count, value = u32(entry + 4), entry + 8
            raw = tiff[u32(value):u32(value) + count] if count > 4 else tiff[value:value + count]
            return raw.rstrip(b'\x00').decode('ascii')

        ifd0 = entries(u32(4))
        stamp = None
        if 0x8769 in ifd0:
            exif = entries(u32(ifd0[0x8769] + 8))
            if 0x9003 in exif:
                stamp = text(exif[0x9003])
        if not stamp and 0x0132 in ifd0:
            stamp = text(ifd0[0x0132])
        return datetime.strptime(stamp, '%Y:%m:%d %H:%M:%S') if stamp else None
    except Exception:
        return None


def taken_for(urls):
    missing = [u for u in urls if _is_cloudinary(u) and u not in _taken]
    if missing:
        with ThreadPoolExecutor(max_workers=min(8, len(missing))) as pool:
            for url, taken in zip(missing, pool.map(_read_taken, missing)):
                _taken[url] = taken
    return {u: _taken.get(u) for u in urls}


def place_of(item):
    text = f'{item.title} {item.description or ""}'
    for place in KNOWN_PLACES:
        if place.lower() in text.lower():
            return place
    return None


def as_stations(items, offset=0):
    """Gallery rows shaped for the templates: one station per photo."""
    sizes = sizes_for([i.filename for i in items])
    taken = taken_for([i.filename for i in items])
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
            'taken': taken[item.filename],
            'minute': taken[item.filename].hour * 60 + taken[item.filename].minute if taken[item.filename] else None,
        })
    return stations
