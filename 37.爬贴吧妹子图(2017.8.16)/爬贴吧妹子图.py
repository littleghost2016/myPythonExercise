import requests
from bs4 import BeautifulSoup

url = 'https://tieba.baidu.com/p/5469754911'
r = requests.get(url).content
soup = BeautifulSoup(r, 'html.parser')
#result = soup.find_all('img', attrs={'class': 'BDE_Image'})
result = soup.find_all('img', attrs={'class': 'forum_image'})
for i, j in enumerate(result):
    res = requests.get(str(j.attrs.get('src'))).content
    with open(str(i) + '.jpg', 'wb') as f:
        f.write(res)
