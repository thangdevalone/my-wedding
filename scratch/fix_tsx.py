import re

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix "!important" inside style objects
# e.g. "opacity":"0 !important" -> "opacity":"0"
# "pointerEvents":"none !important" -> "pointerEvents":"none"
content = re.sub(r'\s*!important', '', content)

# 2. Fix tabIndex="1" -> tabIndex={1}
content = re.sub(r'tabIndex="(\d+)"', r'tabIndex={\1}', content)

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed WeddingContent.tsx")
