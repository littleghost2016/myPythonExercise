'''
【程序7】
题目：输出特殊图案，请在c环境中运行，看一看，Very Beautiful!
1.程序分析：字符共有256个。不同字符，图形不一样。　　　　　　
2.程序源代码：
'''
a = 176
b = 219
print(chr(b), chr(a), chr(a), chr(a), chr(b))
print(chr(a), chr(b), chr(a), chr(b), chr(a))
print(chr(a), chr(a), chr(b), chr(a), chr(a))
print(chr(a), chr(b), chr(a), chr(b), chr(a))
print(chr(b), chr(a), chr(a), chr(a), chr(b))

# I search 'chr' on the Interenet.It's said that that can be used to
# encrypt something.
'''
通过help 查看相关函数的帮助文档

>>>help (chr)

chr(...)

    chr(i) -> character

    Return a string of one character with ordinal i; 0 <= i < 256.

参数是0 - 256 的一个整数，返回值是当前整数对应的ascii字符。参数可以是10进制也可以是16进制的形式

十六进制：

>>> print chr(0x30), chr(0x31), chr(0x61)
0 1 a
十进制：

>>> print chr(48), chr(49), chr(97)
0 1 a
unichr(...)

    unichr(i) -> Unicode character
    Return a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff.

unichr()和chr()函数功能基本一样， 只不过是返回unicode的字符

ord(...)
    ord(c) -> integer
    Return the integer ordinal of a one-character string.

参数是一个ascii字符，返回值是对应的十进制整数

>>> print ord('a'), ord('0'), ord('1')
97 48 49
>>> print "%x %x %x" % (ord('a'), ord('0'), ord('1'))
61 30 31
>>> print "%#x %#x %#x" % (ord('a'), ord('0'), ord('1'))
0x61 0x30 0x31
通过chr()和ord()联合起来使用，我们就可以对字符串进行相关运算的转换

比如一个字符串str1，转化成另一个字符串str2， 使得 str2[i] = str1[i] - i

str1 = "eb;3ej8h"
>>> for i in range(0, len(str1)):
...     print chr((ord(str1[i])-i)),
...
e a 9 0 a e 2 a
'''
