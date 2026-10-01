import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

# 1. Check all URLs in public/wedding.css
with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

urls = re.findall(r'url\([\'"]?([^\'"\)]+)[\'"]?\)', css)
print(f"Total url() in wedding.css: {len(urls)}")

missing = []
for u in set(urls):
    if u.startswith('data:'):
        continue
    # local path
    clean_u = u.lstrip('/')
    disk_path = os.path.join(r'd:\thiepcuoi\wedding-nextjs\public', clean_u.replace('/', os.sep))
    if not os.path.exists(disk_path):
        missing.append((u, disk_path))

print(f"Missing assets in wedding.css: {len(missing)}")
for u, dp in missing:
    print(f"  MISSING: {u}")
