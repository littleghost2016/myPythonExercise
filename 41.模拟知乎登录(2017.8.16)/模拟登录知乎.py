import requests
from bs4 import BeautifulSoup
import time
from http import cookiejar
import os


class Spider(object):
    def __init__(self):
        # self.request_URL='https://www.zhihu.com/login/phone_num'
        self.session = requests.Session()
        self.session.cookies = cookiejar.LWPCookieJar(filename = 'cookies.txt')
        self.headers = {
            'Host': 'www.zhihu.com',
            'Referer': 'https://www.zhihu.com',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Inter Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87'
        }
        try:
            print(self.session.cookies)
            self.session.cookies.load(ignore_discard=True)
        except FileNotFoundError:
            print('There is no cookies!')

    def get_xsrf(self):
        response = self.session.get('https://www.zhihu.com', headers=self.headers)
        soup = BeautifulSoup(response.content, "html.parser")
        # print('This is ', soup)
        # try:
        xsrf = soup.find('input', attrs={'name': '_xsrf'}).get("value")
        return xsrf
        # print('This is ', xsrf)
        '''except AttributeError:
            self.read()'''

    def get_captcha(self):
        t = str(int(time.time() * 1000))
        captcha_url = 'https://www.zhihu.com/captcha.gif?r=' + t + '&type=login'
        r = self.session.get(captcha_url, headers=self.headers)
        with open('captcha.jpg', 'wb') as f:
            f.write(r.content)
        captcha = input('验证码：')
        return captcha

    def login(self, phone_num=None, password=None):
        if os.path.exists('cookies.txt'):
            self.read()
        else:
            request_url = 'https://www.zhihu.com/login/phone_num'
            data = {
                'phone_num': phone_num,
                'password': password,
                '_xsrf': self.get_xsrf(),
                'captcha': self.get_captcha(),
                'remember_me': 'true'
            }
            response = self.session.post(request_url, data=data, headers=self.headers)
            login_code = response.json()
            print(login_code['msg'])
            for i in self.session.cookies:
                print(i)
            self.session.cookies.save()
            with open('html1.html', 'w') as f:
                f.write(self.session.get('https://www.zhihu.com', headers=self.headers).text)

    def read(self):
        with open('html.html', 'w') as f:
            f.write(self.session.get('https://www.zhihu.com', headers=self.headers).text)
        # print(self.session.get('https://www.zhihu.com', headers=self.headers).text)


if __name__ == '__main__':
    phone_num = '***'
    password = '***'
    spider = Spider()
    spider.login(phone_num, password)
