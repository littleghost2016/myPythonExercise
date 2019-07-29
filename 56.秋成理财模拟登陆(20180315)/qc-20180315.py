import requests
from lxml import etree


class Spider_forum(object):

    def __init__(self):
        self.login_url = 'http://qiuchenglicai.com/member.php?mod=logging&action=login'


    def run(self):
        session = requests.session()
        login_url_html = session.get(self.login_url).text
        etree_HTML = etree.HTML(login_url_html)
        form_hash = str(etree_HTML.xpath('//input[@name="formhash"]/@value')[0])
        login_hash = str(etree_HTML.xpath('//h3[@class="flb"]/em/@id')[0]).split('_')[-1]
        login_url2 = 'http://qiuchenglicai.com/member.php?mod=logging&action=login&loginsubmit=yes&loginhash={}&inajax=1'.format(login_hash)
        login_data = {
            'username': '***',
            'password': '***',
            'referer': 'http://qiuchenglicai.com/member.php',
            'formhash': form_hash,
        }
        login_header = {
            'Host': 'qiuchenglicai.com',
            'Origin': 'http://qiuchenglicai.com',
            'Referer': 'http://qiuchenglicai.com/member.php?mod=logging&action=login',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        }
        session.post(login_url2, data = login_data, headers=login_header).content
        for each_url in range(1, 700000):
            init_url = 'http://qiuchenglicai.com/home.php?mod=space&uid={}'.format(each_url)
            requset_index_html1 = session.get(url=init_url).content
            etree_HTML = etree.HTML(requset_index_html1)
            name = str(etree_HTML.xpath('//div[@class="p-username"]/a/strong/text()')[0])
            print(name)


if __name__ == '__main__':
    spider_forum = Spider_forum()
    spider_forum.run()