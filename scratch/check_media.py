import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
style3 = styles[3]

media = re.findall(r'@media[^{]*\{', style3)
print("Media queries in style 3:")
for m in media:
    print(" ", m.strip())

# Check mobile vs desktop container width
print("\nContainer rules:")
for line in style3.split('\n'):
    if 'container' in line or 'wraper' in line or 'width:' in line and '420' in line:
        print(" ", line.strip()[:100])
