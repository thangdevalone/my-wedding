import urllib.request, re

resp = urllib.request.urlopen('http://localhost:3000')
html = resp.read().decode('utf-8')
css_links = re.findall(r'<link[^>]*href="([^"]+)"', html)
print('All links in HTML:', css_links)
for l in css_links:
    u = 'http://localhost:3000' + l if l.startswith('/') else l
    try:
        c = urllib.request.urlopen(u).read().decode('utf-8')
        has_hs = 'MUZUViWSVAtSElHSCTUElSSVRFRCPVEY' in c
        has_erg = 'MUZUViWSVAtRXJnaXNhLVJlZVsYXIgKDEpLmZg' in c
        print(f'{l} -> len={len(c)}, has high-spirited: {has_hs}, has ergisa: {has_erg}')
    except Exception as e:
        print(f'{l} -> ERROR: {e}')
