from django.urls import path
from api import views
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static 

urlpatterns = [
    path('item/',views.ItemList.as_view()),
    path('item/<str:pk>',views.getSingleItem, name="getSingleItem"),
    
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/', views.getUserProfile, name='getUserProfile'),
    path('register/', views.registerUser, name='register'),
    
    path('addToCart/', views.addToCart, name = "addToCart"),
    path('getCartItems/<str:pk>', views.getCartItems, name = "getCartItems"),
    path('removeFromCart/', views.removeFromCart, name = "removeFromCart"),
    path('setCartItemQuantity/', views.setCartItemQuantity, name = "setCartItemQuantity"),

    path('makeOrder/', views.makeOrder, name = "makeOrder"),
]
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)