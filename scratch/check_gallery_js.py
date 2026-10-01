import re

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

print("JS length:", len(js))
# search for gallery logic
matches = [m.start() for m in re.finditer(r'ladi-gallery', js)]
print("Found ladi-gallery occurrences:", len(matches))
for idx in matches[:5]:
    print("--- SNIPPET ---")
    start = max(0, idx - 100)
    end = min(len(js), idx + 300)
    print(js[start:end])
