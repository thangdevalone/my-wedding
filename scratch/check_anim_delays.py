import re

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

# Find all elements with w-animation-hidden in TSX
hidden_elements = re.findall(r'id="([^"]+)"[^>]*w-animation-hidden', tsx)
print(f'Total elements with w-animation-hidden in TSX: {len(hidden_elements)}')

for el_id in hidden_elements:
    # search for animation-delay for this id in CSS
    pattern = r'([^{}]*#' + re.escape(el_id) + r'\.w-animation[^{}]*\{[^}]*\})'
    m = re.findall(pattern, css)
    if m:
        delays = re.findall(r'animation-delay:\s*([\d\.]+s)', m[0])
        anim_names = re.findall(r'animation-name:\s*([\w\-]+)', m[0])
        print(f'{el_id}: name={anim_names}, delay={delays}')
    else:
        print(f'{el_id}: NO MATCH in wedding.css!')
