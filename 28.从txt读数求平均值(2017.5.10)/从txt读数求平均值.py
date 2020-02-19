temp = 0
with open('1.txt', 'r') as op:
    for line in op:
        line = int(line.strip('\n'))
        temp += line
print(temp / 20)
