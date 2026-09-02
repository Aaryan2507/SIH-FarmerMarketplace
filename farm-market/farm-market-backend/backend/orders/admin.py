from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('created_at', 'total_price')
    fields = ('product_name', 'seller', 'quantity', 'product_price', 'unit', 'total_price')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at', 'customer')
    search_fields = ('customer__username', 'customer__email')
    readonly_fields = ('created_at', 'updated_at', 'total_price')
    inlines = [OrderItemInline]
    fieldsets = (
        ('Order Info', {'fields': ('customer', 'status')}),
        ('Pricing', {'fields': ('total_price',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'product_name', 'seller', 'order', 'quantity', 'product_price', 'total_price')
    list_filter = ('created_at', 'seller', 'order__status')
    search_fields = ('product_name', 'seller__username', 'order__id')
    readonly_fields = ('created_at', 'total_price')
    fieldsets = (
        ('Order Item Info', {'fields': ('order', 'product', 'seller')}),
        ('Product Details', {'fields': ('product_name', 'product_price', 'quantity', 'unit')}),
        ('Timestamps', {'fields': ('created_at',), 'classes': ('collapse',)}),
    )

