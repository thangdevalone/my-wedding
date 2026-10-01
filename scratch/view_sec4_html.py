import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

body_start = html.find('<body')
sec4_start = html.find('id="SECTION4"', body_start)
# find end of section4 (next section5)
sec5_start = html.find('id="SECTION5"', sec4_start)

sec4_html = html[sec4_start-15:sec5_start-15]
print("SECTION4 HTML:")
print(sec4_html)
