# -*-encoding:utf-8-*-
# coding=utf-8
__author__ = 'ysc'
import requests
from bs4 import BeautifulSoup
import xlrd
import xlwt


class ScrapeGrade:
    def __init__(self, auth_url=None, log_url=None):
        if not auth_url:
            self.auth_url = "http://ids.xidian.edu.cn/authserver/login?service=http%3A%2F%2Fjwxt.xidian.edu.cn%2Fcaslogin.jsp"
            self.log_url = "http://jwxt.xidian.edu.cn/caslogin.jsp"
        else:
            self.auth_url = auth_url
            self.log_url = log_url
        self.session = requests.Session()

    def login(self, id='1302051****', password='****'):
        r = self.session.get(self.auth_url)
        data = r.text
        bsObj = BeautifulSoup(data, "html.parser")
        lt_value = bsObj.find(attrs={"name": "lt"})['value']
        exe_value = bsObj.find(attrs={"name": "execution"})['value']
        params = {'username': id, 'password': password,
                  "submit": "", "lt": lt_value, "execution": exe_value,
                  "_eventId": "submit", "rmShown": '1'}
        headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0",
                   'Accept': "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                   # "Host": "ids.xidian.edu.cn",
                   "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                   "Accept-Encoding": "gzip, deflate",
                   "Referer": "http://ids.xidian.edu.cn/authserver/login?service=http%3A%2F%2Fjwxt.xidian.edu.cn%2Fcaslogin.jsp",
                   # 'X-Requested-With': "XMLHttpRequest",
                   "Content-Type": "application/x-www-form-urlencoded"}
        s = self.session.post(self.auth_url, data=params, headers=headers)
        s = self.session.get(self.log_url)

    def store_into_db_by_term(self):
        # 按学期进行分类
        import sqlite3

        conn = sqlite3.connect('grades_term.db')
        # conn.text_factory = str  ##!!!
        c = conn.cursor()
        try:
            # init the counter of the sheet
            row = 0
            # 打开成绩页面
            grade_page = self.session.get("http://jwxt.xidian.edu.cn/gradeLnAllAction.do?type=ln&oper=qbinfo&lnxndm=2015-2016%D1%A7%C4%EA%B5%DA%D2%BB%D1%A7%C6%DA(%C1%BD%D1%A7%C6%DA)")
            bsObj2 = BeautifulSoup(grade_page.text, "html.parser")
            # datas 包含了所有学期的成绩, table
            datas = bsObj2.find_all("table", attrs={"class": "titleTop2"})
            # seme 指每学期的成绩. table
            for i, seme in enumerate(datas):
                # 写入一行标题th
                ths = seme.find_all('th')
                titles = []
                for col, th in enumerate(ths):
                    print(th.string.strip(), end='   ')
                    th = th.string.strip()
                    if th != '学分' and th != "成绩":
                        titles.append(th + r'  text')
                    else:
                        titles.append(th + r'  real')
                    # table.write(row, col, th.string.strip(), self.set_style('Times New Roman', 220, True))
                # Create table

                sent = '''CREATE TABLE {0} ( '''.format('table' + str(i + 1))
                for ith, title in enumerate(titles):
                    sent += title
                    if ith < len(titles) - 1:
                        sent += ",   "
                sent += ")"
                try:
                    c.execute(sent)
                    conn.commit()
                except sqlite3.OperationalError:
                    pass

                print('\n')
                row += 1
                # 各科成绩
                subs = seme.findAll('td', attrs={"align": "center"})
                col_iter = 0
                len_ths = len(ths)
                grade_subs = []
                # sub为具体的某科成绩
                for sub in subs:

                    if sub.string:
                        if sub.string.strip() != '':
                            print(sub.string.strip(), end='   ')
                            grade_subs.append("'" + sub.string.strip() + "'")
                        else:
                            print("' '", end='   ')
                            grade_subs.append("' '")
                    else:
                        print(sub.find('p').string.strip(), end='   ')
                        grade_subs.append("'" + sub.find('p').string.strip() + "'")
                    col_iter += 1
                    if col_iter == len_ths:
                        # 此时一科的成绩以及visited, 该访问下一科
                        print('\n')
                        # Insert a row of data
                        sent = '''INSERT INTO {0} VALUES( '''.format('table' + str(i + 1))
                        for ith, grade_sub in enumerate(grade_subs):
                            sent += grade_sub
                            if ith < len(grade_subs) - 1:
                                sent += ",   "
                        sent += ")"
                        try:
                            c.execute(sent)
                            conn.commit()
                        except sqlite3.OperationalError as e:
                            print(e)
                            print(sent)
                            exit(-2)
                        row += 1
                        col_iter = 0
                        grade_subs = []
                print("\n")
                # 保存到xls中

        finally:
            conn.close()

    def store_into_db_by_prop(self):
        # 按科目属性(必修\选修)进行分类
        import sqlite3

        conn = sqlite3.connect('grades_prop.db')
        c = conn.cursor()
        try:
            # init the counter of the sheet
            row = 0
            # 打开成绩页面
            grade_page = self.session.get("http://jwxt.xidian.edu.cn/gradeLnAllAction.do?type=ln&oper=sxinfo&lnsxdm=001")
            bsObj2 = BeautifulSoup(grade_page.text, "html.parser")
            # datas 包含了所有学期的成绩, table
            datas = bsObj2.find_all("table", attrs={"class": "titleTop2"})
            # seme 指每学期的成绩. table
            for i, seme in enumerate(datas):
                # 写入一行标题th
                ths = seme.find_all('th')
                titles = []
                for col, th in enumerate(ths):
                    print(th.string.strip(), end='   ')
                    th = th.string.strip()
                    if th != '学分' and th != "成绩":
                        titles.append(th + r'  text')
                    else:
                        titles.append(th + r'  real')
                    # table.write(row, col, th.string.strip(), self.set_style('Times New Roman', 220, True))
                # Create table

                sent = '''CREATE TABLE {0} ( '''.format('table' + str(i + 1))
                for ith, title in enumerate(titles):
                    sent += title
                    if ith < len(titles) - 1:
                        sent += ",   "
                sent += ")"
                try:
                    c.execute(sent)
                    conn.commit()
                except sqlite3.OperationalError:
                    pass

                print('\n')
                row += 1
                # 各科成绩
                subs = seme.findAll('tr', attrs={'class': "odd"})
                col_iter = 0
                len_ths = len(ths)
                grade_subs = []
                # sub为具体的某科信息
                for sub in subs:
                    infors = sub.findAll('td')  # , attrs={"align": "center"})
                    for infor in infors:
                        if infor.string:
                            if infor.string.strip() != '':
                                print(infor.string.strip(), end='   ')
                                grade_subs.append("'" + infor.string.strip() + "'")
                            else:
                                print("' '", end='   ')
                                grade_subs.append("' '")
                        else:
                            infor = infor.find('p').string.strip()
                            if infor != '':
                                print(infor, end='   ')
                                grade_subs.append("'" + infor + "'")
                            else:
                                print("' '", end='   ')
                                grade_subs.append("' '")

                    # 此时一科的成绩已经visited, 该访问下一科
                    print('\n')
                    # Insert a row of data
                    sent = '''INSERT INTO {0} VALUES( '''.format('table' + str(i + 1))
                    for ith, grade_sub in enumerate(grade_subs):
                        sent += grade_sub
                        if ith < len(grade_subs) - 1:
                            sent += ",   "
                    sent += ")"
                    try:
                        c.execute(sent)
                        conn.commit()
                    except sqlite3.OperationalError as e:
                        print(e)
                        print(sent)
                        exit(-2)
                    row += 1
                    col_iter = 0
                    grade_subs = []
                print("\n")
                # 保存到xls中

        finally:
            conn.close()

    def set_style(self, name, height, bold=False):
        style = xlwt.XFStyle()
        font = xlwt.Font()
        font.name = name  # 'Times New Roman'
        font.bold = bold
        font.color_index = 4
        font.height = height
        '''
        borders= xlwt.Borders()
        borders.left= 6
        borders.right= 6
        borders.top= 6
        borders.bottom= 6
        '''
        style.font = font
        # style.borders = borders
        return style

    def store_into_xls(self):
        file = xlwt.Workbook()
        table = file.add_sheet('grades', cell_overwrite_ok=True)
        # init the counter of the sheet
        row = 0
        # 打开成绩页面
        grade_page = self.session.get("http://jwxt.xidian.edu.cn/gradeLnAllAction.do?type=ln&oper=qbinfo&lnxndm=2015-2016%D1%A7%C4%EA%B5%DA%D2%BB%D1%A7%C6%DA(%C1%BD%D1%A7%C6%DA)")
        bsObj2 = BeautifulSoup(grade_page.text, "html.parser")
        # datas 包含了所有学期的成绩, table
        datas = bsObj2.find_all("table", attrs={"class": "titleTop2"})
        # seme 指每学期的成绩. table
        for seme in datas:
            # 写入一行标题th
            ths = seme.find_all('th')
            for col, th in enumerate(ths):
                print(th.string.strip(), end='   ')
                table.write(row, col, th.string.strip(), self.set_style('Times New Roman', 220, True))
            print('\n')
            row += 1
            # 各科成绩
            subs = seme.findAll('td', attrs={"align": "center"})
            col_iter = 0
            len_ths = len(ths)
            # sub为具体的某科成绩
            for sub in subs:
                if sub.string:
                    print(sub.string.strip(), end='   ')
                    table.write(row, col_iter, sub.string.strip())
                else:
                    print(sub.find('p').string.strip(), end='   ')
                    table.write(row, col_iter, sub.find('p').string.strip())
                col_iter += 1
                if col_iter == len_ths:
                    print('\n')
                    row += 1
                    col_iter = 0
            print("\n")
            # 保存到xls中
            file.save('demo.xls')


if __name__ == '__main__':
    # 初始化爬虫对象
    sg = ScrapeGrade()
    # 登录(在此处传入正确的个人学号与密码信息)
    sg.login(id='', password='')
    # 保存成绩为excel
    sg.store_into_xls()
