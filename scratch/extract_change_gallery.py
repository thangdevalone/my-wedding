with open('scratch/ladipagev3.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Let's find changeImageGallery definition
idx = js.find('changeImageGallery')
while idx != -1:
    print(f"changeImageGallery at {idx}:")
    print(js[max(0, idx - 50):min(len(js), idx + 2500)])
    print("="*80)
    idx = js.find('changeImageGallery', idx + 1)
