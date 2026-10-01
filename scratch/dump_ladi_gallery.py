import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

for m in re.finditer(r'(\.ladi-gallery[^{]*)\{([^}]+)\}', c):
    print(m.group(1).strip(), "=>", m.group(2).strip())
