from django.shortcuts import render
import xlrd
from . import models

# Create your views here.

def display(request):
    workbook = xlrd.open_workbook('./db/303.xlsx')
    sheet = workbook.sheet_by_index(0)
    for i in range(1, sheet.nrows):
        student_number = i[1]
        student_name = i[2]
        student_home_address = i[3]
        # models.students_information.

    return render(request, 'db/display_homepage.html')