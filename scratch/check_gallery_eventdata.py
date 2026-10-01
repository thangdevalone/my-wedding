import re, json

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# search for eventData or GALLERY1 in scripts
idx = c.find('"GALLERY1"')
idx = c.find('"GALLERY1"', idx + 10)
while idx != -1:
    print("Found GALLERY1 at", idx)
    print(c[max(0, idx-50):min(len(c), idx+400)])
    idx = c.find('"GALLERY1"', idx + 10)

