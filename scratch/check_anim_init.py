import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.DOTALL)
print(f"Total script tags: {len(scripts)}")

for i, s in enumerate(scripts):
    lines = s.split('\n')
    anim_lines = [l.strip() for l in lines if any(w in l.lower() for w in ['animate', 'animation', 'fade', 'hidden', 'scroll'])]
    if anim_lines:
        print(f"\n--- Script {i} has {len(anim_lines)} animation lines ---")
        for al in anim_lines[:10]:
            print(" ", al[:120])
