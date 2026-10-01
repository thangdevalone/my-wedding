with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# Let's search backwards from 597193 for var ut=, var pt=, function ut
print(js[590000:597200])
