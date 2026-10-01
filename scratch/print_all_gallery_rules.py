import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# Let's search in css parts
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

for m in re.finditer(r'([^{}]*ladi-gallery[^{}]*)\{([^}]+)\}', html):
    sel = m.group(1).strip()
    rule = m.group(2).strip()
    if 'lazyload' not in sel:
        print(f"{sel} {{\n  {rule}\n}}")
