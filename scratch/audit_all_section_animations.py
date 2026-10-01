import re, json

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\original_raw.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    w_css = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

# 1. Parse Script 7 (script_event_data) from original
scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', orig_html, re.DOTALL)
s7 = scripts[7]
m = re.search(r'(\{.*\})', s7, re.DOTALL)
orig_events = json.loads(m.group(1))

# Extract all animation settings from original
# In Script 7: "D" is animation-name, "A" is animation-delay
orig_anims = {}
for k, v in orig_events.items():
    if isinstance(v, dict) and ('D' in v or 'A' in v):
        orig_anims[k] = {
            'name': v.get('D'),
            'delay': v.get('A')
        }

# 2. Extract animation settings from wedding.css
# Rules like: #ID.w-animation > .w-* { animation-name: ...; animation-delay: ...; animation-duration: ...; }
css_anims = {}
rules = re.findall(r'([^{}@]+)\{([^}]*)\}', w_css)
for sel, body in rules:
    if '.w-animation' in sel and 'animation-name' in body:
        anim_name = re.search(r'animation-name:\s*([\w\-]+)', body)
        anim_delay = re.search(r'animation-delay:\s*([\w\.\-]+)', body)
        anim_dur = re.search(r'animation-duration:\s*([\w\.\-]+)', body)
        anim_iter = re.search(r'animation-iteration-count:\s*([\w\-]+)', body)
        # Find which IDs
        ids = re.findall(r'#([A-Za-z0-9_]+)\.w-animation', sel)
        for eid in ids:
            css_anims[eid] = {
                'name': anim_name.group(1) if anim_name else None,
                'delay': anim_delay.group(1) if anim_delay else None,
                'duration': anim_dur.group(1) if anim_dur else None,
                'iteration': anim_iter.group(1) if anim_iter else '1'
            }

# 3. Check every section in TSX
sections = re.findall(r'<div id="(SECTION\d+)"[^>]*>(.*?)(?=<div id="SECTION|$)', tsx, re.DOTALL)

print(f"=== ANIMATION AUDIT ACROSS ALL SECTIONS ===")
print(f"Total animated elements in original event data: {len(orig_anims)}")
print(f"Total animated elements in wedding.css: {len(css_anims)}")

# Compare each element in TSX
mismatches = []
for sec_id, sec_content in sections:
    sec_ids = re.findall(r'id="([^"]+)"', sec_content)
    print(f"\n--- {sec_id} ---")
    sec_animated = [eid for eid in sec_ids if eid in orig_anims or eid in css_anims]
    for eid in sec_animated:
        orig_a = orig_anims.get(eid)
        css_a = css_anims.get(eid)
        has_hidden = f'id="{eid}"' in sec_content and 'w-animation-hidden' in re.search(r'id="' + eid + r'"[^>]*', sec_content).group(0)
        
        # Check match
        matched = False
        if orig_a and css_a:
            matched = (orig_a['name'] == css_a['name'] and orig_a['delay'] == css_a['delay'] and has_hidden)
            if not matched:
                mismatches.append((eid, orig_a, css_a, has_hidden))
        print(f"  #{eid}: anim={css_a['name'] if css_a else 'NONE'} (orig: {orig_a['name'] if orig_a else 'NONE'}), delay={css_a['delay'] if css_a else 'NONE'} (orig: {orig_a['delay'] if orig_a else 'NONE'}), hidden_init={has_hidden} -> {'MATCH' if matched else 'DIFF'}")

print(f"\nTotal Mismatches: {len(mismatches)}")
