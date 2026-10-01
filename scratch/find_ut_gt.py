with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# find "function ut("
idx = js.find('function ut(')
if idx != -1:
    print("Found function ut:")
    print(js[idx:idx+2500])
else:
    # search var ut=
    idx = js.find('var ut=')
    print("Found var ut:", js[idx:idx+2500])

idx_gt = js.find('function gt(')
if idx_gt != -1:
    print("Found function gt:")
    print(js[idx_gt:idx_gt+2500])
else:
    idx_gt = js.find('var gt=')
    print("Found var gt:", js[idx_gt:idx_gt+2500])
