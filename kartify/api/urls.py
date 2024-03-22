from django.urls import path
from api import views

urlpatterns = [
    path('item/',views.ItemList.as_view()),
]