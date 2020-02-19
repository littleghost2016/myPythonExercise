from functools import reduce


def char2int(l):
    return {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}[l]


def int22(x, y):
    return x * 10 + y

l = '12345'
print(reduce(int22, map(char2int, l)))
