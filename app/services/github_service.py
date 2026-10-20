import json
import time
import urllib.request
from datetime import datetime, timezone

USER = 'lbrtntq'
_TTL = 3600
_FAIL_TTL = 300
_cache = {'at': 0, 'data': None}


def _get(url):
    req = urllib.request.Request(url, headers={'Accept': 'application/vnd.github+json', 'User-Agent': 'albert-antioquia-site'})
    with urllib.request.urlopen(req, timeout=2) as res:
        return json.load(res)


def _ago(stamp):
    pushed = datetime.fromisoformat(stamp.replace('Z', '+00:00'))
    days = (datetime.now(timezone.utc) - pushed).days
    if days < 1:
        return 'today'
    if days == 1:
        return 'yesterday'
    if days < 30:
        return f'{days} days ago'
    return pushed.strftime('%B %Y')


def github_stats():
    """Public numbers for the footer, from GitHub's public API, cached an hour.

    Returns None when GitHub can't be reached, and the footer simply leaves
    the line out. Failures are cached too so a slow API never slows a page.
    """
    now = time.time()
    ttl = _TTL if _cache['data'] else _FAIL_TTL
    if now - _cache['at'] < ttl:
        return _cache['data']
    data = None
    try:
        user = _get(f'https://api.github.com/users/{USER}')
        repos = _get(f'https://api.github.com/users/{USER}/repos?sort=pushed&per_page=1')
        data = {
            'repos': user.get('public_repos'),
            'since': user.get('created_at', '')[:4],
            'pushed': _ago(repos[0]['pushed_at']) if repos else None,
        }
    except Exception:
        data = None
    _cache.update(at=now, data=data)
    return data
