#!/usr/bin/env python3
"""Contrôles statiques : les 3 blocs JSON se parsent, le module JS passe node --check."""
import re, json, subprocess, sys, tempfile, pathlib
s = pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').read_text(encoding='utf-8')
for sid in ['moteur-catalogue-data', 'moteur-templates-data', 'moteur-periodisation-data']:
    json.loads(re.search(r'<script id="%s" type="application/json">(.*?)</script>' % sid, s, re.S).group(1))
    print('JSON ok :', sid)
mod = re.search(r'<script type="module">(.*?)</script>', s, re.S).group(1)
with tempfile.NamedTemporaryFile('w', suffix='.mjs', delete=False) as f:
    f.write(mod)
r = subprocess.run(['node', '--check', f.name])
sys.exit(r.returncode)
