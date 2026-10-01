import json

log_path = r'C:\Users\ThangDev\.gemini\antigravity-ide\brain\72c7840d-cf36-436a-b8bb-b2269e833769\.system_generated\logs\transcript.jsonl'
with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        data = json.loads(line)
        content = str(data.get('content', '')) + str(data.get('tool_calls', ''))
        if 'wedding.css' in content:
            step = data.get('step_index')
            m_type = data.get('type')
            print(f"Line {i}, Step {step}, Type {m_type}")
