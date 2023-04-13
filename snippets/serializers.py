from rest_framework import serializers
from snippets.models import Category, Note, User, LANGUAGE_CHOICES, STYLE_CHOICES


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'user', 'draggedOver', 'name']


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'category', 'created',
                  'favorite', 'lastUpdated', 'text']

    # def create(self, validated_data):
    #     return Note(**validated_data)

    def update(self, instance, validated_data):
        instance.id = validated_data.get('id', instance.id)
        instance.category = validated_data.get('category', instance.category)
        instance.created = validated_data.get('created', instance.created)
        instance.favorite = validated_data.get('favorite', instance.favorite)
        instance.lastUpdated = validated_data.get(
            'lastUpdated', instance.lastUpdated)
        instance.text = validated_data.get('text', instance.text)
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name']
