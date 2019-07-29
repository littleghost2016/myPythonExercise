import urllib.request
import urllib.parse
import random

url='http://www.whatismyip.com.tw'
data={}
data['sc_project']='6392240'
data['java']='1'
data['security']='65d86b9d'
data['u1']='D7C94E8398D24FE066CA47CF48D4D74F'
data['sc_random']='0.002837299549012462'
data['jg']='14'
data['rr']='1.1.1.1.1.1.1.1.1'
data['resolution']='1920'
data['h']='1080'
data['camefrom']=''
data['u']='http://www.whatismyip.com.tw/'
data['t']='我的IP地址查询'
data['rcat']='d'
data['rdomo']='d'
data['rdomg']='14'
data['bb']='0'
data['sc_snum']='1'
data['sess']='a181b5'
data['p']='0'
data['invisible']='1'
data=urllib.parse.urlencode(data).encode('utf-8')

iplist=['110.73.1.162:8123','113.65.21.254:9797','49.70.0.150:83','183.140.82.128:3128','221.237.155.64:9797']

proxy_support=urllib.request.ProxyHandler({'http':random.choice(iplist)})

opener=urllib.request.build_opener(proxy_support)
opener.addheaders=[('User-Agent'),'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.22 Safari/537.36 SE 2.X MetaSr 1.0']

urllib.request.install_opener(opener)

response=urllib.request.urlopen(url,data)
html=response.read().decode('utf-8')

print(html)
