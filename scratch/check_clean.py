import re

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

ladi_classes = re.findall(r'className=["\'][^"\']*ladi[^"\']*["\']', tsx)
print('Ladi class count in TSX:', len(ladi_classes))
print('Any "ladi" substring in TSX:', 'ladi' in tsx.lower())

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

ladi_in_css = re.findall(r'[^;\n{}]+ladi[^;{}]+', css, re.IGNORECASE)
print('Ladi occurrences in CSS:', len(ladi_in_css))
for m in ladi_in_css:
    print('  CSS:', m.strip())
