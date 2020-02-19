import socketserver
import time


class MyServer(socketserver.BaseRequestHandler):
	def handle(self):
		print('Connected from', self.client_address)

		while True:
			name = self.request.recv(1024)
			sfile = open(name.decode(), 'wb')
			while True:
				data = self.request.recv(1024)
				if not data:
					break
				sfile.write(data)
			sfile.flush()
			sfile.close()
			break

		self.request.close()

		print('Disconnected from', self.client_address)

if __name__ == '__main__':
	print(time.ctime() + ' : ' + 'Server is started...')
	srv = socketserver.ThreadingTCPServer(('', 21567), MyServer)
	srv.serve_forever()

