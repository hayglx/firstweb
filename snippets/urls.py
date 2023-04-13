from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from snippets import views

urlpatterns = [
    path('', views.hello),
    path('note/', views.note_list),
    path('user/', views.usr_list),
    path('category/', views.category_list),
    path('addnote/', views.addnote),

    # path('snippets/<int:pk>/', views.snippet_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
