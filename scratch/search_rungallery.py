import re
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# search for '.runGallery'
matches = [m.start() for m in re.finditer(r'runGallery', js)]
for m in matches:
    print("Match at", m)
    print(js[m-100:m+200])
