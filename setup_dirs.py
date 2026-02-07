import os

dirs = [
    'app/routes',
    'app/services',
    'app/models',
    'app/templates/admin',
    'app/static/css',
    'app/static/js',
    'app/static/img',
    'app/uploads',
    'config',
    'tests'
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f"Created/Verified {d}")
