from django.shortcuts import render
from .models import Item
from .serializers import ItemSerializer
from rest_framework.generics import ListAPIView

# Create your views here.

class ItemList(ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer