import re

with open('scratch/live_redtone.html', 'r', encoding='utf-8') as f:
    content = f.read()

scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', content)
print('Script srcs:', scripts)

# Check inline scripts for gallery
inline_scripts = re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>', content, re.DOTALL)
print(f'Found {len(inline_scripts)} inline scripts')
for i, s in enumerate(inline_scripts):
    if 'GALLERY' in s or 'gallery' in s:
        print(f'Inline script {i} mentions gallery (length {len(s)})')
        # print first 500 chars
        print(s[:500])
