import re

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

print("File length:", len(c))
print("GALLERY1 in c:", "GALLERY1" in c)
m = re.search(r'<div[^>]*id=["\']GALLERY1["\'][^>]*>([\s\S]*?)(?=<div[^>]*id=["\']HEADLINE97|<div[^>]*id=["\']PARAGRAPH1|</div>\s*</div>\s*</div>\s*<div[^>]*id=["\']SECTION8)', c)
if m:
    print("=== GALLERY1 FULL MARKUP ===")
    print(m.group(0))
else:
    print("GALLERY1 not found with pattern")

