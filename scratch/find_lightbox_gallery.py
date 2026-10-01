with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

idx = js.find('lightbox_image(i,n)')
print("Lightbox click at", idx)
print(js[idx-200:idx+400])
