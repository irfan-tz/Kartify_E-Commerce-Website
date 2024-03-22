from django.db import models

# Create your models here.

class Customer(models.Model):
    name = models.CharField(max_length=50)
    age = models.IntegerField()
    c_email = models.EmailField(max_length=50, primary_key=True)
    address = models.CharField(max_length=127)
    password = models.CharField(max_length=50)
    pincode = models.CharField(max_length = 6)
    phone_num = models.CharField(max_length=10)

class Seller(models.Model):
    s_email = models.EmailField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=127)
    phone_num = models.CharField(max_length=10)

class Orders(models.Model):
    order_id = models.CharField(max_length=7, primary_key=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    time = models.DateTimeField()

class Item(models.Model):
    item_id = models.CharField(max_length=7, primary_key=True)
    item_name = models.CharField(max_length=31)
    item_price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=31)
    description = models.TextField()
    quantity = models.IntegerField()
    s_email = models.ForeignKey(Seller, on_delete=models.CASCADE)

class Cart(models.Model):
    c_email = models.ForeignKey(Customer, on_delete=models.CASCADE)
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

class Delivery_Agent(models.Model):
    name = models.CharField(max_length=50)
    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE)
    phone_num = models.CharField(max_length=10)
    d_email = models.EmailField(max_length=50, primary_key=True)

class Payment(models.Model):
    transaction_id = models.CharField(max_length=15, primary_key=True)
    platform_charge = models.DecimalField(max_digits=10, decimal_places=2)
    amount_received = models.DecimalField(max_digits=10, decimal_places=2)
    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE)
    time = models.DateTimeField()

class Customer_makes_order(models.Model):
    c_email = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE)

class Order_contains_item(models.Model):
    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE)
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()