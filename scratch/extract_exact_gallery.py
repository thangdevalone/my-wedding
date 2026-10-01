with open(r'd:\thiepcuoi\wedding-nextjs\scratch\ladipagev3.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

idx_lt = js.find('lt=function(')
idx_pt = js.find('pt=function(', idx_lt)
idx_gt = js.find('gt=function(', idx_pt)
idx_end = js.find('i.runtime.tmp.runGallery=', idx_gt)

print(f"lt at {idx_lt}, pt at {idx_pt}, gt at {idx_gt}, end at {idx_end}")

with open(r'd:\thiepcuoi\wedding-nextjs\scratch\extracted_ladipage_gallery.js', 'w', encoding='utf-8') as out:
    out.write("// === FUNCTION LT ===\n")
    out.write(js[idx_lt:idx_pt] + "\n\n")
    out.write("// === FUNCTION PT ===\n")
    out.write(js[idx_pt:idx_gt] + "\n\n")
    out.write("// === FUNCTION GT ===\n")
    out.write(js[idx_gt:idx_end] + "\n\n")

print("Saved to scratch/extracted_ladipage_gallery.js")
