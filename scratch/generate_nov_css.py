# Map each number 1..31 to its HEADLINE ID:
num_to_id = {
    1: "HEADLINE11",
    2: "HEADLINE12",
    3: "HEADLINE13",
    4: "HEADLINE14",
    5: "HEADLINE15",
    6: "HEADLINE16",
    7: "HEADLINE17",
    8: "HEADLINE18",
    9: "HEADLINE19",
    10: "HEADLINE20",
    11: "HEADLINE21",
    12: "HEADLINE22",
    13: "HEADLINE23",
    14: "HEADLINE24",
    15: "HEADLINE25",
    16: "HEADLINE26",
    17: "HEADLINE27",
    18: "HEADLINE28",
    19: "HEADLINE29",
    20: "HEADLINE30",
    21: "HEADLINE31",
    22: "HEADLINE32",
    23: "HEADLINE35",
    24: "HEADLINE33",
    25: "HEADLINE34",
    26: "HEADLINE36",
    27: "HEADLINE37",
    28: "HEADLINE38",
    29: "HEADLINE39",
    30: "HEADLINE40",
    31: "HEADLINE41"
}

import calendar
col_lefts = [0, 36.99, 73.98, 110.97, 147.96, 184.95, 221.94]
row_tops = [25.43, 50.74, 75.05, 100.30, 126.06, 151.37]
cal = calendar.monthcalendar(2026, 11)

css_lines = []
for r_idx, week in enumerate(cal):
    for c_idx, day in enumerate(week):
        if day != 0:
            hid = num_to_id[day]
            t = row_tops[r_idx]
            l = col_lefts[c_idx]
            css_lines.append(f"#{hid} {{ top: {t:.2f}px !important; left: {l:.2f}px !important; }}")

# Day 31 is hidden in Nov
css_lines.append(f"#{num_to_id[31]} {{ display: none !important; }}")

# Day 28 heart SHAPE1:
# Day 28 is on Row 4 (126.06px), Col 5 (184.95px)
css_lines.append(f"#SHAPE1 {{ top: 118.81px !important; left: 184.95px !important; }}")

css_output = "\n".join(css_lines)
print(css_output)

with open('scratch/nov_calendar.css', 'w', encoding='utf-8') as f:
    f.write(css_output)
