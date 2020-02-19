import createKey
import time


def main():
    n, f_n, e, d = createKey.createKeys()
    # n = 71867806849671839
    # f_n = 71867805994574856
    # e = 605
    # d = 0
    print('n:{}, f_n:{}, e:{}, d:{}'.format(n, f_n, e, d))


if __name__ == '__main__':
    print(time.ctime())
    main()
    print(time.ctime())
