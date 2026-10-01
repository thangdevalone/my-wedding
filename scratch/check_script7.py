import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.DOTALL)
s7 = scripts[7]

# Print first 2000 chars of script 7
print("Script 7 length:", len(s7))
print("First 2000 chars:")
print(s7[:2000])

# Check for event data or animation map in all scripts
for i, s in enumerate(scripts):
    if 'ladiApp' in s or 'data_event' in s or 'animate' in s.lower():
        print(f"\n--- Script {i} ---")
        print(s[:1000])
