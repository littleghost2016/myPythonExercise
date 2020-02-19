L = [('Bob', 75), ('Adam', 92), ('Bart', 66), ('Lisa', 88)]
'''第一题'''
print(sorted(L, key=lambda x: x[0]))
'''第二题'''
print(sorted(L, key=lambda x: x[1], reverse=True))
