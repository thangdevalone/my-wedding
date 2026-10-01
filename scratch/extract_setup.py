with open('scratch/ladipagev3.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = 523000
end = 525000
print(js[start:end])
