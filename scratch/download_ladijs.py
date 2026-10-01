import urllib.request
import re

url = "https://w.ladicdn.com/v5/source/ladipagev3.min.js"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        code = resp.read().decode('utf-8')
    with open('scratch/ladipagev3.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Downloaded ladipagev3.js, size: {len(code)}")
    
    # Search for gallery
    matches = [m.start() for m in re.finditer(r'gallery', code, re.IGNORECASE)]
    print(f"Found {len(matches)} occurrences of 'gallery'")
except Exception as e:
    print(f"Error: {e}")
