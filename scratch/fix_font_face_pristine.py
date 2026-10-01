import re

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace all @font-face rules with pristine, valid CSS
pristine_font_faces = """
@font-face {
  font-family: "QkVZTEUEVSRkVDVElPTiSRUdVTEFSLlRURg";
  src: url("/fonts/beyondperfection-regular-20260608154336-ef_3n.ttf") format("truetype");
  font-display: swap;
}
@font-face {
  font-family: "QluemVsRGVjbJhdGlZSSZWdbGFyLnRZg";
  src: url("/fonts/cinzeldecorative-regular-20260608072146-oxrr_.ttf") format("truetype");
  font-display: swap;
}
@font-face {
  font-family: "TGyYSSZWdbGFyLnRZg";
  src: url("/fonts/lora-regular-20260507122944-joqic.ttf") format("truetype");
  font-display: swap;
}
@font-face {
  font-family: "MUZUViWSVAtRXJnaXNhLVJlZVsYXIgKDEpLmZg";
  src: url("/fonts/1ftv-vip-ergisa-regular-1-20260507115831-zgvj8.otf") format("opentype");
  font-display: swap;
}
@font-face {
  font-family: "UZOLVdhbGxvdMubRm";
  src: url("/fonts/svn-wallows-20260615031637-bjis_.otf") format("opentype");
  font-display: swap;
}
@font-face {
  font-family: "UZOLVJcRsaWnLVNvdWkLmZg";
  src: url("/fonts/svn-rustling-sound-20260617074109-dq1gv.otf") format("opentype");
  font-display: swap;
}
@font-face {
  font-family: "RmyZXNLVJlZVsYXIudHRm";
  src: url("/fonts/forest-regular-20260619012504-he6vp.ttf") format("truetype");
  font-display: swap;
}
@font-face {
  font-family: "MUZUViWSVAtSElHSCTUElSSVRFRCPVEY";
  src: url("/fonts/1ftv-vip-high-spirited-20260517150751-hrtrm.otf") format("opentype");
  font-display: swap;
}
@font-face {
  font-family: "MUZUViWSVAtTGFdWFyZGkudHRm";
  src: url("/fonts/1ftv-vip-lazuardi-20260623105043-0zc9k.ttf") format("truetype");
  font-display: swap;
}
"""

# Remove existing @font-face rules from wedding.css
css_no_ff = re.sub(r'@font-face\s*\{[^}]*\}', '', css)

# Prepend pristine font faces right after wrapper rule
idx = css_no_ff.find('.w-element {')
if idx != -1:
    end_elem = css_no_ff.find('}', idx) + 1
    new_css = css_no_ff[:end_elem] + "\n/* === EMBEDDED FONTS === */\n" + pristine_font_faces + "\n" + css_no_ff[end_elem:]
else:
    new_css = pristine_font_faces + "\n" + css_no_ff

with open(r'd:\thiepcuoi\wedding-nextjs\public\wedding.css', 'w', encoding='utf-8') as f:
    f.write(new_css)

print("Updated wedding.css with pristine @font-face rules!")
