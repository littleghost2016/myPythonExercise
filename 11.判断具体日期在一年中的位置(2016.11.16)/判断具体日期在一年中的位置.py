'''
【程序4】：
题目：输入某年某月某日，判断这一天是这一年的第几天？
1.程序分析：以3月5日为例，应该先把前两个月的加起来，然后再加上5天即本年的第几天，特殊
　　　　　　情况，闰年且输入月份大于3时需考虑多加一天。
2.程序源代码：
'''

import re

index = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
date = '1900.12.31'  # date=int(input('Please input the date like xxxx.xx.xx'))
number = 0
match = re.search(r'(\d+).(\d+).(\d+)', date)
for i in range(int(match.group(2)) - 1):
    number += index[i]
number += int(match.group(3))
if ((int(match.group(1)) % 4 == 0 and int(match.group(1)) % 100 != 0) or int(match.group(1)) % 400 == 0) and int(match.group(2)) > 2:
    number += 1  # 闰年判断：（能被400整除） or （能被4整除但不能被100整除）
print(number)

'''The given answer:

year = int(input('year:\n'))
month = int(input('month:\n'))
day = int(input('day:\n'))

months = (0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334)
if 0 <= month <= 12:
    sum = months[month - 1]
else:
    print('data error')
sum += day
leap = 0
if (year % 400 == 0) or ((year % 4 == 0) and (year % 100 != 0)):
    leap = 1
if (leap == 1) and (month > 2):
    sum += 1
print('it is the %dth day.' % sum)
'''
