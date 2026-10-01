import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\raw_combined.css', 'r', encoding='utf-8') as f:
    css = f.read()

for did in ['HEADLINE85', 'IMAGE88', 'IMAGE89', 'IMAGE90', 'IMAGE91', 'GROUP71', 'GROUP72', 'IMAGE114']:
    for m in re.finditer(r'#' + did + r'\b[^{]*\{([^}]+)\}', css):
        print(f"#{did} {m.group(1).strip()[:100]}")
