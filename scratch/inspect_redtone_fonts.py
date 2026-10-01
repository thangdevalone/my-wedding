import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Search for @font-face in actual redtone
font_faces = re.findall(r'@font-face\s*\{([^}]+)\}', html)
print(f'=== FONT FACES IN ACTUAL REDTONE: {len(font_faces)} ===')
for ff in font_faces:
    fam = re.search(r"font-family:\s*['\"]?([^;'\"\n]+)", ff)
    src = re.search(r"src:\s*url\(['\"]?([^'\")\n]+)", ff)
    f_fam = fam.group(1).strip() if fam else "?"
    f_src = src.group(1).strip() if src else "?"
    print(f'  {f_fam} -> {f_src}')

# 2. Search for external fonts (Google Fonts, etc.)
links = re.findall(r'<link[^>]*>', html)
print(f'\n=== FONT / CSS LINKS IN ACTUAL REDTONE: ===')
for l in links:
    if 'font' in l.lower() or 'stylesheet' in l.lower():
        print(' ', l)

# 3. Search for style tags
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
print(f'\n=== STYLE TAGS: {len(styles)} ===')

# 4. Check CSS rules for:
# HEADLINE128, HEADLINE137, HEADLINE115 (Bá Kiên & Quỳnh Anh)
# HEADLINE142, HEADLINE143 (a, k)
# HEADLINE116 (We step into a new chapter together...)
target_ids = ['HEADLINE128', 'HEADLINE137', 'HEADLINE115', 'HEADLINE142', 'HEADLINE143', 'HEADLINE116', 'HEADLINE108', 'HEADLINE134', 'HEADLINE135', 'HEADLINE136']
print('\n=== CSS RULES FOR TARGET IDS IN ACTUAL REDTONE ===')
for tid in target_ids:
    m = re.findall(r'([^{}]*#' + tid + r'\b[^{}]*\{[^}]*\})', html)
    print(f'#{tid}:')
    for rule in m:
        if any(p in rule for p in ['font-family', 'font-size', 'line-height', 'letter-spacing']):
            print('  ', rule.strip())
