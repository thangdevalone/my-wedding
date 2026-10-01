import re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.DOTALL)
s7 = scripts[7].strip()

# Check if s7 is valid JSON
try:
    data = json.loads(s7)
    print(f"Total elements in script 7: {len(data)}")
    
    anim_data = {}
    for k, v in data.items():
        if isinstance(v, dict) and 'D' in v:
            anim_data[k] = {
                'animation': v.get('D'),
                'duration': v.get('A', '1s'),
                'delay': v.get('B', '0s')
            }
            
    print(f"Total animated elements: {len(anim_data)}")
    for k, v in sorted(anim_data.items()):
        print(f"  {k:15}: {v['animation']:15} duration: {v['duration']:6} delay: {v['delay']}")
        
    with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_animations.json', 'w', encoding='utf-8') as out:
        json.dump(anim_data, out, indent=2)
    print("Saved original_animations.json!")
    
except Exception as e:
    print("Error parsing json:", e)
