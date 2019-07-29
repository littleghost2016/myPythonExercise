import random
import time
import multiprocessing


def createKeys():
    # 产生密钥的主函数

    # 产生公钥n, f_n, e
    n, f_n, e = createPublicKey()
    # 产生私钥d
    d = createPrivateKey(e, f_n)
    return n, f_n, e, d

def createPrivateKey(e, f_n):
    # 产生私钥d
    temp = egcd(e, f_n)[1]
    while temp < 0:
        temp += f_n
    return temp

def createPublicKey():
    # 产生公钥，由生成的p和q间接产生n, f_n, e

    # 产生两个随机素数
    # p = 5
    # p = createPrime()
    # q = 11
    # q = createPrime()

    # 多线程
    t1 = multiprocessing.Process(target=createPrime)
    t2 = multiprocessing.Process(target=createPrime)
    t1.start()
    t2.start()
    t1.join()
    t2.join()

    n = p * q
    f_n = (p - 1) * (q - 1)
    # 产生e
    # e = 3
    e = createE(f_n)
    return n, f_n, e

def createPrime():
    # 产生素数

    # 1--朴素试除法
    # while(True):
    #     temp = random.randint(2, 2 ** 40)
    #     half_temp = temp >> 1
    #     prime_flag = True
    #     for j in range(2, half_temp):
    #         if temp % j == 0:
    #             prime_flag = False
    #             break
    #     if prime_flag == True:
    #         return temp

    # 2--米勒罗宾素性检验算法
    def modPow(a, b, m):
        v = 1
        p = a % m
        b = int(b)
        while b > 0:
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
        while s2 > 1:
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

    while True:
        temp = random.randint(2, 2 ** 128)
        if probably_prime(temp, 2):
            return temp


def createE(f_n):
    # 产生e

    # 1
    # while (True):
    #     e = random.randint(2 ** 25, 2 ** 30)
    #     e_flag = True
    #     if e < f_n:
    #         smaller = e
    #     else:
    #         smaller = f_n
    #     for i in range(2, smaller + 1): # not (1, smaller+1)
    #         if (e % i == 0) and (f_n % i == 0):
    #             e_flag = False
    #             break
    #     if e_flag == True:
    #         return e

    # 2
    while True:
        e = random.randint(2 ** 25, 2 ** 30)
        # 判断e和f_n是否互素
        is_husu = egcd(e, f_n)
        if is_husu[0] == 1:
            return e


def egcd(a, b):
    # 扩展欧几里得算法
    if b == 0:
        return a, 1, 0
    else:
        g, x, y = egcd(b, a % b)
        # print('---', x - a / b * y)
        # print('----', int(x - a / b * y))
        return g, y, x - a // b * y


if __name__ == '__main__':
    print(time.ctime())
    createKeys()
    print(time.ctime())
