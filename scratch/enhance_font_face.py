with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re

# Replace @font-face rules with enhanced versions
def rep_ff(m):
    body = m.group(1)
    if 'font-display' not in body:
        body += 'font-display: swap;'
    if '.otf' in body and 'format' not in body:
        body = body.replace('.otf")', '.otf") format("opentype")')
    return f'@font-face{{{body}}}'

new_css = re.sub(r'@font-face\s*\{([^}]+)\}', rep_ff, css)
with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'w', encoding='utf-8') as f:
    f.write(new_css)
print('Successfully enhanced all @font-face rules!')
