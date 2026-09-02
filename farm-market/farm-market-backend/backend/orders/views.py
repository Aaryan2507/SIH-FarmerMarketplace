from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F, Count, Q
from decimal import Decimal

from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    OrderDetailSerializer,
    CheckoutSerializer,
    EarningsSerializer,
)
from products.models import Product, ProductDemand


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Check if user is the owner of the order."""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.customer == request.user
        return obj.customer == request.user


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order operations.
    - Customers can view their own orders
    - Only authenticated users can checkout
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only the current user's orders."""
        return Order.objects.filter(customer=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return OrderDetailSerializer
        return OrderSerializer
    
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """
        Create a new order from cart items.
        Expects: {"items": [{"product_id": 1, "quantity": 2}, ...]}
        """
        serializer = CheckoutSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        items_data = serializer.validated_data['items']
        
        # Validate all products exist and have sufficient stock
        products = {}
        for item in items_data:
            product_id = item['product_id']
            quantity = item['quantity']
            
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response(
                    {'detail': f'Product with id {product_id} not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if product.stock < quantity:
                return Response(
                    {'detail': f'Insufficient stock for {product.name}. Available: {product.stock}, Requested: {quantity}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            products[product_id] = (product, quantity)
        
        # Create order
        order = Order.objects.create(customer=request.user)
        total_price = Decimal('0.00')
        
        # Create order items and update stock
        for product_id, (product, quantity) in products.items():
            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                seller=product.seller,
                product_name=product.name,
                product_price=product.price,
                quantity=quantity,
                unit=product.unit,
            )
            
            total_price += order_item.total_price
            
            # Reduce product stock
            product.stock -= quantity
            product.save()
            
            # Update product demand
            demand, _ = ProductDemand.objects.get_or_create(product=product)
            demand.total_ordered += quantity
            demand.save()
        
        # Update order total
        order.total_price = total_price
        order.status = 'completed'
        order.save()
        
        serializer = OrderDetailSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get all orders for the current customer."""
        orders = Order.objects.filter(customer=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def earnings(self, request):
        """
        Get seller earnings summary.
        Only sellers can access this endpoint.
        """
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'seller':
            return Response(
                {'detail': 'Only sellers can view earnings.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get all order items sold by this seller
        order_items = OrderItem.objects.filter(seller=request.user)
        
        total_earnings = order_items.aggregate(
            total=Sum(F('product_price') * F('quantity'), output_field=models.DecimalField())
        )['total'] or Decimal('0.00')
        
        total_orders = order_items.values('order').distinct().count()
        total_items_sold = order_items.aggregate(Sum('quantity'))['quantity__sum'] or 0
        
        # Get breakdown by product
        products_sold = order_items.values('product_name').annotate(
            quantity=Sum('quantity'),
            revenue=Sum(F('product_price') * F('quantity'), output_field=models.DecimalField())
        ).order_by('-revenue')
        
        products_list = [
            {
                'product_name': item['product_name'],
                'quantity': item['quantity'],
                'revenue': float(item['revenue'] or 0),
            }
            for item in products_sold
        ]
        
        data = {
            'total_earnings': float(total_earnings),
            'total_orders': total_orders,
            'total_items_sold': total_items_sold,
            'products_sold': products_list,
        }
        
        serializer = EarningsSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def seller_sales(self, request):
        """
        Get all orders/sales for the current seller.
        Only sellers can access this endpoint.
        """
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'seller':
            return Response(
                {'detail': 'Only sellers can view sales.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get all orders containing items from this seller
        orders_with_seller_items = Order.objects.filter(
            items__seller=request.user
        ).distinct()
        
        serializer = OrderSerializer(orders_with_seller_items, many=True)
        return Response(serializer.data)


# Import models for annotation
from django.db import models

