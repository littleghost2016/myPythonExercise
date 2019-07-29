import re
import random


class Streamcipher(object):

    def __init__(self):
        self.plaintext = ''
        self.cipher = ''
        self.key = 8

    def encrypt(self, plaintext):
        self.plaintext = plaintext
        int_list = self.str_to_int(self.plaintext)
        encryption_stream_list = self.generate_encryption_stream(int_list)
        cipher_list = self.mod_plus(int_list, encryption_stream_list)
        self.cipher = self.int_to_str(cipher_list)
        print(self.cipher)

    def str_to_int(self, text):
        temp_list_1 = list(re.sub(r'[^a-z]', '', text))
        temp_list_2 = []
        for i in temp_list_1:
            temp_list_2.append(ord(i) - 97)
        return temp_list_2

    def generate_encryption_stream(self, int_list):
        self.key = 8  # self.key = random.randint(9)
        encrytion_stream_list = [self.key]
        for i in int_list[:-1]:
            encrytion_stream_list.append(i)
        return encrytion_stream_list

    def mod_plus(self, int_list, encryption_list):
        cipher_list = []
        for i in range(len(int_list)):
            cipher_list.append((int_list[i] + encryption_list[i]) % 26)
        return cipher_list

    def int_to_str(self, cipher_list):
        temp_list = []
        for i in cipher_list:
            temp_list.append(chr(i + 97))
        return ''.join(temp_list)

    def decrypt(self, cipher):
        int_list = self.str_to_int(cipher)



if __name__ == '__main__':
    plaintext = 'rendezvous'
    streamcipher = Streamcipher()
    streamcipher.encrypt(plaintext)
