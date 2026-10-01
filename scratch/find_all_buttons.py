import re

with open('app/components/WeddingContent.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

buttons = re.findall(r'id=["\'](BUTTON\d+)["\']', code)
print("Found button IDs:", buttons)

forms = re.findall(r'id=["\'](FORM\d+)["\']', code)
print("Found form IDs:", forms)

# Check all button elements or .w-button in code
w_buttons = re.findall(r'class(?:Name)?=["\'][^"\']*w-button[^"\']*["\']', code)
print(f"Found {len(w_buttons)} elements with w-button class")
