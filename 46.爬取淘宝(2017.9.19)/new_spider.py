#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author: xinlan time:2017/09/06
import time
import requests
import re
import json
from hashlib import md5
import xlwt
# 数据
DATA = []

t = time.localtime()
# 搜索关键字
find_word = 'python'
# 参数
find_arg = {
    'q': find_word,
    'initiative_id': 'staobaoz_%s%02d%02d' % (t[0], t[1], t[2])
}
# 搜索页面url
first_url = "https://s.taobao.com/search?imgfile=&js=1&stats_click=search_radio_all%3A1&ie=utf8"

# 发送请求
r = requests.get(first_url, params=find_arg)
html = r.text

# 分析找出信息
content = re.findall(r'g_page_config = (.*?)g_srp_loadCss', html, re.S)[0][:-6]
# 转成字典
content = json.loads(content)
data_list = content['mods']['itemlist']['data']['auctions']
# 提取数据
for item in data_list:
    temp = {
        'title': item['title'],
        'view_price': item['view_price'],
        'view_sales': item['view_sales'],
        'view_fee': '否' if float(item['view_fee']) else '是',
        'isTmall': '是' if item['shopcard']['isTmall'] else '否',
        'area': item['item_loc'],
        'name': item['nick'],
        'detail_url': item['detail_url'],
    }
    DATA.append(temp)

# 保存一下cookie
cookie_ =r.cookies

# 首页面12条异步加载的数据
ksts = str(int(time.time()*1000))
url2 = "https://s.taobao.com/api?_ksTS={}_219&callback=jsonp220&ajax=true&m=customized&stats_click=search_radio_all:1&q=java&s=36&imgfile=&bcoffset=0&js=1&ie=utf8&rn={}".format(ksts, md5(ksts.encode()).hexdigest())

r2 = requests.get(url2, params=find_arg, cookies=cookie_)
html = r2.text
data_list = json.loads(re.findall(r'{.*}', html)[0])['API.CustomizedApi']['itemlist']['auctions']

# 提取数据
for item in data_list:
    temp = {
        'title': item['title'],
        'view_price': item['view_price'],
        'view_sales': item['view_sales'],
        'view_fee': '否' if float(item['view_fee']) else '是',
        'isTmall': '是' if item['shopcard']['isTmall'] else '否',
        'area': item['item_loc'],
        'name': item['nick'],
        'detail_url': item['detail_url'],
    }
    DATA.append(temp)
# 更新一下cookie
cookie_ = r2.cookies

# 爬取剩下的9页
for i in range(1, 10):
    ktsts = time.time()
    find_arg['_ksTS'] = "%s_%s" % (int(ktsts * 1000), str(ktsts)[-3:])
    find_arg['callback'] = "jsonp%d" % (float(str(ktsts)[-3:]) + 1)
    find_arg['data-value'] = 44 * i
    url = "https://s.taobao.com/search?data-key=s&data-value=44&ajax=true&imgfile=&js=1&stats_click=search_radio_all%3A1&ie=utf8&bcoffset=4&ntoffset=0&p4ppushleft=1%2C48".format(
        time.time())
    if i > 1:
        find_arg['s'] = 44 * (i - 1)
    r3 = requests.get(url, params=find_arg, cookies=cookie_)
    html = r3.text
    data_list = json.loads(re.findall(r'{.*}', html)[0])['mods']['itemlist']['data']['auctions']
    # 提取数据
    for item in data_list:
        temp = {
            'title': item['title'],
            'view_price': item['view_price'],
            'view_sales': item['view_sales'],
            'view_fee': '否' if float(item['view_fee']) else '是',
            'isTmall': '是' if item['shopcard']['isTmall'] else '否',
            'area': item['item_loc'],
            'name': item['nick'],
            'detail_url': item['detail_url'],
        }
        DATA.append(temp)

    cookie_ = r3.cookies

# 持久化
f = xlwt.Workbook(encoding='utf-8')
sheet01 = f.add_sheet(u'sheet1', cell_overwrite_ok=True)
# 写标题
sheet01.write(0, 0, '标题')
sheet01.write(0, 1, '标价')
sheet01.write(0, 2, '购买人数')
sheet01.write(0, 3, '是否包邮')
sheet01.write(0, 4, '是否天猫')
sheet01.write(0, 5, '地区')
sheet01.write(0, 6, '店名')
sheet01.write(0, 7, 'url')
# 写内容
for i in range(len(DATA)):
    sheet01.write(i+1, 0, DATA[i]['title'])
    sheet01.write(i+1, 1, DATA[i]['view_price'])
    sheet01.write(i+1, 2, DATA[i]['view_sales'])
    sheet01.write(i+1, 3, DATA[i]['view_fee'])
    sheet01.write(i+1, 4, DATA[i]['isTmall'])
    sheet01.write(i+1, 5, DATA[i]['area'])
    sheet01.write(i+1, 6, DATA[i]['name'])
    sheet01.write(i+1, 7, DATA[i]['detail_url'])

f.save(u'搜索%s的结果.xls' % find_word)

