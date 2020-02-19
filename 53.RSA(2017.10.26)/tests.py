import random
import multiprocessing
import time


def main1():
    x = 14
    y = 18
    z = []
    z = ExtendedEuclid(x,y,z)
    if(z[0]):
        print('{}和{}互素，乘法的逆元是：{}\n'.format(x, y, z[1]))
    else:
        print('{}和{}不互素，最大公约数为：{}\n'.format(x, y, z[1]))
    return 0

def ExtendedEuclid(f, d , result):
    # x1,x2,x3,y1,y2,y3,t1,t2,t3,q
    x1 = 1
    y2 = 1
    x2 = 0
    y1 = 0
    if(f >= d):
        x3 = f
        y3 = d
    else:
        x3 = d
        y3 = f

    while True:
        if ( y3 == 0 ):
            result = x3 # 两个数不互素则result为两个数的最大公约数，此时返回值为零
            return 0, result
        if ( y3 == 1 ):
            result = y2 # 两个数互素则result为其乘法逆元，此时返回值为1
            return 1, result

        q = x3 / y3
        t1 = x1 - q * y1
        t2 = x2 - q * y2
        t3 = x3 - q*y3
        x1 = y1
        x2 = y2
        x3 = y3
        y1 = t1
        y2 = t2
        y3 = t3

def egcd(a, b):
    if b == 0:
        return a, 1, 0
    else:
        g, x, y = egcd(b, a % b)
        return g, y, x - a / b * y


def modPow(a, b, m):
    v = 1
    p = a % m
    b = int(b)
    while(b > 0):
        if (b & 1) != 0:
            v = (v * p) % m
        p = (p * p) % m
        b >>= 1
    return v


def witness(a, n):
    n1 = n - 1
    s2 = n1 & -n1
    x = modPow(a, n1 / s2, n)
    if x == 1 or x == n1:
        return False
    while (s2 > 1):
        x = (x * x) % n
        if x == 1:
            return True
        if x == n1:
            return False
        s2 >>= 1
    return True


def probably_prime(n, k):
    if n == 2 or n == 3:
        return True
    if n < 2 or n % 2 == 0:
        return False
    for i in range(k):
        if witness(random.randint(1, n - 3) + 2, n):
            return False
    return True

def aaa():
    if probably_prime(607, 1):
        print('YES')
    else:
        print('NO')

def output_number(number):
    while True:
        print(number)
        time.sleep(1)

if __name__ == '__main__':
    # main1()
    #
    # a = 7
    # b = 48
    # print(egcd(a, b))
    t1 = multiprocessing.Process(target=output_number, args=(1,))
    t2 = multiprocessing.Process(target=output_number, args=(2,))
    t1.start()
    t2.start()

