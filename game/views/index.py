from django.shortcuts import render,redirect

def index(request):
    #return redirect("/qiuqiu/")
    return render(request,"multiends/mainweb.html")
def index2(request):
    return render(request,"multiends/web.html")

