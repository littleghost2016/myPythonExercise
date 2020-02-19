import socket


HOST = '127.0.0.1'
PORT = 21567
BUFSIZ = 1024
ADDR = (HOST, PORT)

tcpClisock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcpClisock.connect(ADDR)

while True:
    data = input('> ')
    if not data:
        break
    tcpClisock.send(data.encode())
    data = tcpClisock.recv(BUFSIZ)
    if not data:
        break
    print(data.decode('utf-8'))

tcpClisock.close()
