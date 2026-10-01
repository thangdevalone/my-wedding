import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

for hid in ['HEADLINE134', 'HEADLINE135', 'HEADLINE136', 'HEADLINE137', 'HEADLINE128', 'HEADLINE106', 'IMAGE70', 'BOX17', 'GROUP3']:
    for m in re.finditer(r'#' + hid + r'\b[^{]*\{([^}]+)\}', css):
        print(f"#{hid}: {m.group(0)[:120]}")
