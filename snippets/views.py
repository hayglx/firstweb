from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from snippets.models import Category, Note, User
from snippets.serializers import CategorySerializer, NoteSerializer, UserSerializer
from django.shortcuts import render
import hashlib
from django.http import HttpResponse,JsonResponse
MAX_USER_NUM=10
SECRET_KEY=''
with open('/home/kk/firstweb/secret_key','r') as f:
    SECRET_KEY=f.readline()
    print(SECRET_KEY,'***************************')

def hello(request):
    return render(request, template_name='index.html')

@api_view(['GET','POST','DELETE'])
def register(request, format=None):
    if request.method == 'GET':
        category = User.objects.all()
        serializer = UserSerializer(category, many=True)
        return Response(serializer.data)
    if request.method == 'POST':
        data=request.data
        if "password" in data and len(data["password"])>=8:
            md5_obj=hashlib.md5()
            md5_obj.update(data["password"].encode())
            data["password"]=md5_obj.hexdigest()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        data = request.data
        if 'id' in data:
            user =  User.objects.get(pk=data["id"])
            if user:
                user.delete()
                return Response("", status=status.HTTP_201_CREATED)
        return Response("id not exist", status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def login(request, format=None):
    if request.method == 'POST':
        data = request.data
        if 'name' in data and 'password' in data:
            username=data["name"]
            password=data["password"]
            user = User.objects.get(pk=username)
            if user:
                md5_obj=hashlib.md5()
                md5_obj.update(password.encode())
                if user.password == md5_obj.hexdigest():
                    token = ""
                    res=HttpResponse()
                    res.status_code=201
                    res.set_cookie('token',token)
                    print(SECRET_KEY,'***************************22')
                    return res
    return Response('name not exist or wrong password', status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def note_list(request, format=None):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        note = Note.objects.all()
        serializer = NoteSerializer(note, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def usr_list(request, format=None):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def category_list(request, format=None):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        category = Category.objects.all()
        serializer = CategorySerializer(category, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data
        data["user"] = "111"
        serializer = CategorySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE'])
def addnote(request, format=None):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        category = Category.objects.all()
        note = Note.objects.all()
        serializer_category = CategorySerializer(category, many=True)
        serializer_note = NoteSerializer(note, many=True)
        return Response({
            "category": serializer_category.data,
            "note": serializer_note.data,
        })

    elif request.method == 'POST':
        data = request.data

        for category in data["categories"]:
            category["user"] = "111"
            serializer = CategorySerializer(data=category)
            if serializer.is_valid():
                serializer.save()
            else:
                serializer = CategorySerializer(
                    Category.objects.get(pk=category["id"]), data=category)
                if serializer.is_valid():
                    serializer.save()
                    
        for note in data["notes"]:
            if note["category"] == '':
                default = Category.objects.filter(name="default")
                user = User.objects.get(pk="111")
                if (not default):
                    Category.objects.create(
                        id='default',
                        user=user,
                        draggedOver=False,
                        name='default'
                    )
                note["category"] = 'default'

            serializer = NoteSerializer(data=note)
            # serializer.is_valid(raise_exception=True)
            if serializer.is_valid():
                serializer.save()
            else:
                serializer = NoteSerializer(
                    Note.objects.get(pk=note["id"]), data=note)
                if serializer.is_valid():
                    serializer.save()

        

        return Response("", status=status.HTTP_201_CREATED)
    elif request.method == 'DELETE':
        data = request.data
        if 'notes' in data:
            for id in data["notes"]:
                noteobj = Note.objects.filter(id=id)
                noteobj.delete()
        if 'category' in data:
            categoryobj = Category.objects.filter(id=data["category"])
            categoryobj.delete()

        return Response("", status=status.HTTP_201_CREATED)
