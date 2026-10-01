with open('scratch/ladipagev3.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Let's inspect 512000 to 516000
start = 512000
end = 516000
print(js[start:end])
