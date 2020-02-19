class Person(object):
    pass


p1 = Person()
p1.name = 'Bart'

p2 = Person()
p2.name = 'Adam'

p3 = Person()
p3.name = 'Lisa'

L1 = [p1, p2, p3]
L2 = sorted(L1, key=lambda x: x.name)

print(L2[0].name)
print(L2[1].name)
print(L2[2].name)
