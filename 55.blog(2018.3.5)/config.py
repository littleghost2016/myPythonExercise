DEBUG = True

SECRET_KEY = '\xe0\x15\xe9\xb8\x17\x93&\xd6\x90(A\xfd\x1b{\xb46p\x06\xeaJ\x14d\x89\x96'


# mysql dialect+driver://username:password@host:port/database
# DIALECT = 'mysql'
# DRIVER = 'pymysql'
# USERNAME = 'root'
# PASSWORD = 'root'
# HOST = '127.0.0.1'
# PORT = '3306'
# DATABASE = 'blog_demo'
# SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=utf8'.format(DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DATABASE)

# sqlite
SQLALCHEMY_DATABASE_URI = 'sqlite:///data.sqlite'

SQLALCHEMY_TRACK_MODIFICATIONS = False