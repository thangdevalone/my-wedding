with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# search for property mappings: where "ah" and "ae" are decompressed
# in ladipage, data format has compressed keys:
# ah: autoplay? ae: autoplay_time?
import re
for m in re.finditer(r'autoplay', js, re.I):
    idx = m.start()
    print("autoplay match:")
    print(js[max(0, idx-50):min(len(js), idx+150)])
