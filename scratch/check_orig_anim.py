import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check animations in CSS
keyframes = re.findall(r'@(?:-webkit-)?keyframes\s+([a-zA-Z0-9_-]+)', html)
print("Keyframes found in CSS:", set(keyframes))

# Check animation classes and data attributes in HTML
anim_elements = re.findall(r'id="([^"]+)"[^>]*class="[^"]*ladi-animation[^"]*"', html)
print(f"Elements with ladi-animation in class: {len(anim_elements)}")

# Check style rules with animation-name
anim_rules = re.findall(r'(#[a-zA-Z0-9_-]+)[^{]*\{[^}]*animation-name:\s*([^;]+)', html)
print(f"Elements with animation-name in CSS: {len(anim_rules)}")
for eid, aname in anim_rules[:15]:
    print(f"  {eid:15} -> {aname.strip()}")

# Also check how ladi handled scroll animations (did it use an event or JS or CSS?)
scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.DOTALL)
print(f"Total script tags: {len(scripts)}")
for i, s in enumerate(scripts):
    if 'animation' in s.lower() or 'fade' in s.lower() or 'intersection' in s.lower():
        print(f"Script {i} (len {len(s)}): contains animation terms")
