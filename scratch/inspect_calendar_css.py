with open('public/wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
# Check HEADLINE11 to HEADLINE41 positions
for i in range(11, 42):
    m = re.search(r'#HEADLINE' + str(i) + r'\{([^}]+)\}', css)
    if m:
        print(f"HEADLINE{i}: {m.group(1)}")
