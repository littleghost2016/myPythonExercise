b = 1000  # input('请输入一个整数，程序会自动输出其因数：')
c = 1
for a in range(2, b):
    if b % a == 0:
        print('第' + str(c) + '个因数为' + str(a))
        c += 1
        continue
