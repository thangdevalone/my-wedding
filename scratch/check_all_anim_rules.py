import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\raw_combined.css', 'r', encoding='utf-8') as f:
    css = f.read()

anim_rules = re.findall(r'([^\{\}]+ladi-animation[^{]*)\{([^}]+)\}', css)
print(f"Total animation rule blocks: {len(anim_rules)}")
for sel, body in anim_rules:
    print(f"\n--- {body.strip()} ---")
    selectors = [s.strip() for s in sel.split(',')]
    for s in selectors:
        print(" ", s)
