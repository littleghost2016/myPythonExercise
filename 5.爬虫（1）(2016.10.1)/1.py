#urllib包的使用
import urllib.request
a=urllib.request.urlopen('http://www.fishc.com')
b=a.read()
print(b)
b=b.decode('utf-8')
print(b)
