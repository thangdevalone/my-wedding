import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\raw_combined.css', 'r', encoding='utf-8') as f:
    css = f.read()

for bid in ['BOX5', 'BOX7', 'BOX18', 'BOX19']:
    for m in re.finditer(r'#' + bid + r'\b[^{]*\{([^}]+)\}', css):
        print(f"#{bid} {m.group(1).strip()[:100]}")
