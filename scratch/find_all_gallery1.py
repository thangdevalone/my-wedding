import re
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

indices = [m.start() for m in re.finditer(r'GALLERY1', c)]
print("Total occurrences of GALLERY1:", len(indices))
for idx in indices:
    print("--- Occur at", idx)
    print(c[idx-30:idx+150])
