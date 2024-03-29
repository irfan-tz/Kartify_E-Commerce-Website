from django.shortcuts import render,  get_object_or_404
from django.contrib.auth.models import User
from django.db import models
from .models import Item, Cart, Orders, Order_contains_item, Customer_makes_order, Delivery_Agent, Payment, Customer
from .serializers import CustomerMakesOrderSerializer, Order_contains_item, Delivery_Agent, PaymentSerializer, DeliveryAgentSerializer, OrderSerializer, removeCartSerialzer, CartSerializer, ItemSerializer, UserSerializer, UserSerializerWithToken
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.utils import timezone

from django.utils.encoding import force_str

# for sending mails and generate token
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from .utils import TokenGenerator,generate_token
from django.utils.encoding import force_bytes,force_text,DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View
import random
import decimal

# Create your views here.

class ItemList(ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

@api_view(['GET'])
def getSingleItem(request, pk):
    singleItem = Item.objects.get(item_id=pk)
    serializer_class = ItemSerializer(singleItem, many = False)
    return Response(serializer_class.data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        return token
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k] = v
        return data 
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getUserProfile(request):
    user=request.user
    serializer = UserSerializer(user, many = False)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data=request.data
    try:
        user= User.objects.create(first_name=data['fname'],username=data['email'],email=data['email'],password=make_password(data['password']))
      
        '''
        # generate token for sending mail
        email_subject="Activate Your Account"
        message=render_to_string(
            "activate.html",
           {
            'user':user,
            'domain':'127.0.0.1:8000',
            'uid':urlsafe_base64_encode(force_bytes(user.pk)),
            'token':generate_token.make_token(user)
           }

        )
        print(message)
        email_message=EmailMessage(email_subject,message,settings.EMAIL_HOST_USER,[data['email']])
        email_message.send()
        '''
        serialize=UserSerializerWithToken(user,many=False)
        return Response(serialize.data)
    except Exception as e:
        message={'error' : str(e)}
        print(e)
        return Response(message,status=status.HTTP_400_BAD_REQUEST)


class ActivateAccountView(View):
    def get(self,request,uidb64,token):
        try:
            uid=force_text(urlsafe_base64_decode(uidb64))
            user=User.objects.get(pk=uid)
        except Exception as identifier:
            user=None
        if user is not None and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            return render(request, "activateSuccessful.html")  # Correct status code
        else:
            return render(request,"activationFailed.html")  # Informative error status
        

@api_view(['POST'])
def addToCart(request):
    try:
        # Get the data from the request
        c_email = request.data.get('c_email')
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))  # Default quantity to 1 if not provided

        # Check if the cart item already exists
        cart_item = Cart.objects.get(c_email=c_email, item_id=item_id)
        
        # If the cart item exists, update the quantity
        cart_item.quantity += quantity
        cart_item.save()

        # Serialize the updated cart item
        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=200)
    except Cart.DoesNotExist:
        # If the cart item does not exist, create a new one
        serializer = CartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def getCartItems(request, pk):
    items = Cart.objects.filter(c_email=pk)
    serializer_class = CartSerializer(items, many = True)
    return Response(serializer_class.data)

@api_view(['POST'])
def setCartItemQuantity(request):
    try:
        # Get the data from the request
        c_email = request.data.get('c_email')
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')

        # Check if the cart item already exists
        cart_item = Cart.objects.get(c_email=c_email, item_id=item_id)
        
        # If the cart item exists, update the quantity
        cart_item.quantity = quantity
        cart_item.save()

        # Serialize the updated cart item
        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=200)
    except Cart.DoesNotExist:
        return Response({"error": "Cart item not found."}, status=404)


@api_view(['POST'])
def removeFromCart(request):
    serializer = removeCartSerialzer(data=request.data) 
    if serializer.is_valid():
        try:
            cart_item = Cart.objects.get(c_email=serializer.data['c_email'], item_id=serializer.data['item_id'])
            cart_item.delete()
            return Response({"message": "Item removed from cart successfully."}, status=200)
        except Cart.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=404)
    else:
        return Response(serializer.errors, status=400)
        
def generate_order_id():
    max_order_id = Orders.objects.aggregate(max_order_id=models.Max('order_id'))['max_order_id']

    if max_order_id:
        new_order_id = str(int(max_order_id) + 1).zfill(7)
    else:
        new_order_id = '0000001'

    return new_order_id

def generate_transaction_id():
    max_transaction_id = Payment.objects.aggregate(max_transaction_id=models.Max('transaction_id'))['max_transaction_id']

    if max_transaction_id:
        new_transaction_id = str(int(max_transaction_id) + 1).zfill(15)
    else:
        new_transaction_id = 1

    return new_transaction_id

def generate_delivery_agent_phone_num():
    phone_num = ''
    phones = ['9632587041', '7896541230']
    for i in range (10):
        phone_num += phones[random.choice([0, 1])][i]
    return phone_num

@api_view(['POST'])
def makeOrder(request):
    
    c_email = request.data.get('c_email')
    items = request.data.get('items')
    total_price = round(decimal.Decimal(request.data.get('total_price')), 2)
    address = request.data.get('address')
    age = request.data.get('age')
    pincode = request.data.get('pincode')
    phone_num = request.data.get('phone_num')
    order_id=generate_order_id()

    try:
        for item in items:
            item_id = item.get('item_id')
            quantity = item.get('quantity')
            item_instance = Item.objects.get(item_id=item_id)

            if (item_instance.quantity < quantity):
                return Response({'error': 'Item quantity demanded is more than our available stock.'}, status=status.HTTP_400_BAD_REQUEST)

        order = Orders.objects.create(
            order_id = order_id,
            time=timezone.now(),
            total_price=total_price
        )

        for item in items:
            item_id = item.get('item_id')
            quantity = item.get('quantity')

            # Fetch the Item instance based on the item_id string
            item_instance = Item.objects.get(item_id=item_id)

            item_instance.quantity -= quantity
            item_instance.save()
            
            # Create the Order_contains_item object using the Item instance
            order_contains_item = Order_contains_item.objects.create(
                item_id=item_instance,
                order_id=order,
                quantity=quantity
            )

        customer = get_object_or_404(Customer, c_email=c_email)

        if address:
            customer.address = address
        if age:
            customer.age = age
        if pincode:
            customer.pincode = pincode
        if phone_num:
            customer.phone_num = phone_num

        customer.save()



        customMakesOrder = Customer_makes_order.objects.create(
            c_email = customer,
            order_id=order, 
        )

        delivery_agent_names = ['blue dart', 'ekart']
        delivery_agent_emails = ['logistics@bluedart.com', 'logistics@ekart.com']
        rand = random.choice([0, 1])
        deliveryAgent = Delivery_Agent.objects.create(
            name = delivery_agent_names[rand],
            phone_num = generate_delivery_agent_phone_num(),
            d_email = delivery_agent_emails[rand],
            order_id=order, 
        )  

        # We are taking 1% as platform charge
        payment = Payment.objects.create(
            transaction_id = generate_transaction_id(),
            platform_charge =  0.02,
            amount_received = round(decimal.Decimal(total_price * decimal.Decimal('1.01')), 2),
            time = timezone.now(),
            order_id=order
        )

        response_data = {
            'order_id': order_id
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
