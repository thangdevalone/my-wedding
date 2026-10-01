# Convert 28/11/2026 to lunar date using python lunarcalendar or standard astronomical formula
# 28/11/2026 is around October 2026 in lunar calendar
# Let's verify with astronomical calculation or public data
import urllib.request
import json

# Or calculate:
# 2026-10-23 was (Tức ngày 14 tháng 09 năm Bính Ngọ)
# How many days from 2026-10-23 to 2026-11-28?
# October has 31 days. So 31 - 23 = 8 days left in Oct. + 28 days in Nov = 36 days later.
# 14/09 + 36 days:
# If month 9 lunar has 29 or 30 days:
# If 30 days: 16 days left in month 9 + 20 days into month 10 -> Ngày 20 tháng 10 năm Bính Ngọ!
# Let's verify lunar calendar for 2026-11-28
print("Days difference:", (datetime.date(2026, 11, 28) - datetime.date(2026, 10, 23)).days)
