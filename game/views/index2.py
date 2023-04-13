from django.shortcuts import render

def index2(request):
    print("this is index2*******************************************")
    return render(request,"multiends/mainweb.html")
