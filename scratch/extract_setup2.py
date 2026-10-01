with open('scratch/ladipagev3.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = 525000
end = 528000
print(js[start:end])
