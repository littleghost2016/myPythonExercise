from email.header import Header
from email.mime.text import MIMEText


# 发送邮件函数
def send(email_client, sender_account, receiver_account, title, content):

    msg = MIMEText(content, 'plain', 'utf-8')
    msg['Subject'] = Header(title, 'utf-8')
    msg['From'] = sender_account
    msg['To'] = receiver_account

    email_client.sendmail(sender_account, receiver_account, msg.as_string())
