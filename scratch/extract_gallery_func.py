import re

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# Find the function definition handling gallery
idx = js.find('ladi-gallery-control-box')
start = max(0, idx - 500)
end = min(len(js), idx + 2500)
print(js[start:end])
