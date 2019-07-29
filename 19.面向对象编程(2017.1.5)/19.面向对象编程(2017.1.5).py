# 2017//5/13 change the whole file
# understand more about the Object Oriented Programming(OOP-面向对象编程)
import re


class Search(object):
    def __init__(self, reg, source):
        self.__reg = reg
        self.source = source

    def P(self):
        res = re.search(self.__reg, self.source)  # return an object
        print(res.group())
        return res.group()


class Father(object):
    def __init__(self, name):
        self.name = name

    def pr(self):
        print(self.name)


class Child(Father):
    def __init__(self, name):
        # I forget the meaning of the sentence...
        super(Child, self).__init__(name)
        self.name = name

    def pr(self):
        print(self.name)


def main():
    '''exercise the re module'''
    reg = '[A-Z][a-z][A-Z][a-z][A-Z]'
    source = 'sdfiDlkmdsDKsdkfjDoJiLsdflkjDiKIKKK'
    you = Search(reg, source)
    you.P()

    '''exercise the inherit'''
    father = Father('I am the father.')
    child = Child('I am the son.')
    father.pr()
    child.pr()


if __name__ == '__main__':
    main()
