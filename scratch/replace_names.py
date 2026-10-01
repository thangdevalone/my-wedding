with open('app/components/WeddingContent.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace couple names
text = text.replace('BÁ KIÊN', 'QUANG THẮNG')
text = text.replace('QUỲNH ANH', 'TƯỜNG LAN')
text = text.replace('Bá Kiên &amp; Quỳnh Anh', 'Quang Thắng &amp; Tường Lan')
text = text.replace('Bá Kiên & Quỳnh Anh', 'Quang Thắng & Tường Lan')

with open('app/components/WeddingContent.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Replacement complete. Checking remaining:")
print("Bá Kiên:", 'Bá Kiên' in text)
print("Quỳnh Anh:", 'Quỳnh Anh' in text)
print("BÁ KIÊN:", 'BÁ KIÊN' in text)
print("QUỲNH ANH:", 'QUỲNH ANH' in text)
