class Tentotwo(object):
    """docstring for Tentotwo"""

    def __init__(self, num):
        super(Tentotwo, self).__init__()
        self.__remainder = 0
        self.__count = ''
        self.__num = num

    def run(self):
        while self.__num != 1 and self.__num != 0:
            self.__remainder = self.__num % 2
            self.__count = str(self.__remainder) + self.__count
            self.__num = self.__num >> 1
        self.__count = str(self.__num) + self.__count
        print(self.__count)


class Twototen(object):
    """docstring for Twototen"""

    def __init__(self, num):
        super(Twototen, self).__init__()
        self.__num = str(num)
        self.__temp = len(self.__num) - 1

    def run(self):
        res = 0
        for x in self.__num:
            res += int(x) << int(self.__temp)
            self.__temp -= 1
        print(res)


def main():
    t1 = Tentotwo(1023)
    t1.run()
    t2 = Twototen(100001)
    t2.run()

if __name__ == '__main__':
    main()
