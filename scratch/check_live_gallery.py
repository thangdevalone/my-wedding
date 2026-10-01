with open('scratch/live_redtone.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

import re
matches = re.findall(r'([^\{\};]*(?:GALLERY1|ladi-gallery)[^\{]*\{[^\}]*\})', html)
with open('scratch/live_gallery_rules.css', 'w', encoding='utf-8') as out:
    for i, m in enumerate(matches):
        out.write(f'/* [{i}] */ {m.strip()}\n')
print(f'Saved {len(matches)} rules to scratch/live_gallery_rules.css')


