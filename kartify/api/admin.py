from django.contrib import admin
from .models import Customer, Item

# Register your models here.
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name','address','pincode','c_email','age','phone_num']
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['item_id','item_name','category','description','item_price','quantity']
