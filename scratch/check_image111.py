import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('IMAGE111')
print("IMAGE111 in HTML:")
print(html[idx-50:idx+200])

# Check in CSS
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
style3 = styles[3]
for m in re.finditer(r'#IMAGE111[^{]*\{[^}]*\}', style3):
    print("IMAGE111 in CSS:", m.group(0))
