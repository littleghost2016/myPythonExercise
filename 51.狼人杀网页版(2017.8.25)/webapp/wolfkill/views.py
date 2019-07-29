from django.shortcuts import render
import random
import hashlib
from . import models
import re


PLAYER_SETTING = {
    '7': {'狼人': 2, '平民': 2, '预言家': 1, '女巫': 1, '猎人': 1},
    '8': {'狼人': 3, '平民': 2, '预言家': 1, '女巫': 1, '猎人': 1},
    '9': {'狼人': 3, '平民': 3, '预言家': 1, '女巫': 1, '猎人': 1},
    '10': {'狼人': 4, '平民': 3, '预言家': 1, '女巫': 1, '猎人': 1},
    '11': {'狼人': 4, '平民': 4, '预言家': 1, '女巫': 1, '猎人': 1},
}

# Create your views here.
def index(request):
    return render(request, 'wolfkill/index.html')

def create_game(request, room_num):

    player_list = []
    status = request.POST.get('status')
    if status != None:
        models.Gamehall.objects.filter(room_num = status).delete()
    if room_num == '0':
        # 清理数据库
        temp_room = models.Gamehall.objects.all().count()
        if temp_room > 144:
            models.Gamehall.objects.all().delete()

        # 获取人数，分配房间号
        player_num = int(request.POST.get('player_num'))
        if player_num < 7 or player_num > 11:
            return render(request , 'wolfkill/index.html')
        player_setting  = PLAYER_SETTING[str(player_num)]
        for role in player_setting:
            for i in range(player_setting[role]):
                player_list.append({'role': role, 'player': '还没加入', 'person_id': ''})
        random.shuffle(player_list)
        temp_room_num_list = []
        for i in models.Gamehall.objects.all().values('room_num'):
            if i not in temp_room_num_list:
                temp_room_num_list.append(i)
        while True:
            room_num = str(random.randint(1, 20))
            if room_num not in temp_room_num_list:
                break

        # 返回所需信息
        for i, each in enumerate(player_list):
            models.Gamehall.objects.create(room_num = room_num, role = each['role'], player_num = player_num, player_id =i)        # models.Gamehall.objects.create(room_num = room_num, player_num = player_num) # , time = time.ctime()
        return render(request, 'wolfkill/game.html', {'room_num': room_num, 'player_num': player_num, 'player_list': player_list, 'settings': player_setting})
        # 以上OK
    else:
        player_num = re.search(r'(\d+)', str(models.Gamehall.objects.filter(room_num = room_num).values('player_num'))).group(0)
        temp_objects = models.Gamehall.objects.filter(room_num = room_num).values_list('role', 'player', 'person_id')
        for each in temp_objects:
            player_list.append({'role' : each[0], 'player' : each[1], 'person_id' : each[2]})
        return render(request, 'wolfkill/game.html', {'room_num': room_num, 'player_num': player_num, 'player_list': player_list, 'settings': PLAYER_SETTING[player_num]})

def join_game(requset):

    role = ''
    user_name = requset.POST.get('name')
    room_num = requset.POST.get('room_num')
    person_id = hashlib.sha1(bytes('{}{}'.format(user_name, room_num), encoding = 'utf-8')).hexdigest()    # player_num = models.Gamehall.objects.filter(room_num = room_num).count()
    temp_player_list = models.Gamehall.objects.filter(room_num = room_num).values_list('role', 'player')
    for i, each in enumerate(temp_player_list):
        if each[1] == user_name:
            role = each[0]
            break
        elif each[1] == '还没加入':
            models.Gamehall.objects.filter(room_num = room_num, player_id = i).update(player = user_name, person_id = person_id)
            role = each[0]
            break
    if role == '':
        role = '你可能进错了房间(→_→)，你是手残党吗？'
    user_info = {'role': role, 'room_num': room_num}
    return render(requset, 'wolfkill/play.html', {'user_info': user_info})

    # token = hashlib.sha1(bytes('%s%s' % (os.urandom(16), time.time()), encoding='utf-8')).hexdigest()