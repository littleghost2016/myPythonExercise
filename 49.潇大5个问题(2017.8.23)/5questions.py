# 题 1
# 检查密码规则合法性
# 考察基本编码能力和字符串处理
# 参考 python 文档的字符串库

# 给定一个字符串，用以下规则检查合法性
# 完全符合返回 True，否则返回 False
# 1，第一位是字母
# 2，只能包含字母、数字、下划线
# 3，只能字母或数字结尾
# 4，最小长度2
# 5，最大长度10
import re
import queue


def valid_password(pwd):
    if 2 <= len(pwd) <= 10 and re.search(r'[A-Za-z]', list(pwd)[0]) and re.search(r'[A-Za-z0-9]', list(pwd)[-1]) and not re.search(r'[^_A-Za-z0-9]', pwd):
        return True
    return False


# 题 2
# 返回 100 内的素数列表
# 考察基本的循环和选择概念、列表的使用

def prime_numbers():
    prime_number_list = [2]
    for i in range(3, 101, 2):
        i_flag = 0
        for j in range(2, i - 1):
            if i % j == 0:
                i_flag = 1
                break
        if i_flag == 0:
            prime_number_list.append(i)

    # filter(lambda x: not [x%i for i in range(2,i) if x%i==0],range(2,101))

    return prime_number_list


# 题 3
# 给定一个只包含字母的字符串，返回单个字母出现的次数
# 考察字典的概念和使用
# 返回值为包含元组的列表，格式如下（对列表中元组的顺序不做要求）
# 参数 "hello"
# 返回值 [('h', 1), ('e', 1), ('l', 2), ('o', 1)]

def letter_count(string):
    letter_list = list(string)
    letter_dict = {}
    for i in letter_list:
        if i in letter_dict:
            letter_dict[i] += 1
        else:
            letter_dict[i] = 1
    return list(letter_dict.items())


# 题 4
# 给定一个英文句子（一个只有字母的字符串），将句中所有单词变为有且只有首字母大写的形式

def cap_string(string):
    # [1]
    string = string.split(' ')
    temp_string = ''
    for i in string:
        i = list(i)
        if ord(i[0]) >= 97:
            i[0] = chr(ord(i[0]) - 32)
        temp_string += ''.join(i) + ' '
    string = ''.join(temp_string)

    # [2]
    # string = str.title()

    return string

# 题 5
# 写一个 Queue 类，它有两个方法，用法如下


class Queue1(object):

    def __init__(self):
        self.numbers = []

    def enqueue(self, num):
        self.numbers.insert(0, num)

    def dequeue(self):
        return self.numbers.pop()


class Queue2(object):

    def __init__(self):
        self.q = queue.Queue()

    def enqueue(self, num):
        self.q.put(num)

    def dequeue(self):
        if not self.q.empty():
            return self.q.get()
        else:
            return 'Queue is empty!'


if __name__ == '__main__':
    print(valid_password('sd_1oi_e'))

    print(prime_numbers())

    print(letter_count('hello'))

    print(cap_string('We all have a computer'))

    q = queue.Queue()
    q.put(1)
    q.put(2)
    q.put(3)
    print(q.get())  # 1
    print(q.get())  # 2
    print(q.get())  # 3
    # print(q.get())  # 没有反应

    q = Queue2()
    q.enqueue(1)
    q.enqueue(2)
    q.enqueue(3)
    print(q.dequeue())  # 1
    print(q.dequeue())  # 2
    print(q.dequeue())  # 3
    print(q.dequeue())  # 优于queue.Queue()的无队员出队时无法应的情况
