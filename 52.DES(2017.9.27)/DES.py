import pyDes


data = b'Please encrypt my data'
k = pyDes.des(b'DESCRYPT', pyDes.CBC, b'\0\0\0\0\0\0\0\0', pad=None, padmode=pyDes.PAD_PKCS5)
d = k.encrypt(data)
print(d)
e = k.decrypt(d).decode()
print(e)

# class DES(object):
#
# 	def __init__(self):
# 		pass
#
# 	def encrypto(self):
# 		pass
#
#
# if __name__ == '__main__':
# 	des = DES()
# 	des.encrypto()