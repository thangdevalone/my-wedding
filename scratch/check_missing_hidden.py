import re

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

# Find all #ID in wedding.css that have .w-animation
anim_rules = list(set(re.findall(r'#([A-Za-z0-9_]+)\.w-animation', css)))
print(f'Total distinct elements with .w-animation rules in CSS: {len(anim_rules)}')

missing_hidden = []
not_in_tsx = []
has_hidden = []

for el_id in anim_rules:
    pattern = r'id="' + re.escape(el_id) + r'"[^>]*className="([^"]*)"'
    m = re.search(pattern, tsx)
    if m:
        classes = m.group(1)
        if 'w-animation-hidden' not in classes:
            missing_hidden.append((el_id, classes))
        else:
            has_hidden.append(el_id)
    else:
        not_in_tsx.append(el_id)

print(f'Elements with w-animation-hidden: {len(has_hidden)}')
print(f'Elements in CSS but missing w-animation-hidden in TSX: {len(missing_hidden)}')
for el_id, cls in missing_hidden:
    print(f'  #{el_id}: className="{cls}"')

print(f'Elements in CSS not found in TSX: {len(not_in_tsx)}')
for el_id in not_in_tsx:
    print(f'  #{el_id}')
