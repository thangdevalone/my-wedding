import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Inspect HEADLINE136 ("the")
for m in re.finditer(r'#HEADLINE136[^{}]*\{[^}]*\}', html):
    print("HEADLINE136 rule:", m.group(0))

# 2. Inspect HEADLINE108, HEADLINE138, HEADLINE139 ("23", "10", "26")
for m in re.finditer(r'#(?:HEADLINE108|HEADLINE138|HEADLINE139)[^{}]*\{[^}]*\}', html):
    print("Numbers 23/10/26 rule:", m.group(0))

# 3. What font-face corresponds to these font families?
# Find all font-face definitions
print("\nALL @FONT-FACE in actual_redtone:")
for m in re.finditer(r'@font-face\s*\{([^}]+)\}', html):
    print(m.group(0))
