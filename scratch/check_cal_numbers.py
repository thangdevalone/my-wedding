import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check calendar numbers
for m in re.finditer(r'#(?:HEADLINE11|HEADLINE35)\b[^{}]*\{[^}]*\}', html):
    print("Calendar days rule in redtone:", m.group(0))

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    wcss = f.read()

for m in re.finditer(r'#(?:HEADLINE11|HEADLINE35)\b[^{}]*\{[^}]*\}', wcss):
    print("Calendar days rule in wedding.css:", m.group(0))
