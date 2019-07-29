# -*- coding:utf-8 -*-

from PIL import Image, ImageFont, ImageDraw, ImageFilter
import random


# 返回随机字母
def charRandom():
    return chr((random.randint(65, 90)))


# 返回随机数字
def numRandom():
    return random.randint(0, 9)


# 随机颜色
def colorRandom1():
    return (random.randint(64, 255), random.randint(64, 255), random.randint(64, 255))


# 随机长生颜色2
def colorRandom2():
    return (random.randint(32, 127), random.randint(32, 127), random.randint(32, 127))


width = 60 * 4
height = 60
image = Image.new('RGB', (width, height), (255, 255, 255));
# 创建font对象
font = ImageFont.truetype('C:\Windows\Fonts\msyh.ttc', 36);

# 创建draw对象
draw = ImageDraw.Draw(image)
# 填充每一个颜色
for x in range(width):
    for y in range(height):
        draw.point((x, y), fill=colorRandom1())

# 输出文字
for t in range(4):
    draw.text((60 * t + 10, 10), charRandom(), font=font, fill=colorRandom2())

# 模糊
# image = image.filter(ImageFilter.BLUR)
image.save('./image/code.jpg', 'jpeg')