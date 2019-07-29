import requests
from bs4 import BeautifulSoup


class Spider(object):
    def __init__(self, username, password):
        self.session = requests.session()
        self.url_login = 'http://ids.xidian.edu.cn/authserver/login?service=http%3A%2F%2F202.117.124.85%2Flogin%2F'
        self.url_auth = 'http://202.117.124.85/query-records'
        self.username = username
        self.password = password
        self.headers = {
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'ids.xidian.edu.cn',
            'Referer': 'http://ids.xidian.edu.cn/authserver/login?service=http%3A%2F%2F202.117.124.85%2Flogin%2F',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0',
        }

    def login(self):
        response = self.session.get(self.url_login)
        soup = BeautifulSoup(response.content, 'html.parser')
        data = {
            'username': self.username,
            'password': self.password,
            'submit': '',
            'lt': self.get_lt(soup),
            'execution': self.get_execution(soup),
            '_eventId': 'submit',
            'rmShown': '1'
        }
        self.session.post(self.url_login, data=data, headers=self.headers)

    def get_lt(self, soup):
        return soup.find('input', attrs={'name': 'lt'}).get('value')

    def get_execution(self, soup):
        return soup.find('input', attrs={'name': 'execution'}).get('value')

    def read(self):
        s = self.session.get('http://202.117.124.85/')
        soup = BeautifulSoup(s.content, 'html.parser')
        result = soup.find(attrs={'class': 'huge'}).string.strip()
        print('累计成功打卡次数：{}'.format(result))


if __name__ == '__main__':
    spider = Spider(username='', password='')
    spider.login()
    spider.read()
