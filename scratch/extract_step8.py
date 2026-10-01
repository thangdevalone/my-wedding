import json, sys
sys.stdout.reconfigure(encoding='utf-8')

log_full = r'C:\Users\ThangDev\.gemini\antigravity-ide\brain\72c7840d-cf36-436a-b8bb-b2269e833769\.system_generated\logs\transcript_full.jsonl'

with open(log_full, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if i == 12:
            data = json.loads(line)
            print("Step:", data.get('step_index'))
            print("Type:", data.get('type'))
            content = data.get('content', '')
            print("Content length:", len(content))
            print("Snippet:", content[:500])
            with open(r'd:\thiepcuoi\wedding-nextjs\scratch\step8_content.txt', 'w', encoding='utf-8') as out:
                out.write(content)
            print("Saved to step8_content.txt!")
            break
