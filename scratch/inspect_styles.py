import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
for i, s in enumerate(styles):
    print(f"\n--- STYLE {i} (Length: {len(s)}) ---")
    print(s[:300].strip())
    print("...")
    print(s[-200:].strip())
