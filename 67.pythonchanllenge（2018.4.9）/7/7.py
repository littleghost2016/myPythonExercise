from PIL import Image


img = Image.open('smarty_files/oxygen.png')
data = [img.getpixel((i, j)) for i in range(0, 609) for j in range(43, 53)]
row = [chr(img.getpixel((i, 43))[0]) for i in range(0, 609, 7)]
for i in row:
    print(i, end='')
print()
# smart guy, you made it. the next level is [105, 110, 116, 101, 103, 114, 105, 116, 121]
print(''.join(map(chr, [105, 110, 116, 101, 103, 114, 105, 116, 121])))

# The key is {integrity}
# http://www.pythonchallenge.com/pc/def/integrity.html