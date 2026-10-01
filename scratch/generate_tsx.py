import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Asset map
images = set(os.listdir(r'd:\thiepcuoi\wedding-nextjs\public\images'))
fonts = set(os.listdir(r'd:\thiepcuoi\wedding-nextjs\public\fonts'))
icons = set(os.listdir(r'd:\thiepcuoi\wedding-nextjs\public\icons'))

def map_url(url):
    fname = url.split('/')[-1].split('?')[0]
    if fname in images:
        return f'/images/{fname}'
    if fname in fonts:
        return f'/fonts/{fname}'
    if fname in icons:
        return f'/icons/{fname}'
    if 'ladipage-play.svg' in fname:
        return '/icons/play.svg'
    return url

# Find body content
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
if not body_match:
    print("Error: Could not find body in original_raw.html")
    sys.exit(1)

body = body_match.group(1)

# Remove script tags
body = re.sub(r'<script\b[^>]*>.*?</script>', '', body, flags=re.DOTALL)

# Remove watermark / popup backdrop if at end of body
body = re.sub(r'<div id="backdrop-popup".*$', '', body, flags=re.DOTALL)

# Map all asset URLs in body
body = re.sub(r'https?://[^\s"\'\)]+', lambda m: map_url(m.group(0)), body)

# Remove Dresscode elements
# Dresscode elements:
# <div id="HEADLINE85"...>...</div>
# <div id="IMAGE88"...>...</div>
# <div id="IMAGE89"...>...</div>
# <div id="IMAGE90"...>...</div>
# <div id="IMAGE91"...>...</div>
# <div id="GROUP71"...>...</div>
# <div id="GROUP72"...>...</div>
# Note: GROUP71 and GROUP72 contain nested divs!
def remove_element_by_id(html_text, elem_id):
    # Find <div id="elem_id" ...>
    pattern = rf'<([a-zA-Z0-9]+)[^>]*id="{elem_id}"[^>]*>'
    m = re.search(pattern, html_text)
    if not m:
        # try id before tag or single quotes
        pattern = rf'<([a-zA-Z0-9]+)[^>]*id=[\'"]{elem_id}[\'"][^>]*>'
        m = re.search(pattern, html_text)
    if not m:
        print(f"Warning: id {elem_id} not found in HTML")
        return html_text
        
    start_pos = m.start()
    tag_name = m.group(1)
    
    # Track open/close tags to find matching closing tag
    pos = m.end()
    depth = 1
    tag_regex = re.compile(rf'</?{tag_name}\b[^>]*>', re.IGNORECASE)
    
    for tag_match in tag_regex.finditer(html_text, pos):
        full_tag = tag_match.group(0)
        if full_tag.startswith('</'):
            depth -= 1
            if depth == 0:
                end_pos = tag_match.end()
                # print(f"Removed {elem_id} (length {end_pos - start_pos})")
                return html_text[:start_pos] + html_text[end_pos:]
        elif not full_tag.endswith('/>'):
            depth += 1
            
    return html_text

for did in ['HEADLINE85', 'IMAGE88', 'IMAGE89', 'IMAGE90', 'IMAGE91', 'GROUP71', 'GROUP72']:
    body = remove_element_by_id(body, did)

print("Dress code elements removed")

# Replace !::name::! with Quý khách
body = body.replace('!::name::!', 'Quý khách')

# Rename ladi- to w-
body = re.sub(r'\bladi-animation-hidden\b', '', body) # Framer-motion handles this
body = re.sub(r'\bladi-', 'w-', body)

# Clean extra spaces in class
body = re.sub(r'class=[\'"]\s*', 'className="', body)
body = re.sub(r'\s*[\'"](?=\s|>)', '"', body)

# JSX Conversions
body = re.sub(r'\bfor=', 'htmlFor=', body)
body = re.sub(r'\btabindex="(\d+)"', r'tabIndex={\1}', body)
body = re.sub(r'\bautocomplete=', 'autoComplete=', body)
body = re.sub(r'<(input|br|hr|img)([^>]*?)(?<!/)>', r'<\1\2 />', body)

# Convert style="..." to style={{...}}
def style_to_jsx(m):
    raw_style = m.group(1)
    props = []
    for item in raw_style.split(';'):
        item = item.strip()
        if not item or ':' not in item:
            continue
        k, v = item.split(':', 1)
        k = k.strip()
        v = v.strip().replace('!important', '').strip()
        # kebab to camelCase
        camel_k = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), k)
        props.append(f'"{camel_k}": "{v}"')
    if props:
        return 'style={{' + ', '.join(props) + '}}'
    return ''

body = re.sub(r'style="([^"]*)"', style_to_jsx, body)

# Form onSubmit prevent default
body = re.sub(r'<form\b', '<form onSubmit={(e) => e.preventDefault()}', body)

# Wrap in WeddingContent component
tsx_content = f'''"use client";

import {{ useMotionScroll }} from "../hooks/useMotionScroll";

export default function WeddingContent() {{
  useMotionScroll();

  return (
    <>
{body}
    </>
  );
}}
'''

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx_content)

print("Saved app/components/WeddingContent.tsx!")
print(f"Remaining 'ladi' in TSX: {tsx_content.count('ladi')}")
