import re

for filepath in ['public/wedding.css', 'app/globals.css']:
    with open(filepath, 'r', encoding='utf-8') as f:
        css = f.read()
    rules = [r.strip() for r in css.split('}') if ('FORM' in r or 'BUTTON' in r or 'form' in r or 'button' in r) and 'border-radius' in r]
    print(f"=== {filepath}: {len(rules)} rules with border-radius ===")
    for r in rules:
        try:
            print(r + '}')
        except:
            pass
