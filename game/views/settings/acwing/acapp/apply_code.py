from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache
def get_state():
    ret=""
    for i in range(8):
        ret+=str(randint(0,9))
    return ret
def apply_code(request):
    appid='3157'
    redirect_uri=quote("http://47.122.18.152/settings/acwing/acapp/receive_code/")
    scope="userinfo"
    state=get_state()

    cache.set(state,True,7200)
    return JsonResponse({
        'result':'success',
        'appid':appid,
        'redirect_uri':redirect_uri,
        'scope':scope,
        'state':state,
    })

