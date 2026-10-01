import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect all input and select tags
form_tags = re.findall(r'<(?:input|select|textarea|option)[^>]*>', text)
for t in form_tags:
    print(t)

# Fix:
# In React, on <input>:
# remove value="" completely if no value, or defaultValue=""
# on <option defaultValue="..."> -> <option value="...">
text = re.sub(r'<input([^>]*?)\bvalue=""', r'<input\1defaultValue=""', text)
text = re.sub(r'<option([^>]*?)\bdefaultValue=', r'<option\1value=', text)

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("\nForm inputs cleaned!")
