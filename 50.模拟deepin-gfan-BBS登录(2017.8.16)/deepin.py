import requests
from bs4 import BeautifulSoup


class Spider(object):
    """docstring for Spider"""

    def __init__(self):
        super(Spider, self).__init__()
        self.url_login = 'https://login.deepin.org/oauth2/authorize?client_id=6b19a7fd09783519f0c8d79a6a5c1d57e7853871&redirect_uri=http://bbs.deepin.org/api/syn_deepinid.php&response_type=code&scope=base,user:read'
        self.session = requests.session()
        self.headers = {

        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0'
        }

    def get_token(self):
        response=requests.get(self.url_login).content
        soup=BeautifulSoup(response,'html.parser')
        token=soup.find('input',attrs={'name':'_token'}).get('value')
        return token

    def login(self,username,password):
        data={
            '_token':self.get_token,
            'key':'',
            'error_no':'',
            'username':username,
            'password':password,
            'remember':'on',
        }
        r = self.session.post(self.url_login,data=data,headers=self.headers)
        r = self.session.get(self.url_login,headers=self.headers)
        print(r.text)


if __name__ == '__main__':
    spider = Spider()
    spider.login(username='',password='')
