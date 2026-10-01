import re

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

idx = js.find('runGallery=')
if idx == -1:
    idx = js.find('runGallery')
print("runGallery idx:", idx)
print(js[idx:idx+3000])
