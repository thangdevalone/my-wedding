import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

for m in re.finditer(r'#(?:HEADLINE128|HEADLINE137|HEADLINE115)\b[^{]*\{[^}]*\}', css):
    print(m.group(0))









