# coding = utf-8
import socket
import time

HOST = '192.168.199.145'
PORT = 21567
ADDR = (HOST, PORT)

tcpClisock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcpClisock.connect(ADDR)


def send(name):
    tcpClisock.send(name.encode())
    time.sleep(0.001)
    with open(name, 'rb') as in1:
        data = in1.read()
        tcpClisock.sendall(data)


def main():
    send('tsTclnt.py')
    tcpClisock.close()

if __name__ == '__main__':
    main()
