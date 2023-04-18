from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted([(item, item) for item in get_all_styles()])


class User(models.Model):
    id = models.CharField(max_length=200, primary_key=True)
    name = models.CharField(max_length=100, blank=True, default='')
    password = models.CharField(max_length=100, blank=True, default='')
    class Meta:
        ordering = ['id']


class Category(models.Model):
    id = models.CharField(max_length=200, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    draggedOver = models.BooleanField(default=False)
    name = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        ordering = ['name']


class Note(models.Model):
    id = models.CharField(max_length=200, primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created = models.CharField(max_length=200, blank=True, default='')
    favorite = models.BooleanField(default=False)
    lastUpdated = models.CharField(max_length=200, blank=True, default='')
    text = models.CharField(max_length=100000, blank=True, default='')

    class Meta:
        ordering = ['created']
