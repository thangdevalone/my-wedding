with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# Let's search between 550000 and 590000 for "ut="
import re
for m in re.finditer(r'(?:var\s+ut\s*=|function\s+ut\b)', js):
    print("ut match at", m.start())
    print(js[m.start():m.start()+1500])
