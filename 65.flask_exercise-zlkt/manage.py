# manage.py
from flask_script import Manager
from test import app
from db_script import db_manager
from flask_migrate import Migrate, MigrateCommand
from extension import db
from models import Article, User


manager = Manager(app)

# 创建环境-(init)->模型-(migrate)->迁移文件-(upgrade)->表
# 1.要使用flask_migrate，必须绑定app和db
# python manage.py db init
migrate = Migrate(app, db)
# 2.把MigrateCommand命令添加到manager中
# python manage.py db migrate
manager.add_command('db', MigrateCommand)
# 此时就可以删除主app文件中的
# with app.app_context():
#     db.create_all()
# 3.
# python manage.py db upgrade

# 若后期修改字段，需要执行migrate和upgrade命令


@manager.command
def runserver():
    print('1111111111')

manager.add_command('db1', db_manager)


if __name__ == '__main__':
    manager.run()