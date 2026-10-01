import os, re

images = set(os.listdir(r'd:\thiepcuoi\wedding-nextjs\public\images'))
fonts = set(os.listdir(r'd:\thiepcuoi\wedding-nextjs\public\fonts'))
icons = set(os.listdir(r'd:\thiepcuoi\wedding-nextjs\public\icons'))

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

urls = set(re.findall(r'https?://[^\s"\'\)]+', html))
print(f"Found {len(urls)} external URLs in original HTML")
for u in sorted(urls):
    fname = u.split('/')[-1]
    in_img = fname in images
    in_font = fname in fonts
    in_icon = fname in icons
    print(f"{fname} -> img:{in_img}, font:{in_font}, icon:{in_icon}")
