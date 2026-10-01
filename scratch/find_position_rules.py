with open('scratch/live_gallery_rules.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
rules = [r.strip() for r in css.split('}') if 'position' in r]
for r in rules:
    try:
        print(r + '}')
    except:
        pass
