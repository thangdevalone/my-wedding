with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
for el_id in ['HEADLINE128', 'HEADLINE134', 'HEADLINE135', 'HEADLINE136', 'HEADLINE137']:
    m = re.search(r'id="' + el_id + r'"[^>]*', html)
    if m:
        print(m.group(0))
