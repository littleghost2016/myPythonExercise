import requests
import time
from lxml import etree


class getProxy():

    def __init__(self):
        self.user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0'
        self.header = {'User-Agent': self.user_agent}
        self.dbname = 'Proxy.db'
        self.now = time.strftime('%Y-%m-%d')

    def getContent(self):
        nn_url = 'http://www.xicidaili.com/nn/' + str(num)
        req = requests.get(nn_url, header = self.header).content
        et = etree.HTML(req)
        result_even = et.xpath('//tr[@class]=""')
        result_odd = et.xpath('//tr[@class="odd"')

