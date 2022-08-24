from django.urls import path
from game.views.settings.acwing.web.apply_code import apply_code as web_appcode
from game.views.settings.acwing.web.receive_code import receive_code as web_reccode
from game.views.settings.acwing.acapp.receive_code import receive_code as aca_reccode
from game.views.settings.acwing.acapp.apply_code import apply_code as aca_appcode


urlpatterns=[
    path("web/apply_code/",web_appcode,name="settings_acwing_apply_code"),
    path("web/receive_code/",web_reccode,name="settings_acwing_receive_code"),
    
    path("acapp/apply_code/",aca_appcode,name="settings_acwing_aca_apply_code"),
    path("acapp/receive_code/",aca_reccode,name="settings_acwing_aca_receive_code"),

    
]
