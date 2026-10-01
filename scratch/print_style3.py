import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
style3 = styles[3]

print("Style 3 length:", len(style3))
print("First 2000 chars:")
print(style3[:2000])
