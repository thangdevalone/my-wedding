with open('scratch/live_redtone.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Search for audio or music in live_redtone.html
print("--- Searching for audio/sound/music ---")
for m in re.finditer(r'(?:audio|sound|music|mp3|play|pause|volume)', html, re.IGNORECASE):
    pos = m.start()
    print(html[max(0, pos-100):min(len(html), pos+200)])
    print("="*60)
