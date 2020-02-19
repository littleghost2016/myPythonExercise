# coding = utf-8
import socket
import time


HOST = ''
PORT = 21567
BUFSIZ = 1024
ADDR = (HOST, PORT)

tcpSerSock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcpSerSock.bind(ADDR)
tcpSerSock.listen(5)

while(True):
    print('waiting for connetion...')
    tcpCliSock, addr = tcpSerSock.accept()
    print('...conneted from:', addr)

    while(True):
        data = tcpCliSock.recv(BUFSIZ)
        print(data)
        if not data:
            break
        # print(type(time.ctime()))------------------------------------<class str>
        # print(type(data))--------------------------------------------<class bytes>
        # -------combine the strings
        # ---------convert string to bytes
        senddata = '[' + time.ctime() + '] ' + data.decode()
        tcpCliSock.send(senddata.encode())
        # tcpCliSock.send(b'[%b] %b' % (time.ctime().encode(), data))  # or
        # write in this way

    tcpCliSock.close()
tcpSerSock.close()
