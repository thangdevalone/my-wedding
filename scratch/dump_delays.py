import re, json

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

hidden_elements = re.findall(r'id="([^"]+)"[^>]*w-animation-hidden', tsx)
delays_dict = {}

for el_id in hidden_elements:
    pattern = r'([^{}]*#' + re.escape(el_id) + r'\.w-animation[^{}]*\{[^}]*\})'
    m = re.findall(pattern, css)
    if m:
        delays = re.findall(r'animation-delay:\s*([\d\.]+)s', m[0])
        if delays:
            delays_dict[el_id] = int(float(delays[0]) * 1000)
        else:
            delays_dict[el_id] = 0

print(json.dumps(delays_dict))
