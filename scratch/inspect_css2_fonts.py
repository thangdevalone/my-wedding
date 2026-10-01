import re, os

with open(r'd:\thiepcuoi\wedding-nextjs\public\css\css2', 'r', encoding='utf-8') as f:
    c = f.read()

font_faces = re.findall(r'@font-face\s*\{([^}]+)\}', c)
print(f'Total font-faces in css2: {len(font_faces)}')
by_family = {}
for ff in font_faces:
    fam = re.search(r"font-family:\s*['\"]?([^;'\"\n]+)", ff)
    src = re.search(r"src:\s*url\(['\"]?([^;'\"\)\n]+)", ff)
    f_fam = fam.group(1).strip() if fam else '?'
    f_src = src.group(1).strip() if src else '?'
    if f_fam not in by_family:
        by_family[f_fam] = []
    by_family[f_fam].append(f_src)

for fam, srcs in by_family.items():
    print(f'\nFamily: {fam} ({len(srcs)} rules)')
    for s in srcs[:2]:
        # check if file exists
        # In css2: src: url(../fonts/google/filename.woff2)
        # Relative to /css/css2, this resolves to /fonts/google/filename.woff2
        norm_s = s.replace('../fonts/google/', 'd:/thiepcuoi/wedding-nextjs/public/fonts/google/')
        exists = os.path.exists(norm_s)
        print(f'  {s} -> exists: {exists}')
