import json, sys
sys.stdout.reconfigure(encoding='utf-8')

log_path = r'C:\Users\ThangDev\.gemini\antigravity-ide\brain\72c7840d-cf36-436a-b8bb-b2269e833769\.system_generated\logs\transcript.jsonl'
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        content = str(data.get('content', '')) + str(data.get('tool_calls', ''))
        if 'Remove-Item' in content and 'redtone' in content:
            print(f"Step {data.get('step_index')}: {content[:300]}")
