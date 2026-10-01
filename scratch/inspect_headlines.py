import re
import sys

with open('app/components/WeddingContent.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

targets = ['HEADLINE128', 'HEADLINE137', 'HEADLINE116', 'HEADLINE142', 'HEADLINE143', 'HEADLINE3', 'HEADLINE4', 'HEADLINE5', 'HEADLINE6', 'HEADLINE7', 'HEADLINE8', 'HEADLINE9', 'HEADLINE10', 'HEADLINE111', 'HEADLINE112', 'HEADLINE115', 'HEADLINE108', 'HEADLINE102', 'HEADLINE138', 'HEADLINE59', 'HEADLINE60']
for t in targets:
    m = re.search(r'id=["\']' + t + r'["\'][^>]*>.*?(?=</div>)', code)
    if m:
        sys.stdout.buffer.write((f"{t}: {m.group(0)}\n").encode('utf-8'))
