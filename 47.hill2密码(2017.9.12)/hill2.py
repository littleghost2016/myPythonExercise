import re
import numpy


class Hill2cipher(object):

    # 初始化变量
    def __init__(self):
        self.encryprtion_matrix = [[1, 2], [0, 3]]
        self.plaintext = ''
        self.cipher = ''

    # 加密字符串
    def encodestr(self, plaintext):
        self.plaintext = plaintext
        result_of_str2matrix = self.str2matrix()
        calculate_result = self.multiplymatrix(self.encryprtion_matrix, result_of_str2matrix)
        self.matrix2str(calculate_result)
        return self.cipher

    def str2matrix(self):
        temp_matrix = []
        temp_sen = list(re.sub(r'[^a-z]', '', self.plaintext))
        for i in temp_sen:
            temp_matrix.append(ord(i) - 96)
        if len(temp_matrix) % 2 == 1:
            temp_matrix.append(temp_matrix[-1])
        even_list = temp_matrix[::2]
        odd_list = temp_matrix[1::2]
        temp_matrix = [even_list, odd_list]
        return temp_matrix

    def matrix2str(self, calculate_result):
        temp_matrix_1 = []
        temp_matrix_2 = []
        for i in range(len(calculate_result[0])):
            for j in range(len(calculate_result)):
                temp_matrix_1.append(calculate_result[j][i])
        for i in temp_matrix_1:
            self.cipher += chr(i+96)
        return

    # 矩阵乘法
    def multiplymatrix(self, leftmatrix, rightmatrix):
        result = []
        if len(leftmatrix[0]) != len(rightmatrix):
            return 'ERROR'
        else:
            left_row = len(leftmatrix)
            left_column = len(leftmatrix[0])
            # right_row = len(rightmatrix)
            right_column = len(rightmatrix[0])

            # 矩阵乘法核心---三层嵌套的循环
            for i in range(left_row):
                result.append([])
                for j in range(right_column):
                    sum_result = 0
                    for k in range(left_column):
                        sum_result += leftmatrix[i][k] * rightmatrix[k][j]
                    sum_result %= 26
                    result[i].append(sum_result)
            return result

    # 求逆矩阵
    def inversematrix(self, matrix):
        return numpy.linalg.inv(matrix)

    # 求矩阵的转置
    def transposematrix(self):
        pass

    # 求矩阵的伴随矩阵
    def getaudejugatematrix(self):
        pass

if __name__ == '__main__':
    sentence = 'our marshal was shot'
    hill2cipher = Hill2cipher()
    print(hill2cipher.encodestr(sentence))
