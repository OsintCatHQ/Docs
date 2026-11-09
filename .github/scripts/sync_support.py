"""Copies the published help center articles (support.osintcat.net) into support/ as Markdown, English only.

Context7 indexes this repository, so its chat widget and AI tools can answer support questions as well as API ones.
.mintignore keeps support/ off docs.osintcat.net: the articles' home is the help center, not a second copy here.

Reads the same export the help site is built from (CONTENT_EXPORT_URL, bearer CONTENT_EXPORT_TOKEN). Writes
support/<collection>/<article>.md and support/index.md, and removes files for articles that are no longer published.
Only touches support/. Exits non-zero, writing nothing, when the export can't be read or looks wrong.
"""
import json
import os
import pathlib
import shutil
import sys
import urllib.request

SITE = 'https://support.osintcat.net'
OUT = pathlib.Path('support')


def load():
    url, token = os.environ.get('CONTENT_EXPORT_URL'), os.environ.get('CONTENT_EXPORT_TOKEN')
    if not url or not token:
        sys.exit('CONTENT_EXPORT_URL and CONTENT_EXPORT_TOKEN are needed')
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}', 'User-Agent': 'osintcat-docs-sync'})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.load(r)
    if not isinstance(data.get('items'), list) or not isinstance(data.get('collections'), list):
        sys.exit('the export has no items or collections')
    return data


def article(item, en):
    updated = (en.get('updated_at') or '')[:10]
    parts = [f"# {en['title'].strip()}", '']
    if (en.get('summary') or '').strip():
        parts += [en['summary'].strip(), '']
    parts += [(en.get('body_md') or '').strip(), '', '---', '',
              f"Source: {SITE}/articles/{item['slug']}" + (f" (updated {updated})" if updated else ''), '']
    return '\n'.join(parts)


def build(data):
    """{relative path: text} for every published English article, plus the index."""
    collections = {c['slug']: c for c in data['collections']}      # items name their collection by slug
    files, index = {}, {}
    for item in sorted(data['items'], key=lambda i: (str(i.get('collection') or ''), i.get('position') or 0)):
        en = (item.get('langs') or {}).get('en')
        coll = collections.get(item.get('collection'))
        if not en or not coll or not (en.get('body_md') or '').strip():
            continue
        path = f"{coll['slug']}/{item['slug']}.md"
        files[path] = article(item, en)
        index.setdefault(coll['slug'], []).append((en['title'].strip(), path, (en.get('summary') or '').strip()))
    lines = ['# OsintCat help center', '',
             f'Answers to common questions about OsintCat accounts, plans, billing and lookups, from {SITE}.', '']
    for coll in sorted(collections.values(), key=lambda c: c.get('position') or 0):
        if coll['slug'] not in index:
            continue
        lines += [f"## {coll['title'].strip()}", '']
        if (coll.get('description') or '').strip():
            lines += [coll['description'].strip(), '']
        lines += [f'- [{title}]({path})' + (f': {summary}' if summary else '') for title, path, summary in index[coll['slug']]]
        lines.append('')
    files['index.md'] = '\n'.join(lines)
    return files


def write(files):
    if not files or len(files) < 2:
        sys.exit('no published articles in the export; leaving support/ as it is')
    if OUT.exists():
        shutil.rmtree(OUT)
    for rel, text in files.items():
        p = OUT / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding='utf-8', newline='\n')
    print(f'support/: {len(files) - 1} articles')


if __name__ == '__main__':
    write(build(load()))
