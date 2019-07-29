def tri():
    L = [1]
    for g in range(11):
        yield L
        L = [1] + [L[x] + L[x + 1] for x in range(len(L) - 1)] + [1]

for g in tri():
    print(g)
