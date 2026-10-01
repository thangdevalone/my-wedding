with open('scratch/ladipagev3.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
matches = [m.start() for m in re.finditer(r'gallery-view-arrow', js)]
for m in matches:
    print("Match at", m)
    print(js[max(0, m - 100):min(len(js), m + 400)])
    print("="*60)
