import re
import sys

with open('app/components/WeddingContent.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find all occurrences of Bá Kiên and Quỳnh Anh
k_matches = list(re.finditer(r'Bá Kiên', text))
q_matches = list(re.finditer(r'Quỳnh Anh', text))
print(f"Bá Kiên occurrences: {len(k_matches)}")
print(f"Quỳnh Anh occurrences: {len(q_matches)}")

for m in k_matches:
    start = max(0, m.start() - 100)
    end = min(len(text), m.end() + 100)
    sys.stdout.buffer.write((text[start:end] + "\n---\n").encode('utf-8'))
