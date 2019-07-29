'''
【程序11】
题目：古典问题：有一对兔子，从出生后第3个月起每个月都生一对兔子，小兔子长到第三个月
　　　后每个月又生一对兔子，假如兔子都不死，问每个月的兔子总数为多少？
1.程序分析：　兔子的规律为数列1,1,2,3,5,8,13,21....
2.程序源代码：
main()
{
long f1,f2;
int i;
f1=f2=1;
for(i=1;i<=20;i++)
　{ printf("%12ld %12ld",f1,f2);
　　　if(i%2==0) printf("\n");/*控制输出，每行四个*/
　　　f1=f1+f2; /*前两个月加起来赋值给第三个月*/
　　　f2=f1+f2; /*前两个月加起来赋值给第三个月*/
　}
}
'''

# The first version:
print('0\n1\n1')
for i in range(2019):
    print(i + 3, end=' ')
    if i == 0:
        a = b = 1
    c = a + b
    a = b
    b = c
    print(c)
print('\n\n')
'''
# The second version:
print('0')
a = b = 1
for i in range(22):
    # print(i,end=' ')
    print(a)
    print(b)
    a = a + b
    b = a + b
print('\n\n')
'''
'''The given answer :
f1 = 1
f2 = 1
for i in range(1,21):
    print ('%12d %12d' % (f1,f2))
    if (i % 2) == 0:
        print ('')
    f1 = f1 + f2
    f2 = f1 + f2
'''
# We can see that the second version has better efficiency.

# The third version(2017.5.17):

'''
class Fib(object):
    def __init__(self):
        self.a, self.b = 0, 1  # ---------------------Give the initial value.

    def __iter__(self):
        return self           # ---------------------This class is a iterator.

    def __next__(self):
        self.a, self.b = self.b, self.a + self.b
        if self.a > 1000000000:
            # -------------------Raise the exception and the iterator will stop.
            raise StopIteration
        return self.a

fib = Fib()
print('0')
aaa = 1
for each in fib:
    print(aaa, end=' ')
    aaa += 1
    print(each)
'''
