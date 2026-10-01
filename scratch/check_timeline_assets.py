import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\raw_combined.css', 'r', encoding='utf-8') as f:
    css = f.read()

for eid in ['IMAGE88', 'IMAGE89', 'IMAGE90', 'IMAGE91', 'GROUP71', 'IMAGE85', 'BOX12', 'BOX13', 'BOX14', 'BOX15']:
    for m in re.finditer(r'#' + eid + r'\b[^{]*\{([^}]+)\}', css):
        print(f"#{eid}: {m.group(1).strip()[:120]}")
