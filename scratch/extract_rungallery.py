with open('scratch/ladipagev3.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('runGallery')
while idx != -1:
    print(f"runGallery at {idx}:")
    print(js[max(0, idx - 100):min(len(js), idx + 4000)])
    print("="*80)
    idx = js.find('runGallery', idx + 1)
