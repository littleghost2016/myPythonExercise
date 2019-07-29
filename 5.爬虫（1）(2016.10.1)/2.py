#爬取图片并保存在本地
import urllib.request
#网址需要番羽墙
response=urllib.request.urlopen('http://placekitten.com/g/500/600')
cat_img=response.read()
with open('D:\\cat.jpg','wb') as f:
    f.write(cat_img)
print(response.info())
print(response.getcode())
