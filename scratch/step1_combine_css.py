import re, os, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ORIGINAL_HTML = r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html'
with open(ORIGINAL_HTML, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Map of local assets
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
        return '/icons/ladipage-play.svg'
    return url

# Replace external asset URLs in entire HTML first
# Specifically ladicdn.com URLs
def replace_asset_urls(text):
    def rep(m):
        url = m.group(0)
        return map_url(url)
    return re.sub(r'https?://[^\s"\'\)]+', rep, text)

html = replace_asset_urls(html)

print("Asset URLs replaced with local paths")

# 2. Extract CSS styles
# Styles: 0 (core), 2 (fonts+wraper), 3 (page rules), 5 (colors+music), 7 (keyframes)
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
selected_styles = [styles[0], styles[2], styles[3], styles[5], styles[7]]
combined_css = '\n\n'.join(selected_styles)

# Replace remaining ladicdn references
combined_css = re.sub(r'https?://(?:w\.)?ladicdn\.com/[^\s"\'\)]+', lambda m: map_url(m.group(0)), combined_css)

print(f"Combined CSS initial length: {len(combined_css)}")

# Save raw combined CSS to scratch for reference
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\raw_combined.css', 'w', encoding='utf-8') as f:
    f.write(combined_css)
