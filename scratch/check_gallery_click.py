import re

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

for m in re.finditer(r'ladi-gallery-view-item', js):
    idx = m.start()
    snippet = js[max(0, idx-100):min(len(js), idx+200)]
    if 'addEvent' in snippet or 'click' in snippet or 'light' in snippet:
        print("--- MATCH ---")
        print(snippet)
