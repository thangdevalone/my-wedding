import calendar
import datetime

# November 2026
# Columns: T2 (MON = 0), T3 (TUE = 1), T4 (WED = 2), T5 (THU = 3), T6 (FRI = 4), T7 (SAT = 5), CN (SUN = 6)
col_lefts = [
    0,         # T2 (Mon)
    36.99,     # T3 (Tue)
    73.98,     # T4 (Wed)
    110.97,    # T5 (Thu)
    147.96,    # T6 (Fri)
    184.95,    # T7 (Sat)
    221.94     # CN (Sun)
]

row_tops = [
    25.43,     # Row 0
    50.74,     # Row 1
    75.05,     # Row 2
    100.30,    # Row 3
    126.06,    # Row 4
    151.37     # Row 5 (if needed)
]

cal = calendar.monthcalendar(2026, 11)
print("November 2026 Calendar (Mon-Sun):")
for r_idx, week in enumerate(cal):
    print(f"Week {r_idx}: {week}")

# Let's map each day 1..30 to (top, left)
day_positions = {}
for r_idx, week in enumerate(cal):
    for c_idx, day in enumerate(week):
        if day != 0:
            top = row_tops[r_idx]
            left = col_lefts[c_idx]
            day_positions[day] = (top, left, r_idx, c_idx)
            print(f"Day {day:2d}: top = {top:6.2f}px, left = {left:6.2f}px (Row {r_idx}, Col {c_idx})")

# Where is Day 28?
top28, left28, r28, c28 = day_positions[28]
print(f"\n>>> Day 28 is on Row {r28} (top {top28}px), Col {c28} (T7 / Saturday, left {left28}px)")
# Heart shape SHAPE1 position:
# Originally Day 23 was at top: 100.295px, left: 147.959px, and SHAPE1 was at top: 93.045px; left: 147.958px;
# Offset for SHAPE1 relative to day number: top - 7.25px, left ~ same!
shape1_top = top28 - 7.25
shape1_left = left28
print(f">>> SHAPE1 should be at: top: {shape1_top:.3f}px; left: {shape1_left:.3f}px;")
