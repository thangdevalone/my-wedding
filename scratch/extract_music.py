with open('scratch/live_redtone.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
m = re.search(r'<!-- MUSIC.*?(?:</script>|$)', html, re.DOTALL)
if m:
    with open('scratch/original_music_toggle.html', 'w', encoding='utf-8') as out:
        out.write(m.group(0))
    print("Saved original_music_toggle.html, length:", len(m.group(0)))
else:
    print("Not found")
