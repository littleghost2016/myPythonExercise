import requests
import pickle

r = requests.get('http://www.pythonchallenge.com/pc/def/banner.p').text
result = pickle.loads(r.encode())
for each in result:
    print(''.join([c[0] * c[1] for c in each]))
