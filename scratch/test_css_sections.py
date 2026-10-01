import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect raw_combined.css
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\raw_combined.css', 'r', encoding='utf-8') as f:
    css = f.read()

print("Original raw_combined.css length:", len(css))

# Check for #SECTION_POPUP, #SECTION1, etc.
for sec in ['SECTION1', 'SECTION10', 'SECTION2', 'SECTION3', 'SECTION4', 'SECTION5', 'SECTION6', 'SECTION7', 'SECTION8', 'SECTION9', 'SECTION_POPUP']:
    print(f"Has #{sec}:", f"#{sec}" in css)
