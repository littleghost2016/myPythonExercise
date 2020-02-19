from flask import Flask, render_template, request, session, redirect, url_for, g
import os


app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search/')
def search():
    q = request.args.get('q')
    return 'get的参数是%s' % q

@app.route('/login/', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        username = request.form.get('username')
        password = request.form.get('password')
        if username == 'zhiliao' and password == '123456':
            session['username'] = 'zhiliao'
            return 'login succeed.'
        else:
            return 'username or password error.'
        # return 'username:%s<br>password:%s' % (username, password)

@app.route('/edit/')
def edit():
    if hasattr(g, 'username'):
        return '修改成功'
    else:
        return redirect(url_for('login'))

@app.before_request
def my_before_request():
    if session.get('username'):
        g.username = session,get('username')


if __name__ == '__main__':
    app.run(debug=True)
