import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

urls = re.findall(r'(?:src|href)=[\'"]([^\'"]+)[\'"]', tsx)
print(f"Total src/href in TSX: {len(urls)}")

missing = []
for u in set(urls):
    if u.startswith('http') or u.startswith('#') or u.startswith('data:'):
        continue
    clean_u = u.lstrip('/')
    disk_path = os.path.join(r'd:\thiepcuoi\wedding-nextjs\public', clean_u.replace('/', os.sep))
    if not os.path.exists(disk_path):
        missing.append((u, disk_path))

print(f"Missing assets in TSX: {len(missing)}")
for u, dp in missing:
    print(f"  MISSING: {u}")
