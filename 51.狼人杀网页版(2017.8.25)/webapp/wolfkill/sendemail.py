import smtplib
from email.mime.text import  MIMEText
from email.utils import formataddr


def send_email(message, subject, to_address):
    res = True
    try:
        msg = MIMEText(message, 'html', 'utf-8')
        msg['From'] = formataddr(['心蓝', '***'])
        msg['to'] = formataddr(to_address)
        msg['subject'] = subject

        server = smtplib.SMTP_SSL('smtp.qq.com', 465)
        server.login('***','')
        server.sendmail('***',[to_address[1], ], msg.as_string())
        server.quit()
    except Exception as e:
        print(e)
        res = False
    return res