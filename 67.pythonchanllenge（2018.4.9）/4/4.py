import requests

url = 'http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing='
last = 12345 # The first number.
while True:
    r = requests.get(url + str(last)).text
    # ---and the next nothing is xxxxx---
    data = r.split(' ')
    if data[-1].isdigit():
        last = int(data[-1])
    elif data[-1] == 'going.':
    # ---Yes. Divide by two and keep going.---
        last /= 2
    else:
        break
    print(last)

print(data[-1])

# The key is {peak.html}.
# The url return to xxx.html.
# http://www.pythonchallenge.com/pc/def/peak.html