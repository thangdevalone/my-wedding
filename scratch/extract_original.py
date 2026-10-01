import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\ThangDev\.gemini\antigravity-ide\brain\72c7840d-cf36-436a-b8bb-b2269e833769\.system_generated\steps\41\content.md', 'r', encoding='utf-8') as f:
    raw = f.read()

# Skip markdown header before <!DOCTYPE
html_start = raw.find('<!DOCTYPE html>')
if html_start != -1:
    html = raw[html_start:]
else:
    html = raw

print(f"HTML extracted, length: {len(html)}")

# Find all <style> tags
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
print(f"Found {len(styles)} style tags")
for i, s in enumerate(styles):
    print(f"Style {i}: {len(s)} chars, has ladi: {'ladi' in s}, has #SECTION: {'#SECTION' in s}")

# Check sections in body
sections = re.findall(r'<div[^>]*id="(SECTION\w*)"[^>]*>', html)
print(f"Found sections: {sections}")

# Save clean original html to scratch
with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Saved original_raw.html")
