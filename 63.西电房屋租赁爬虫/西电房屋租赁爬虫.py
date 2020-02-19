# import urllib.request
import requests
from lxml import etree
from bs4 import BeautifulSoup


class Spider_forum(object):

    def __init__(self):
        self.init_url = 'http://club.xdnice.com/'
        self.page_url = 'http://club.xdnice.com/forum.php?mod=forumdisplay&fid=118&filter=sortid&sortid=252&searchsort=1&czfs=1&rent=1&yanta=1&page=1'
        self.enable_url_list = []
        self.session = requests.session()

    def run(self):
        # requset_index_html = urllib.request.urlopen(self.init_url1, data=data).read().decode('gbk')
        self.session.get(url=self.page_url)
        requset_index_html1 = self.session.get(url=self.page_url).content
        etree_HTML = etree.HTML(requset_index_html1)
        self.enable_url_list = etree_HTML.xpath('//div[@class="comiis_postlist cl"]/p/em[4]/a[@title!="关闭的主题 - \r\n新窗口打开"]/@href')
        for each_url in self.enable_url_list:
            info_dic = {
                '租金':'',
                '配置':'',
                '联系人':'',
                '具体地址':'',
                'QQ':'',
                '电话':'',
            }
            url_response = self.session.get('http://club.xdnice.com/{}'.format(each_url)).content
            etree_url_response = etree.HTML(url_response)
            zujin_flag = etree_url_response.xpath('//div[@class="pcb"]/div/p/font/text()')
            info_dic['租金'] = zujin_flag[0].strip()
            p_flag = etree_url_response.xpath('//div[@class="pcb"]/div/p/text()')
            info_dic['配置'] = p_flag[1].split('：')[-1].strip().replace('\xa0', ' ')
            info_dic['联系人'] = p_flag[4].split('：')[-1].strip()
            info_dic['具体地址'] = p_flag[5].split('：')[-1].strip()
            info_dic['QQ'] = p_flag[6].split('：')[-1].strip()
            info_dic['电话'] = p_flag[7].split('：')[-1].strip()
            print(info_dic)


        # soup = BeautifulSoup(requset_index_html1, 'html.parser')
        # a1 = soup.find_all('a', attrs={'title':'关闭的主题 - \r\n新窗口打开'})[-1]
        # print(a1.content)


if __name__ == '__main__':
    spider_forum = Spider_forum()
    spider_forum.run()