import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\actual_redtone.html', 'r', encoding='utf-8') as f:
    red_html = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    my_css = f.read()

with open(r'd:\thiepcuoi\wedding-nextjs\app\components\WeddingContent.tsx', 'r', encoding='utf-8') as f:
    my_tsx = f.read()

target_ids = ['HEADLINE128', 'HEADLINE137', 'HEADLINE115', 'HEADLINE142', 'HEADLINE143', 'HEADLINE116']

print("=== COMPARING TARGET ELEMENTS ===")
for tid in target_ids:
    print(f"\n==================== #{tid} ====================")
    # 1. HTML in actual redtone
    m_red_html = re.search(r'id="' + tid + r'"[^>]*>.*?</(?:div|h\d|a|p)>', red_html)
    print(f"[Actual Redtone HTML]:\n  {m_red_html.group(0)[:160] if m_red_html else 'NOT FOUND'}")
    
    # 2. HTML in my TSX
    m_my_html = re.search(r'id="' + tid + r'"[^>]*>.*?</(?:div|h\d|a|p)>', my_tsx)
    print(f"[My TSX HTML]:\n  {m_my_html.group(0)[:160] if m_my_html else 'NOT FOUND'}")
    
    # 3. CSS in actual redtone
    # find all rules mentioning #tid
    red_rules = re.findall(r'([^{}]*#' + tid + r'\b[^{}]*\{[^}]*\})', red_html)
    print("[Actual Redtone CSS]:")
    for r in red_rules:
        if any(p in r for p in ['font-family', 'font-size', 'line-height', 'letter-spacing', 'color', 'text-transform', 'text-align', 'opacity', 'font-style']):
            print(f"  {r.strip()}")
            
    # 4. CSS in my wedding.css
    my_rules = re.findall(r'([^{}]*#' + tid + r'\b[^{}]*\{[^}]*\})', my_css)
    print("[My Wedding CSS]:")
    for r in my_rules:
        if any(p in r for p in ['font-family', 'font-size', 'line-height', 'letter-spacing', 'color', 'text-transform', 'text-align', 'opacity', 'font-style']):
            print(f"  {r.strip()}")
