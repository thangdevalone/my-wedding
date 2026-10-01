import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Look for GALLERY1 in html
idx = html.find('id="GALLERY1"')
print(html[idx:idx+2500])

# Look for gallery slide background images in CSS
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
style3 = styles[3]
slides = re.findall(r'#GALLERY1[^{]*\{[^}]*\}', style3)
print(f"\nCSS rules for GALLERY1: {len(slides)}")
for s in slides[:15]:
    print(s[:100])
