import re

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('id="GALLERY1"')
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\current_gallery_tsx.txt', 'w', encoding='utf-8') as out:
    out.write(c[idx:idx+1500])
print("Saved to scratch/current_gallery_tsx.txt")



