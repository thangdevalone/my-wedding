with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

import re
rules = []
for m in re.finditer(r'([^{}]*ladi-gallery[^{}]*)\{([^}]+)\}', c):
    sel = m.group(1).strip()
    rule = m.group(2).strip()
    if 'lazyload' not in sel:
        # replace ladi- with w-
        sel_w = sel.replace('ladi-', 'w-')
        rules.append(f"{sel_w} {{{rule}}}")

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\pristine_gallery.css', 'w', encoding='utf-8') as out:
    out.write("\n".join(rules))

print(f"Extracted {len(rules)} pristine gallery CSS rules to scratch/pristine_gallery.css")
