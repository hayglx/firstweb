from django.http import JsonResponse
from django.shortcuts import redirect
import requests
from django.contrib.auth.models import User
from game.models.player.player import Player
from random import randint

def receive_code(request):
    data=request.GET
    if 'errcode' in data:
        return JsonResponse({'result':'applycode_failed',
            'errorcode':data['errcode'],
            'errmsg':data['errmsg'],
        });
    code=data.get('code')
    state=data.get('state')

    apply_access_token_url='https://www.acwing.com/third_party/api/oauth2/access_token/' # 获取令牌
    params={
        'appid':'3157',
        'secret':'40c5c9bf42544643b9f6ee28010c2428',
        'code':code
    }
    access_token_res=requests.get(apply_access_token_url,params=params).json()
    if 'errmsg' in access_token_res:
        return redirect('index')
    access_token=access_token_res['access_token']
    openid=access_token_res['openid']

    players=Player.objects.filter(openid=openid)
    if players.exists():
        player=players[0]
        return JsonResponse({
            'result':'success',
            'username':player.user.username,
            'photo':player.photo,
        })

    get_userinfo_url='https://www.acwing.com/third_party/api/meta/identity/getinfo/' # 获取用户信息
    params={
        'access_token':access_token,
        "openid":openid,
    }
    userinfo_res=requests.get(get_userinfo_url,params=params).json()
    username=userinfo_res['username']
    photo=userinfo_res['photo']

    while User.objects.filter(username=username).exists():
        username+=str(randint(0,9))
    

    user=User.objects.create(username=username)
    player=Player.objects.create(user=user,photo=photo,openid=openid)

    return JsonResponse({
        'result':'success',
        'username':player.user.username,
        'photo':player.photo,
    })   

