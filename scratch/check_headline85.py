import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('HEADLINE85')
print("Surrounding HEADLINE85:")
print(html[idx-300:idx+800])
