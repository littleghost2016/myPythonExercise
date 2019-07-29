class LFSR(object):
	
	def __init__(self):
		self.matrix = [1, 0, 0, 1, 1]
		self.result = self.matrix[:]

	def encrypto(self, aaa):
		aaa_1 = []
		for i, j in enumerate(aaa):
			if j == 1:
				aaa_1.append(i)
		for i in range(20):
			k = self.matrix[aaa_1[0]]
			temp = aaa_1[1:]
			for j in temp:
				k ^= self.matrix[j]
			self.result.append(k)
			self.matrix.pop(0)
			self.matrix.append(k)
		return self.result


class JKCFQ(object):

	def __init__(self):
		self.j = [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1]
		self.k = [1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1]

	def encrypto(self):
		string = ''
		ck1 = 0
		for i in range(10):
			if ck1 == 0:
				temp = self.j[i]
			else:
				temp = ~self.k[i] + 2  # 取k[i]的反没想出好办法，或者加if
			ck1 = temp
			string += str(temp)
		return string


class ZKXLSCQ(object):

	def __init__(self):
		self.m1 = [1, 1, 1, 0, 1, 0, 0]
		self.m2 = [1, 1, 1, 0, 0, 1, 0]

	def encrypto(self):
		flag = 0
		string = ''
		for i in range(7):
			if self.m1[i] == 1:
				string += str(self.m2[flag])
				flag += 1
			else:
				string += str(self.m2[flag])
		return string


if __name__ == '__main__':
	lfsr = LFSR()
	print(lfsr.encrypto([1, 0, 0, 1, 0]))
	
	jkcfq = JKCFQ()
	print(jkcfq.encrypto())
	
	zkxlscq = ZKXLSCQ()
	print(zkxlscq.encrypto())
