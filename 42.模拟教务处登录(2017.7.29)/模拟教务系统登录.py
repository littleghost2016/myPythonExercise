import requests
from bs4 import BeautifulSoup
# from http import cookiejar
# import os


class Spider(object):
    """docstring for Spider"""

    def __init__(self, username, password):
        super(Spider, self).__init__()
        self.username = username
        self.password = password
        self.session = requests.Session()
        # self.session.cookies = cookiejar.LWPCookieJar(filename='cookies.txt')
        self.url_login = 'http://ids.xidian.edu.cn/authserver/login?service=http%3A%2F%2Fjwxt.xidian.edu.cn%2Fcaslogin.jsp'
        self.url_manage = 'http://jwxt.xidian.edu.cn/caslogin.jsp'
        self.headers = {
            # 'Host': 'ids.xidian.edu.cn',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': self.url_login,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0'
        }
        # try:
        #     print(self.session.cookies)
        #     self.cookies.load(ingore_discard=True)
        # except FileNotFoundError:
        #     print('There is no cookies!')

    def login(self):
        response = self.session.get(self.url_login)
        soup = BeautifulSoup(response.text, 'html.parser')
        soup_lt = soup.find(attrs={'name': 'lt'}).get('value')
        soup_execution = soup.find(attrs={'name': 'execution'}).get('value')
        data = {
            'username': self.username,
            'password': self.password,
            'submit': '',
            'lt': soup_lt,
            'execution': soup_execution,
            '_eventId': 'submit',
            'rmShown': '1'
        }
        s = self.session.post(self.url_login, data=data, headers=self.headers)
        s = self.session.get('http://jwxt.xidian.edu.cn/gradeLnAllAction.do?type=ln&oper=qbinfo&lnxndm=2015-2016%D1%A7%C4%EA%B5%DA%D2%BB%D1%A7%C6%DA(%C1%BD%D1%A7%C6%DA)')
        soup2 = BeautifulSoup(s.text, 'html.parser')
        soup2_years = soup2.find_all('table', attrs={'class': 'titleTop2'})
        for soup2_years_each in soup2_years:
            titlename = soup2_years_each.find_all('th')
            for colunm, projectname in enumerate(titlename):
                print(projectname.string.strip(), end='\t\t')
            print('\n')
            projects = soup2_years_each.find_all('td', attrs={'align': 'center'})
            col = 0
            for each_project in projects:
                if each_project.string:
                    print(each_project.string.strip(), end='\t\t')
                else:
                    print(each_project.find('p').string.strip(), end='\t\t')
                col += 1
                if col == 7:
                    print('\n')
                    col = 0


if __name__ == '__main__':
    spider = Spider(username='', password='')
    spider.login()
