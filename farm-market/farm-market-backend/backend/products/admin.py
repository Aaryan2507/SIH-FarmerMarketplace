from django.contrib import admin
from .models import Product, ProductDemand


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'seller', 'category', 'unit', 'price', 'stock', 'created_at')
    list_filter = ('category', 'created_at', 'seller')
    search_fields = ('name', 'seller__username', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Product Info', {'fields': ('name', 'description', 'category', 'unit')}),
        ('Pricing & Stock', {'fields': ('price', 'stock', 'seller')}),
        ('Image', {'fields': ('image',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(ProductDemand)
class ProductDemandAdmin(admin.ModelAdmin):
    list_display = ('product', 'total_ordered', 'updated_at')
    list_filter = ('updated_at',)
    search_fields = ('product__name',)
    readonly_fields = ('updated_at',)

