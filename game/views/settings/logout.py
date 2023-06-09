from django.contrib.auth import logout
from django.http import JsonResponse

def game_logout(request):
    user=request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result':'failed',
        })
    logout(request)
    return JsonResponse({
        'result':'success',
    })
