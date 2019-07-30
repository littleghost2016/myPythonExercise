from flask import Flask, request, render_template, redirect, url_for
from modules.meachine import Sender


app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':

        # 从表单中获取参数
        sender = request.form.get('sender')
        receiver = request.form.get('receiver')
        title = request.form.get('title')
        content = request.form.get('content')
        print(sender, receiver, title, content)

        # 执行发送程序
        sender = Sender(sender, receiver, content, title)
        result = sender.work()
        # 返回执行结果到网页
        return render_template('email_bomb/result.html', result=result)
    return render_template('email_bomb/index.html')


def run():
    app.run(host='127.0.0.1', port=22555, debug=True)


if __name__ == '__main__':
    run()