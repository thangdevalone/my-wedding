with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

import re

# Check if any animated element is child of another animated element
# e.g., GROUP18 has GROUP19 inside it?
# In HTML earlier:
# <div id="GROUP18" className="w-element w-animation-hidden">
#   <div className="w-group">
#     <div id="GROUP19" className="w-element w-animation-hidden">
#       <div className="w-group">
#         <div id="HEADLINE59" className="w-element w-animation-hidden">
#           ...

print("Checking nesting:")
nested = []
for mid in re.findall(r'id="([^"]+)"[^>]*w-animation-hidden', tsx):
    # find tag
    pos = tsx.find(f'id="{mid}"')
    # search parent tags
    prefix = tsx[:pos]
    parent_matches = re.findall(r'id="([^"]+)"[^>]*w-animation-hidden', prefix)
    # Check if inside
    # More simply, let's see which elements contain other animated elements
    sub = tsx[pos:pos+1500]
    children = re.findall(r'id="([^"]+)"[^>]*w-animation-hidden', sub[20:])
    if children:
        print(f'{mid} contains: {children}')
