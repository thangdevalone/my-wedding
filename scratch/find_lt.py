with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

pos = 520413
idx = js.rfind('lt=', 0, pos)
print("Found lt= at", idx)
print(js[idx-50:idx+3500])
