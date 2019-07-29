import requests
from bs4 import BeautifulSoup


class Spider(object):
    """docstring for Spider"""

    def __init__(self, username=None, password=None):
        super(Spider, self).__init__()
        self.url_login = 'http://bbs.gfan.com/index.php'
        self.url_auth = 'http://bbs.gfan.com/home.php?mod=space&uid=14795105&do=profile&from=space'
        self.captcha = 'http://bbs.gfan.com/member.php?mod=logging&action=login&auth=788fZs6igQQwuMDgYvLpNNzzvoRnrqnRocg8UYGlR5rc5ZHoJQshid4ihR7pUEHjfxoR06FTUMb2jfS%2BTeEUoWjsZ2mnjwY&referer=http%3A%2F%2Fbbs.gfan.com%2Fforum.php%3Fmod%3Dforumdisplay%26fid%3D170%26filter%3Dauthor%26orderby%3Ddateline%26typeid%3D'
        self.headers = {
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'bbs.gfan.com',
            'Origin': 'http://bbs.gfan.com',
            'Referer': 'http://bbs.gfan.com/index.php',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0'
        }
        self.username = username
        self.password = password
        self.session = requests.Session()

    def login(self):
        data = {
            'fastloginfield': 'username',
            'username': self.username,
            'password': '202cb962ac59075b964b07152d234b70',
            'quickforward': 'yes',
            'handlekey': self.get_ls(),
        }
        s = self.session.get(self.url_auth)
        s = self.session.post(s.url, data=data, headers=self.headers)
        s = self.session.get(self.url_auth)
        print(s.text)

    def get_ls(self):
        response = self.session.get(self.url_auth, headers=self.headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        ls = soup.find(attrs={'name': 'handlekey'}).get('value')
        return ls

    def read(self):
        self.session.get('')


if __name__ == '__main__':
    spider = Spider(username='',
                    password='')
    spider.login()
