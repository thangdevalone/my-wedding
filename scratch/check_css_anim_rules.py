import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\raw_combined.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Search for .animation in css
anim_selectors = re.findall(r'([^{}]*animation[^{]*)\{([^}]*)\}', css)
print(f"Selectors with 'animation': {len(anim_selectors)}")
for sel, body in anim_selectors[:20]:
    print(f"{sel.strip()[:60]} -> {body.strip()[:60]}")
