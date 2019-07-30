from flask import Flask, session
from extension import db
import time
import config


app = Flask(__name__)
app.config.from_object(config)
# db.init_app(app)
#
# with app.app_context():
#     db.create_all()

@app.route('/')
def index():
    session['username'] = 'zhiliao'
    return '1'


if __name__ == '__main__':
    app.run()
