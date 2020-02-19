import requests
import time


def get_captcha():
    headers = {
                'Host': 'www.zhihu.com',
                'Referer': 'https://www.zhihu.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Inter Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87'
    }
    t = str(int(time.time()))
    print(t)
    captcha_url = 'https://www.zhihu.com/captcha.gif?r=' + t + '&type=login'
    a = requests.get(captcha_url, headers = headers).content
    print(a)
    with open('abc.gif','wb') as f:
        f.write(a)
    # https://www.zhihu.com/captcha.gif?r=1505029478&type=login
