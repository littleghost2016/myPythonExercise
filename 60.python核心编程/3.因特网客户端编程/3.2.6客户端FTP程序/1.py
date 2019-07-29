import smtplib
from email.mime.text import MIMEText


msg = MIMEText('HI,I\'m the LittleGhost', 'plain', 'utf-8')
msg['Subject'] = 'python test email'
msg['From'] = '***'
msg['To'] = '***'
server = smtplib.SMTP_SSL('smtp.qq.com', 465)
