#对文件的操作
f=open('D:\\wordlist.txt','a')
for i in range(0,6):
    f.write(str(i)+'\n')
for line in open('D:\\wordlist.txt'):
    print(line)
f.close()
