import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Look for countdown config or date
m = re.findall(r'COUNTDOWN[^{]*\{[^}]*\}', html)
for x in m:
    print(x)

scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.DOTALL)
for s in scripts:
    if 'countdown' in s.lower():
        print("Found countdown in script:")
        print(s[:500])
