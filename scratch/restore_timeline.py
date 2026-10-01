import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

# Read original_raw.html
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Asset mapping
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

# 2. Extract CSS styles: 0, 2, 3, 5, 7
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
selected_styles = [styles[0], styles[2], styles[3], styles[5], styles[7]]
combined_css = '\n\n'.join(selected_styles)

# Map URLs
combined_css = re.sub(r'https?://[^\s"\'\)]+', lambda m: map_url(m.group(0)), combined_css)

# Remove ONLY Dresscode: HEADLINE85 and GROUP72 (BOX5, BOX7, BOX18, BOX19)
DRESS_ONLY_IDS = ['HEADLINE85', 'GROUP72', 'BOX5', 'BOX7', 'BOX18', 'BOX19']

def clean_css_dress_only(css_text):
    def filter_rule(m):
        selector = m.group(1).strip()
        body = m.group(2)
        if selector.startswith('@'):
            return m.group(0)
        parts = [s.strip() for s in selector.split(',')]
        new_parts = []
        for p in parts:
            if not any(re.search(r'#' + did + r'\b', p) for did in DRESS_ONLY_IDS):
                new_parts.append(p)
        if not new_parts:
            return ''
        return f"{', '.join(new_parts)}{{{body}}}"
    return re.sub(r'([^{}@]+)\{([^}]*)\}', filter_rule, css_text)

cleaned_css = clean_css_dress_only(combined_css)

# Replace .ladi- with .w-
cleaned_css = re.sub(r'\.ladi-', '.w-', cleaned_css)
cleaned_css = cleaned_css.replace('ladi-loading', 'w-loading')
cleaned_css = cleaned_css.replace('icons/ladipage-play.svg', 'icons/play.svg')
cleaned_css = cleaned_css.replace('ladipage-play.svg', 'play.svg')
cleaned_css = re.sub(r'\[class\*="ladipage_powered"\],[class\*="powered_by"]\{[^}]*\}', '', cleaned_css)
cleaned_css = re.sub(r'\.ladipage-message[^{]*\{[^}]*\}', '', cleaned_css)

# Add base rules & animation helpers
base_header = """
/* === BASE WEDDING LAYOUT === */
body {
  direction: ltr;
  background-color: #fff;
  font-family: "Open Sans", sans-serif;
  margin: 0;
  padding: 0;
}

.w-wraper, .w-wrapper {
  margin: 0 auto;
  width: 420px;
  max-width: 100vw;
  position: relative;
  overflow-x: hidden;
  background-color: #fff;
}

.w-container {
  position: relative;
  margin: 0 auto;
  width: 420px;
  height: 100%;
}

.w-section {
  margin: 0 auto;
  position: relative;
  width: 420px;
}

.w-element {
  position: absolute;
}

/* Animations */
.w-animation-hidden {
  visibility: hidden !important;
  opacity: 0 !important;
}

.w-animation {
  visibility: visible !important;
  opacity: 1;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
"""

cleaned_css = base_header + "\n" + cleaned_css

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'w', encoding='utf-8') as f:
    f.write(cleaned_css)

print("Saved clean wedding.css (dresscode removed, timeline kept)")

# 3. Process Body HTML
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
body = body_match.group(1)
body = re.sub(r'<script\b[^>]*>.*?</script>', '', body, flags=re.DOTALL)
body = re.sub(r'<div id="backdrop-popup".*$', '', body, flags=re.DOTALL)
body = re.sub(r'https?://[^\s"\'\)]+', lambda m: map_url(m.group(0)), body)

# Helper to remove element by ID
def remove_element_by_id(html_text, elem_id):
    pattern = rf'<([a-zA-Z0-9]+)[^>]*id=[\'"]{elem_id}[\'"][^>]*>'
    m = re.search(pattern, html_text)
    if not m:
        return html_text
    start_pos = m.start()
    tag_name = m.group(1)
    pos = m.end()
    depth = 1
    tag_regex = re.compile(rf'</?{tag_name}\b[^>]*>', re.IGNORECASE)
    for tm in tag_regex.finditer(html_text, pos):
        full_tag = tm.group(0)
        if full_tag.startswith('</'):
            depth -= 1
            if depth == 0:
                end_pos = tm.end()
                return html_text[:start_pos] + html_text[end_pos:]
        elif not full_tag.endswith('/>'):
            depth += 1
    return html_text

# Remove ONLY HEADLINE85 and GROUP72
for did in ['HEADLINE85', 'GROUP72']:
    body = remove_element_by_id(body, did)

print("Removed ONLY HEADLINE85 and GROUP72 from body HTML")

# Replace !::name::! with Quý khách
body = body.replace('!::name::!', 'Quý khách')

# Rename ladi- to w-
body = re.sub(r'\bladi-', 'w-', body)

# JSX conversions
body = re.sub(r'class=[\'"]\s*', 'className="', body)
body = re.sub(r'\s*[\'"](?=\s|>)', '"', body)
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
        camel_k = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), k)
        props.append(f'"{camel_k}": "{v}"')
    if props:
        return 'style={{' + ', '.join(props) + '}}'
    return ''

body = re.sub(r'style="([^"]*)"', style_to_jsx, body)

# Form onSubmit and defaultValue
body = re.sub(r'<form\b', '<form onSubmit={(e) => e.preventDefault()}', body)
body = re.sub(r'\svalue=""', ' defaultValue=""', body)

# Remove is_auto_funnel
body = re.sub(r'\bis_auto_funnel="[^"]*"', '', body)

# Assemble WeddingContent.tsx
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

print("Saved updated WeddingContent.tsx!")
print(f"Remaining 'ladi' in TSX: {tsx_content.count('ladi')}")
print(f"Has GROUP71 in TSX: {'GROUP71' in tsx_content}")
print(f"Has IMAGE88 in TSX: {'IMAGE88' in tsx_content}")
print(f"Has HEADLINE85 in TSX: {'HEADLINE85' in tsx_content}")
print(f"Has GROUP72 in TSX: {'GROUP72' in tsx_content}")
