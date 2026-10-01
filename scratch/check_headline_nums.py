with open('app/components/WeddingContent.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
for i in range(11, 42):
    m = re.search(r'id=["\']HEADLINE' + str(i) + r'["\'][^>]*><h3[^>]*>(.*?)</h3>', text)
    if m:
        print(f"HEADLINE{i} -> {m.group(1)}")
