# 这是一个字典程序QAQ
# 你可以的根据自己的需求生成需要的字典


def get_option():
    a1 = 'abcdefghijklmnopqrstuvwxyz'
    a2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    a3 = '0123456789'
    a4 = '!@#$%^&*()_+-=~`,./<>?'
    a5 = ''  # 可用于用户自定义字典
    # 你可以的选择一个自己想要的类型
    shows = '''欢迎来到字典程序，请按照您的需求一次键入您的要求。
    请不要尝试输入除abcde以外的选项，否则不能继续进行！
    a:所有小写英文字母
    b:所有大写英文字母
    c:数字
    d:特殊字符(!@#$%^&*()_+-=~`,./<>?)
    e:老子TM要自定义'''
    print(shows)
    number = int(input('''
注：不要输入负数，那没有意义！
电脑性能不行的，不要输入超过7位数，负责你会后悔的~~~
请输入您想要的字典位数:'''))
    if (number < 1):
        get_option()
    if (number > 7):
        print('''你这么相信你的电脑和你的耐心吗？
如果您想继续请扣1，老子就是这么自信
如果您放弃请扣2，让我再想想...''')
        mid = input()
        if mid == '1':
            print('我服了你了，程序将继续！')
        else:
            get_option()
    option = input('请输入一个您想要的字典类型：')  # 'c'
    the_option1 = option
    the_option2 = list(the_option1)
    for i in range(0, len(the_option2)):
        if (the_option2[i] < 'a' or the_option2[i] > 'e'):
            print('''---------------------------我是程序错误时出现的萌萌哒的分割线-------------------------------
                              您未按规定，输入了错误的参数选项！请重新输入！''')
            get_option()
    option = ''
    if (the_option1.find('a') > -1):
        option = option + a1
    if (the_option1.find('b') > -1):
        option = option + a2
    if (the_option1.find('c') > -1):
        option = option + a3
    if (the_option1.find('d') > -1):
        option = option + a4
    if (the_option1.find('e') > -1):
        addition = input('请输入您想自定义的字符：')  # 要输入的东西
        option = option + addition
    fun(option, number)


def fun(option, number):
    # number = 3
    c = []
    wordlist = list(option)
    i = 0
    while(i < (len(option)**number)):
        d = i
        j = 0
        while(j < number):
            c.insert(0, wordlist[d % len(option)])
            d = d // len(option)
            j += 1
        i = i + 1
        result = ''.join(c)
        print(result, end=' ' + str(i))
        print(' 我是每组的分割线QAQ')
        c = []
    print('已完成')


if __name__ == '__main__':
    get_option()
