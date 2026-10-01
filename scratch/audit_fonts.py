import re, os, json

# 1. Audit Fonts in css2
with open(r'd:\thiepcuoi\wedding-nextjs\public\css\css2', 'r', encoding='utf-8') as f:
    c = f.read()

families_css2 = set(re.findall(r"font-family:\s*['\"]([^'\"]+)['\"]", c))
print('Fonts in /css/css2:', families_css2)

# 2. Audit Fonts in wedding.css
with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    w_css = f.read()

font_faces = re.findall(r"@font-face\s*\{([^}]+)\}", w_css)
print(f'Total @font-face in wedding.css: {len(font_faces)}')
for ff in font_faces:
    fam = re.search(r"font-family:\s*['\"]?([^;'\"]+)", ff)
    src = re.search(r"src:\s*url\(['\"]?([^'\")]+)", ff)
    f_fam = fam.group(1).strip() if fam else 'Unknown'
    f_src = src.group(1).strip() if src else 'Unknown'
    # Check if local file exists
    local_path = os.path.join(r'd:\thiepcuoi\wedding-nextjs\public', f_src.lstrip('/'))
    exists = os.path.exists(local_path)
    print(f'  Family: {f_fam} -> {f_src} (exists: {exists})')

# 3. Find all font-family declarations in original_raw.html vs wedding.css
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

orig_fonts = set(re.findall(r"font-family:\s*([^;]+);", orig_html))
w_fonts = set(re.findall(r"font-family:\s*([^;]+);", w_css))
print('\nUnique font-family rules in original:', len(orig_fonts))
print('Unique font-family rules in wedding.css:', len(w_fonts))
diff = orig_fonts - w_fonts
print('Font-family rules in orig but missing in wedding.css:', diff)
