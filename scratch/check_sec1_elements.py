import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

sec1 = re.search(r'id="SECTION1"[^>]*>(.*?)(?=id="SECTION10")', text, re.DOTALL).group(1)
for m in re.finditer(r'<div[^>]*id="([^"]+)"[^>]*class(?:Name)?="([^"]+)"[^>]*>', sec1):
    print(m.group(0))
