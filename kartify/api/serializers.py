from rest_framework import serializers
from .models import Item, Cart, Orders, Customer_makes_order, Delivery_Agent, Order_contains_item, Payment
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['item_id','item_name','category','description','item_price','quantity']

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['c_email', 'item_id', 'quantity', 'total_price']

class removeCartSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['c_email', 'item_id']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = ['order_id', 'total_price', 'time']

class CustomerMakesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer_makes_order
        fields = ['c_email', 'order_id']

class OrderContainsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_contains_item
        fields = ['name', 'phone_num', 'd_email', 'order_id']

class DeliveryAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery_Agent
        fields = ['id', 'quantity', 'item_id', 'order_id']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery_Agent
        fields = ['transaction_id', 'platform_charge', 'amount recieved', 'time', 'order_id']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']

class UserSerializerWithToken(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id','username','email','first_name','token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)