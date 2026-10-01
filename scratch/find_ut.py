with open('scratch/ladipagev3.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Let's search for function ut or var ut =
import re
matches = list(re.finditer(r'(?:function\s+ut\s*\(|var\s+ut\s*=\s*function|let\s+ut\s*=\s*function|const\s+ut\s*=\s*function|ut\s*=\s*function)', js))
print(f"Found {len(matches)} matches for ut function")
for m in matches:
    pos = m.start()
    print("Match at", pos)
    print(js[pos:pos+3000])
    print("="*80)
