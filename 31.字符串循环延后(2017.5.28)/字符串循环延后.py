class Cut(object):
    """docstring for Cut"""

    def __init__(self, source, num):
        super(Cut, self).__init__()
        self.num = num
        self.source = source

    def run(self):
        res = self.source[self.num:] + self.source[:self.num]
        print(res)


def main():
    cut = Cut('abcdefg', 2)
    cut.run()

if __name__ == '__main__':
    main()
