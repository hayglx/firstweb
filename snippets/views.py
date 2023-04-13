from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from snippets.models import Category, Note, User
from snippets.serializers import CategorySerializer, NoteSerializer, UserSerializer
from django.shortcuts import render


def hello(request):
    return render(request, template_name='index.html')


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
                print('note save %%%%%%%****')
                serializer.save()
            else:
                serializer = NoteSerializer(
                    Note.objects.get(pk=note["id"]), data=note)
                if serializer.is_valid():
                    serializer.save()

        for category in data["categories"]:
            category["user"] = "111"
            serializer = CategorySerializer(data=category)
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
