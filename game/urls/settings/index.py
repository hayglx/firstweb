from django.urls import path,include
from game.views.settings.getinfo import getinfo
from game.views.settings.login import game_login
from game.views.settings.logout import game_logout
from game.views.settings.register import register

urlpatterns=[
    path("getinfo/",getinfo,name="settings_getinfo"),
    path("login/",game_login,name="settings_login"),
    path("logout/",game_logout,name="settings_logout"),
    path("register/",register,name="settings_register"),
]
