from django.urls import path,include
from game.views.settings.getinfo import InfoView
from game.views.settings.register import register
from rest_framework_simplejwt.views import (
        TokenObtainPairView,
        TokenRefreshView,
        )


urlpatterns=[
        path("getinfo/",InfoView.as_view(),name="settings_getinfo"),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        # path("login/",game_login,name="settings_login"),
        # path("logout/",game_logout,name="settings_logout"),
        path("register/",register,name="settings_register"),
        path("acwing/",include("game.urls.settings.acwing.index")),
        ]
