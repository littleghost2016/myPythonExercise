import itchat
import requests

KEY = '***'


@itchat.msg_register(itchat.content.TEXT)
def get_response(msg):
    # apiUrl = 'http://www.tuling123.com/openapi/api'
    # data = {
    #     'key': KEY,
    #     'info': msg,
    #     'userid': 'wechat-robot'
    # }
    # try:
    #     r = requests.post(url=apiUrl, data=data).json()
    #     return r.get('text')
    # except:
    #     return
    print(msg['Text'])
    url = 'http://api.douqq.com/?key=bUhhWlhpVEFGVExNU1RjZFYvdTYyPT1qbUJJQUFBPT0&msg='
    return '自动回复' + requests.post(url + msg['Text']).text


def tuling_reply(msg):
    defaultReply = 'I received: ' + msg['Text']
    reply = get_response(msg['Text'])
    return reply or defaultReply


if __name__ == '__main__':
    itchat.auto_login(enableCmdQR=True, hotReload=True)
    itchat.run()
