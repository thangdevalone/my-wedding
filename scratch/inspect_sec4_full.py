import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's extract SECTION4 from original_raw.html
sec4_match = re.search(r'(<div[^>]*id="SECTION4"[^>]*>.*?)(?=<div[^>]*id="SECTION5")', html, re.DOTALL)
sec4 = sec4_match.group(1)

# Find all elements inside SECTION4
elements = re.findall(r'<div[^>]*id="([^"]+)"[^>]*class=[\'"]([^\'"]+)[\'"][^>]*>', sec4)
for eid, cls in elements:
    # get text content or child info
    m = re.search(rf'id="{eid}"[^>]*>(.*?)(?=<div id=|$)', sec4, re.DOTALL)
    snippet = m.group(1)[:150].strip() if m else ''
    print(f"ID: {eid:12} Class: {cls:40} Text/Content: {snippet[:80]}")
