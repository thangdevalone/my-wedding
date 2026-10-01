with open('public/wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
rules = [r.strip() for r in css.split('}') if '#BUTTON2' in r or '#FORM2' in r]
for r in rules:
    try:
        print(r + '}')
    except:
        pass
