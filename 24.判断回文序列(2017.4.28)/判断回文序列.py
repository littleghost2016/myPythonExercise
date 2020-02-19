def is_palindrome(l):
    l = str(l)
    return l == l[::-1]

output = filter(is_palindrome, range(1, 1000))
print(list(output))
