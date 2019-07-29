import base64
a = 'admin'
b = base64.b64encode(str.encode(a))
print(bytes.decode(b))
# b = base64.b64encode(a.encode())
# print(b.decode())
