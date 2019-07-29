import random
import multiprocessing

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
        temp = random.randint(2, 2 ** 256)
        # print(temp)
        if probably_prime(temp, 2):
            wri(temp)


def wri(num):
    with multiprocessing.Lock:
        with open('prime.txt', 'w+') as f:
            f.write(str(num))
            f.write('\n')


if __name__ == '__main__':
    t1 = multiprocessing.Process(target=createPrime)
    t2 = multiprocessing.Process(target=createPrime)
    t1.start()
    t2.start()
