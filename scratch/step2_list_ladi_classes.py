import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\raw_combined.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

css_classes = set(re.findall(r'\.(ladi-[a-zA-Z0-9_-]+)', css))
html_classes = set(re.findall(r'\b(ladi-[a-zA-Z0-9_-]+)\b', html))

print(f"Total ladi classes in CSS: {len(css_classes)}")
print(f"Total ladi classes in HTML: {len(html_classes)}")

all_ladi_classes = sorted(css_classes | html_classes, key=lambda x: -len(x))
print("\nAll ladi classes (longest first):")
for c in all_ladi_classes:
    in_css = c in css_classes
    in_html = c in html_classes
    print(f"  {c:35} (CSS: {in_css}, HTML: {in_html})")
