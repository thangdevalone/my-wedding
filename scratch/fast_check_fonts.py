import re, json

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    w_css = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

element_ids = set(re.findall(r'id="([^"]+)"', tsx))

def parse_css_fonts(css_text):
    # Map element ID to font dict
    id_map = {}
    # Find all rules
    rules = re.findall(r'([^{}@]+)\{([^}]*)\}', css_text)
    props_to_extract = ['font-family', 'font-size', 'line-height', 'letter-spacing', 'text-transform', 'color', 'text-align']
    for selectors, body in rules:
        props = {}
        for p in props_to_extract:
            m = re.search(r'\b' + p + r':\s*([^;]+);', body)
            if m:
                props[p] = m.group(1).strip()
        if not props:
            continue
        # Check which IDs are in selectors
        sel_ids = re.findall(r'#([A-Za-z0-9_]+)\b', selectors)
        for sid in sel_ids:
            if sid not in id_map:
                id_map[sid] = {}
            id_map[sid].update(props)
    return id_map

orig_map = parse_css_fonts(orig_html)
w_map = parse_css_fonts(w_css)

diffs = []
for eid in element_ids:
    o = orig_map.get(eid, {})
    w = w_map.get(eid, {})
    if o != w:
        diffs.append((eid, o, w))

print(f'Total elements with font rules in original: {len(orig_map)}')
print(f'Total elements with font rules in wedding.css: {len(w_map)}')
print(f'Total elements with differences: {len(diffs)}')
for eid, o, w in diffs:
    print(f'\nElement #{eid}:')
    print(f'  ORIG: {o}')
    print(f'  NEW : {w}')
