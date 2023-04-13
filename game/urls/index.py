from django.urls import path,include
from game.views import index,index2
from django.views.generic import TemplateView

urlpatterns=[
        #path("/",TemplateView.as_view(template_name="web.html")),
       # path("/",index.index,name="index"),
        path("",index.index,name="index"),
        path("qiuqiu/",index.index2,name="index2"),
        path("qiuqiu/menu/",include("game.urls.menu.index")),
        path("qiuqiu/playground/",include("game.urls.playground.index")),
        path("qiuqiu/settings/",include("game.urls.settings.index")),
]
