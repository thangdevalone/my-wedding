import re

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

for m in re.finditer(r'([^{}]*gallery[^{}]*)\{([^}]+)\}', c, re.I):
    print("SELECTOR:", m.group(1).strip())
    print("RULES:", m.group(2).strip())
    print("---------------------------------")
