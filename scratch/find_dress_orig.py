import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find matches for dress
matches = [(m.start(), html[max(0, m.start()-100):min(len(html), m.start()+200)]) for m in re.finditer(r'dress', html, re.IGNORECASE)]
print(f"Found {len(matches)} matches for 'dress':")
for pos, snippet in matches:
    print("--- SNIPPET ---")
    print(snippet)
