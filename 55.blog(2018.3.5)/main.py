from flask import Flask, render_template, redirect, url_for, session, request
from models import Article, User, Comment
from exts import db
import config


app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)


@app.route('/')
def index():
    articles = Article.query.all()[:10]
    return render_template('index.html', articles=articles)


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/article_detail/<article_id>')
def article_detail(article_id):
    article = Article.query.filter(Article.id == article_id).first()
    article.reading_quantity += 1
    db.session.commit()
    return render_template('article_detail.html', article=article)


@app.route('/write_article/', methods=['GET', 'POST'])
def write_article():
    if request.method == 'GET':
        return render_template('write_article.html')
    else:
        article_title = request.form.get('title')
        article_author = request.form.get('author')
        article_keyword = request.form.get('keyword')
        article_content = request.form.get('content')
        # write the text to database
        new_article = Article(title=article_title, author=article_author, keyword=article_keyword, content=article_content)
        db.session.add(new_article)
        db.session.commit()
        return redirect(url_for('index'))


if __name__ == '__main__':
    app.run()
