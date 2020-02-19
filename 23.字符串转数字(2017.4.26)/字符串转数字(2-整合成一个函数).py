from functools import reduce


def str2int(l):
    def char2int(l):
        return {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}[l]
    def fn(x, y):
        return x * 10 + y
    return reduce(fn, map(char2int, l))			#Pay attention to the "return"

print(str2int('12345'))
