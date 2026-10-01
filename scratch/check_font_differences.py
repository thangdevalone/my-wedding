import re, json

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    w_css = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

# Extract all elements with id in TSX
element_ids = re.findall(r'id="([^"]+)"', tsx)
print(f'Total elements in TSX: {len(element_ids)}')

def get_rules_for_id(css_text, eid):
    # Find all rules containing #eid
    rules = re.findall(r'([^{}]*#' + re.escape(eid) + r'\b[^{}]*\{[^}]*\})', css_text)
    font_props = {}
    for r in rules:
        sel, body = r.split('{')
        for prop in ['font-family', 'font-size', 'line-height', 'letter-spacing', 'text-transform', 'color', 'text-align']:
            m = re.search(r'\b' + prop + r':\s*([^;]+);', body)
            if m:
                font_props[prop] = m.group(1).strip()
    return font_props

differences = []
for eid in set(element_ids):
    orig_props = get_rules_for_id(orig_html, eid)
    w_props = get_rules_for_id(w_css, eid)
    if orig_props or w_props:
        # compare
        diff_keys = set(orig_props.keys()) ^ set(w_props.keys())
        diff_vals = {k: (orig_props.get(k), w_props.get(k)) for k in orig_props if k in w_props and orig_props[k] != w_props[k]}
        if diff_keys or diff_vals:
            differences.append((eid, orig_props, w_props, diff_keys, diff_vals))

print(f'\nTotal text elements checked: {len(element_ids)}')
print(f'Elements with font differences: {len(differences)}')
for eid, orig_p, w_p, d_keys, d_vals in differences:
    print(f'#{eid}:')
    if d_keys:
        print(f'  Keys diff: {d_keys}')
    if d_vals:
        print(f'  Vals diff: {d_vals}')
