import json, sys
sys.stdout.reconfigure(encoding='utf-8')

log_full = r'C:\Users\ThangDev\.gemini\antigravity-ide\brain\72c7840d-cf36-436a-b8bb-b2269e833769\.system_generated\logs\transcript_full.jsonl'

# Look for <style> or CSS in transcript_full
with open(log_full, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        data = json.loads(line)
        step = data.get('step_index')
        content = str(data.get('content', ''))
        # Check if this step has the raw styles from redtone
        if '#IMAGE70' in content and 'style' in content and step < 350:
            print(f"Found #IMAGE70 in Step {step}, line {i}, length {len(content)}")
