from exts import db
from datetime import datetime


class Article(db.Model):
    __tablename__ = 'article'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    # Sqlite
    create_time = db.Column(db.DateTime, default=datetime.now)
    # Mysql
    # create_time = db.Column(db.Time, default=datetime.now)
    author = db.Column(db.String(20), nullable=False, default='我')
    reading_quantity = db.Column(db.Integer, nullable=False, default=0)
    content = db.Column(db.Text, nullable=False)
    keyword = db.Column(db.String(20), nullable=False)


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(100), nullable=False)


class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    author = db.Column(db.String(50), nullable=False)
    create_time = db.Column(db.Time, default=datetime.now)