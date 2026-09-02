from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q

from .models import Product, ProductDemand
from .serializers import ProductSerializer, ProductCreateUpdateSerializer


class IsSeller(permissions.BasePermission):
    """Check if user is a seller."""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'profile') and request.user.profile.role == 'seller'


class IsSellerOrReadOnly(permissions.BasePermission):
    """Allow sellers to create/edit, others can only read."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and \
               hasattr(request.user, 'profile') and request.user.profile.role == 'seller'
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.seller == request.user


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product CRUD operations.
    - Anyone can list/retrieve products
    - Only sellers can create/update/delete their own products
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsSellerOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'category', 'seller__username']
    ordering_fields = ['price', 'created_at', 'stock']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save(seller=request.user)
        response_serializer = ProductSerializer(product)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        response_serializer = ProductSerializer(product)
        return Response(response_serializer.data)

    def perform_create(self, serializer):
        """Set seller to current user when creating."""
        serializer.save(seller=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsSeller])
    def my_products(self, request):
        """Get all products for the current seller."""
        products = Product.objects.filter(seller=request.user)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsSeller])
    def update_stock(self, request, pk=None):
        """Update stock for a product (seller only)."""
        product = self.get_object()
        
        if product.seller != request.user:
            return Response(
                {'detail': 'You do not have permission to edit this product.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        stock = request.data.get('stock')
        if stock is None:
            return Response(
                {'detail': 'stock field is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product.stock = int(stock)
            product.save()
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except (ValueError, TypeError):
            return Response(
                {'detail': 'stock must be an integer'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products by name, category, or seller."""
        query = request.query_params.get('q', '').strip()
        category = request.query_params.get('category', '').strip()
        
        products = Product.objects.all()
        
        if query:
            products = products.filter(
                Q(name__icontains=query) |
                Q(seller__username__icontains=query) |
                Q(description__icontains=query)
            )
        
        if category:
            products = products.filter(category=category)
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get list of all available product categories."""
        categories = [choice[0] for choice in Product.CATEGORY_CHOICES]
        return Response({'categories': categories})

