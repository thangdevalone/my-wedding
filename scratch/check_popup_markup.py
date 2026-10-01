import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('POPUP1')
print("POPUP1 snippet:")
print(text[idx-50:idx+400])

idx_gallery = text.find('GALLERY1')
print("\nGALLERY1 snippet:")
print(text[idx_gallery:idx_gallery+500])
