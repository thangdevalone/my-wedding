import re

with open('scratch/ladipagev3.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Let's search for occurrences of "gallery" in function definitions or prototypes
matches = [m.start() for m in re.finditer(r'gallery', js, re.IGNORECASE)]
print(f"Total matches: {len(matches)}")

# Look for gallery methods like runEventGallery or galleryNext or similar
results = set(re.findall(r'[a-zA-Z0-9_$]+\.[a-zA-Z0-9_$]*gallery[a-zA-Z0-9_$]*', js, re.IGNORECASE))
print("Identifiers with gallery:", results)

# Also search for 'ladi-gallery-control-arrow' or 'ladi-gallery-view-arrow'
for pattern in ['ladi-gallery-control-arrow', 'ladi-gallery-view-arrow', 'data-index']:
    m = re.search(re.escape(pattern), js)
    if m:
        print(f"Pattern '{pattern}' found at {m.start()}:")
        print(js[max(0, m.start()-100):min(len(js), m.end()+200)])
