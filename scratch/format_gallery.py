import json

with open(r"scratch/extracted_ladipage_gallery.js", "r", encoding="utf-8") as f:
    text = f.read()

# Let's extract lt, pt, ut, gt
# We can find lt = function
import re

# Simple formatter
def simple_beautify(code):
    indent = 0
    res = []
    for char in code:
        if char == '{':
            indent += 1
            res.append('{\n' + '  ' * indent)
        elif char == '}':
            indent = max(0, indent - 1)
            res.append('\n' + '  ' * indent + '}\n' + '  ' * indent)
        elif char == ';':
            res.append(';\n' + '  ' * indent)
        else:
            res.append(char)
    return ''.join(res)

with open(r"scratch/beautified_gallery.js", "w", encoding="utf-8") as f:
    f.write(simple_beautify(text[:12000]))

print("Done")
