import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

log_full = r'C:\Users\ThangDev\.gemini\antigravity-ide\brain\72c7840d-cf36-436a-b8bb-b2269e833769\.system_generated\logs\transcript_full.jsonl'

with open(log_full, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        content = str(data.get('content', ''))
        if 'runEventScroll' in content or 'ladi-animation' in content:
            # find snippets around ladi-animation in JS
            for m in re.finditer(r'([^\n;]{0,100}ladi-animation[^\n;]{0,100})', content):
                snip = m.group(1).strip()
                if not snip.startswith('@') and not snip.startswith('#') and not snip.startswith('.'):
                    print("JS usage:", snip[:150])
