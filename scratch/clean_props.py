import re

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

# Remove is_auto_funnel
tsx = re.sub(r'\bis_auto_funnel="[^"]*"', '', tsx)
tsx = re.sub(r'\bis_auto_funnel', '', tsx)

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx)

print("Cleaned is_auto_funnel from WeddingContent.tsx")
