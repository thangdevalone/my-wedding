import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

# 1. Load pristine raw combined CSS
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\raw_combined.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 2. Dress code element IDs to remove
DRESS_IDS = [
    'HEADLINE85', 'IMAGE88', 'IMAGE89', 'IMAGE90', 'IMAGE91', 
    'GROUP71', 'GROUP72', 'IMAGE85', 
    'BOX12', 'BOX13', 'BOX14', 'BOX15', 
    'BOX5', 'BOX7', 'BOX18', 'BOX19'
]

# In CSS, clean up rules that reference dress code IDs
# First split CSS into rule blocks or use regex
def clean_css_dresscode(css_text):
    # Pattern to match CSS rules: selectors { content }
    # Also handle @media and @keyframes
    def filter_rule(m):
        selector = m.group(1).strip()
        body = m.group(2)
        
        # Don't touch @keyframes or @font-face or @media
        if selector.startswith('@'):
            return m.group(0)
            
        parts = [s.strip() for s in selector.split(',')]
        # Filter out dress code selectors
        new_parts = []
        for p in parts:
            if not any(re.search(r'#' + did + r'\b', p) for did in DRESS_IDS):
                new_parts.append(p)
        if not new_parts:
            return '' # entirely removed
        return f"{', '.join(new_parts)}{{{body}}}"
        
    return re.sub(r'([^{}@]+)\{([^}]*)\}', filter_rule, css_text)

cleaned_css = clean_css_dresscode(css)
print(f"CSS length after removing dresscode rules: {len(cleaned_css)} (was {len(css)})")

# 3. Rename all .ladi- to .w-
cleaned_css = re.sub(r'\.ladi-', '.w-', cleaned_css)
cleaned_css = re.sub(r'#SECTION_POPUP \.w-container', '#SECTION_POPUP .w-container', cleaned_css)

cleaned_css = cleaned_css.replace('ladi-loading', 'w-loading')
cleaned_css = cleaned_css.replace('icons/ladipage-play.svg', 'icons/play.svg')
cleaned_css = cleaned_css.replace('ladipage-play.svg', 'play.svg')
cleaned_css = re.sub(r'\[class\*="ladipage_powered"\],[class\*="powered_by"]\{[^}]*\}', '', cleaned_css)
cleaned_css = re.sub(r'\.ladipage-message[^{]*\{[^}]*\}', '', cleaned_css)

# Ensure .w-wrapper and .w-container are centered 420px
wrapper_rule = """
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
"""

cleaned_css = wrapper_rule + "\n" + cleaned_css

# Save to public/wedding.css
with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'w', encoding='utf-8') as f:
    f.write(cleaned_css)

print("Saved clean public/wedding.css!")
print(f"Remaining 'ladi' in CSS: {cleaned_css.count('ladi')}")
