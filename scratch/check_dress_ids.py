import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

for bid in ['BOX12', 'BOX13', 'BOX14', 'BOX15', 'BOX5', 'BOX7', 'BOX18', 'BOX19', 'IMAGE85', 'IMAGE88', 'IMAGE89', 'IMAGE90', 'IMAGE91', 'HEADLINE85', 'GROUP71', 'GROUP72']:
    count_html = len(re.findall(r'\b' + bid + r'\b', html))
    print(f"{bid}: {count_html} occurrences in HTML")
