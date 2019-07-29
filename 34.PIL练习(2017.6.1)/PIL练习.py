from PIL import Image, ImageFilter, ImageDraw, ImageFont
import random


class Image_processing(object):
    """docstring for Image_processing"""

    def __init__(self, project, save_name):
        super(Image_processing, self).__init__()
        self.__project = project
        self.__save_name = save_name

    def change_size(self):
        im = Image.open(self.__project)
        w, h = im.size
        print('Original image size: %sx%s' % (w, h))
        im.thumbnail((w // 2, h // 2))
        print('Resize image to: %sx%s' % (w // 2, h // 2))
        im.save(self.__save_name, 'jpeg')

    def blur(self):
        im = Image.open(self.__project)
        im2 = im.filter(ImageFilter.BLUR)
        im2.save(self.__save_name, 'jpeg')

    def verification_code(self):
        def rndChar():
            return chr(random.randint(65, 90))
        def rndColor():  # 随机颜色1:
            return (random.randint(64, 255), random.randint(64, 255), random.randint(64, 255))
        def rndColor2():  # 随机颜色2:
            return (random.randint(32, 127), random.randint(32, 127), random.randint(32, 127))
        # 240 x 60:
        width = 60 * 4
        height = 60
        image = Image.new('RGB', (width, height), (255, 255, 255))
        font = ImageFont.truetype('C:\\Windows\\Fonts\\Arial.ttf', 36)  # 创建Font对象:
        draw = ImageDraw.Draw(image)  # 创建Draw对象:
        for x in range(width):  # 填充每个像素:
            for y in range(height):
                draw.point((x, y), fill=rndColor())
        for t in range(4):  # 输出文字:
            draw.text((60 * t + 10, 10), rndChar(), font=font, fill=rndColor2())
        image = image.filter(ImageFilter.BLUR)  # 模糊:
        image.save(self.__save_name, 'jpeg')


def main():
    img = Image_processing('2.jpg', '22.jpg')
    img.verification_code()

if __name__ == '__main__':
    main()
