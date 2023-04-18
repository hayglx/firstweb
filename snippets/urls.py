from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from snippets import views

urlpatterns = [
    path('', views.hello),
    path('register/', views.register),#register
    path('login/', views.login),#login
    path('note/', views.note_list),#get note list
    path('user/', views.usr_list),#get user list
    path('category/', views.category_list),#get category list
    path('addnote/', views.addnote),#update note and category

    # path('snippets/<int:pk>/', views.snippet_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
