# db_script.py
from flask_script import Manager

db_manager = Manager()


@db_manager.command
def init():
    print('初始化数据库完成')

@db_manager.command
def migrate():
    print('数据库迁移完成')