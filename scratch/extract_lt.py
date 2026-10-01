with open('scratch/ladipagev3.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Let's inspect 515000 to 522000
start = 515000
end = 523000
print(js[start:end])
