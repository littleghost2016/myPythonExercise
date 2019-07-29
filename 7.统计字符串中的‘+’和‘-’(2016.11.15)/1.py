str = '+U+n+c---+e+r+t---+a-+i-+n+t+y---+-+r+u--+1+e+s---'
a = b = 0
for each in str:
    if(each == '+'):
        a += 1
    if(each == '-'):
        b += 1
print(' \'+\' 共有:%d 个' % (a))
print(' \'-\'  共有:%d 个' % (b))
