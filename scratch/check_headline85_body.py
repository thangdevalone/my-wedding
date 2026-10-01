import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find HEADLINE85 in body
body_start = html.find('<body')
idx = html.find('HEADLINE85', body_start)
print("HEADLINE85 in body:")
print(html[idx-300:idx+800])
