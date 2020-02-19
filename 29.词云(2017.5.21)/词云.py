import re
import jieba
import matplotlib.pyplot as plt
from scipy.misc import imread
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator

a = []
with open('aaa.txt', 'r', encoding = 'utf-8') as op:
  # for eachline in op.readlines():
  f = op.readlines()
  for each in f:
    if each != '\n':
      if str(re.match(r'2017-\d\d-\d\d', each)) == 'None':
        each = each.replace('[表情]', '')
        each = each.replace('[图片]', '')
        each = each.replace('\n', '')
        each = each.replace('，', '')
        each = each.replace('。', '')
        each = each.replace('\"', '')
        each = each.replace('(', '')
        each = each.replace(')', '')
        if each != '\n' and each != '':
          a.append(each)
li = ''.join(a)
# print(li)
seg_list = jieba.cut(li)
word = "/".join(seg_list)
# print(word)

backgroud_Image = imread('25.jpg')
wc = WordCloud(background_color='white',    # 设置背景颜色
               mask=backgroud_Image,        # 设置背景图片
               max_words=500,            # 设置最大现实的字数
               stopwords=STOPWORDS,        # 设置停用词
               font_path='C:\Windows\Fonts\msyh.ttc',  # 设置字体格式，如不设置显示不了中文
               max_font_size=100,            # 设置字体最大值
               random_state=100,         # 设置有多少种随机生成状态，即有多少种配色方案
               width=1920,
               height=1080
               )
wc.generate(word)
image_colors = ImageColorGenerator(backgroud_Image)
wc.recolor(color_func=image_colors)
# plt.imshow(wc)
# plt.axis('off')
# plt.figure()
# # recolor wordcloud and show
# # we could also give color_func=image_colors directly in the constructor
# plt.imshow(wc.recolor(color_func=image_colors))
# # plt.axis("off")
# # 绘制背景图片为颜色的图片
# plt.figure()
# plt.imshow(backgroud_Image, cmap=plt.cm.gray)
# plt.axis("off")
# plt.show()
wc.to_file('251.jpg')
