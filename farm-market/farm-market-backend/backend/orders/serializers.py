from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'product_price', 'quantity', 
                  'unit', 'seller_name', 'total_price', 'created_at']
        read_only_fields = ['id', 'product_name', 'product_price', 'unit', 'seller_name', 'created_at']
    
    def get_total_price(self, obj):
        return float(obj.total_price)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    total_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'customer_email', 'status', 'total_price', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'customer_name', 'customer_email', 'total_price', 'items', 'created_at', 'updated_at']


class CheckoutItemSerializer(serializers.Serializer):
    """Serializer for items in checkout request."""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout request."""
    items = CheckoutItemSerializer(many=True)
    
    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Cart cannot be empty.")
        return value


class OrderDetailSerializer(serializers.ModelSerializer):
    """Detailed order serializer for single order view."""
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    customer_id = serializers.IntegerField(source='customer.id', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'customer_id', 'customer_name', 'customer_email', 'status', 
                  'total_price', 'items', 'created_at', 'updated_at']
        read_only_fields = fields


class EarningsSerializer(serializers.Serializer):
    """Serializer for seller earnings data."""
    total_earnings = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_orders = serializers.IntegerField()
    total_items_sold = serializers.IntegerField()
    products_sold = serializers.ListField(child=serializers.DictField())
