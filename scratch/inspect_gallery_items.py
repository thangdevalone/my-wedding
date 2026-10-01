import re

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

for i in range(10):
    m_view = re.search(r'data-index=["\']' + str(i) + r'["\'][^{]*\{([^}]+)\}', c)
    rule = m_view.group(1) if m_view else "None"
    print(f"Slide {i}: {rule}")
