import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/actual_redtone.html', 'r', encoding='utf-8') as f:
    c = f.read()

m = re.search(r'id="HEADLINE116"[^>]*>[\s\S]*?</h3>', c)
if m:
    print(m.group(0))
