import re

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace value="" with defaultValue="" on input / textarea
# but NOT on <option value="...">!
def fix_value(m):
    tag = m.group(0)
    # only replace value= inside <input> or <textarea>
    if tag.startswith('<input') or tag.startswith('<textarea'):
        return tag.replace(' value="', ' defaultValue="').replace(" value='", " defaultValue='")
    return tag

new_text = re.sub(r'<(?:input|textarea)[^>]*>', fix_value, text)

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Replaced value with defaultValue on form inputs!")
