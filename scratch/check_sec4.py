import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's inspect SECTION4 where dresscode was
sec4_match = re.search(r'(<div[^>]*id="SECTION4"[^>]*>.*?)(?=<div[^>]*id="SECTION5")', html, re.DOTALL)
if sec4_match:
    sec4 = sec4_match.group(1)
    print(f"SECTION4 length: {len(sec4)}")
    
    # List all child elements with id in SECTION4
    ids = re.findall(r'id="([^"]+)"', sec4)
    print("Element IDs in SECTION4:", ids)
