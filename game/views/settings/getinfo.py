from django.http import JsonResponse
from game.models.player.player import Player

def getinfo_acw(request):
    player=Player.objects.all()[0]
    return JsonResponse({
        'result':'success',
        'username':player.user.username,
        'photo':player.photo,
    })

def getinfo_web(request):
    user=request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result':"未登录",
        })
    else:
        player=Player.objects.all()[0]
        return JsonResponse({
            'result':'success',
            'username':player.user.username,
            'photo':player.photo,
        })


def getinfo(request):
    platform=request.GET.get('platform')
    if platform=='acw':
        return getinfo_acw(request)
    elif platform=='web':
        return getinfo_web(request)
