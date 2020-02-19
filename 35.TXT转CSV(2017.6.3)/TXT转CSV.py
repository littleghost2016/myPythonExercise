import pandas

Cno = []
Cname = []
Ccredit = []
with open('course.txt', encoding='utf-8') as op:  # encoding='utf-8'
    a = op.readlines()
    for each in a:
        each = each.strip().split(',')  # Ccredit will be followed a '\n'.
        Cno.append(each[0])
        Cname.append(each[1])
        Ccredit.append(each[2])
save = pandas.DataFrame({'Cno': Cno, 'Cname': Cname, 'Ccredit': Ccredit})
print(save)
save.to_csv('course.csv', index=False)
