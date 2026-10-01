with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

pos = 597193
idx = js.rfind('ut=', 0, pos)
print("Found ut= at", idx)
print(js[idx-50:idx+2500])

idx_gt = js.rfind('gt=', 0, pos)
print("Found gt= at", idx_gt)
print(js[idx_gt-50:idx_gt+2500])

idx_pt = js.rfind('pt=', 0, pos)
print("Found pt= at", idx_pt)
print(js[idx_pt-50:idx_pt+2500])
