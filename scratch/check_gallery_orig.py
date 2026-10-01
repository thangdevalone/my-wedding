import re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.DOTALL)
s7 = scripts[7].strip()
data = json.loads(s7)

if 'GALLERY1' in data:
    print("GALLERY1 config in script 7:")
    print(json.dumps(data['GALLERY1'], indent=2))
