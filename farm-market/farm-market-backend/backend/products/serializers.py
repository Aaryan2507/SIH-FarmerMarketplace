from rest_framework import serializers
from .models import Product, ProductDemand


class ProductDemandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDemand
        fields = ['id', 'total_ordered', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    sellerName = serializers.CharField(source='seller.username', read_only=True)
    seller_id = serializers.IntegerField(source='seller.id', read_only=True)
    demand = ProductDemandSerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'unit', 'price', 'stock', 
                  'seller_id', 'sellerName', 'image', 'demand', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'seller_id', 'sellerName']


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating products (seller only)."""

    @staticmethod
    def _normalize_category(value):
        normalized = str(value).strip().lower()
        aliases = {
            'vegetables': 'vegetables',
            'vegetable': 'vegetables',
            'fruits': 'fruits',
            'fruit': 'fruits',
            'grains': 'grains',
            'grain': 'grains',
            'dairy': 'dairy',
            'other': 'other',
        }
        if normalized in aliases:
            return aliases[normalized]
        valid_values = {key.lower() for key, _ in Product.CATEGORY_CHOICES}
        if normalized in valid_values:
            return normalized
        raise serializers.ValidationError('Invalid category.')

    @staticmethod
    def _normalize_unit(value):
        normalized = str(value).strip().lower()
        aliases = {
            'kg': 'kg',
            'kilogram': 'kg',
            'kilograms': 'kg',
            'kilo': 'kg',
            'liter': 'liter',
            'litre': 'liter',
            'liters': 'liter',
            'litres': 'liter',
            'dozen': 'dozen',
            'dozens': 'dozen',
            'unit': 'unit',
            'piece': 'unit',
            'pieces': 'unit',
            'bundle': 'bundle',
            'bundles': 'bundle',
            'bunch': 'bundle',
            'bunches': 'bundle',
        }
        if normalized in aliases:
            return aliases[normalized]
        valid_values = {key.lower() for key, _ in Product.UNIT_CHOICES}
        if normalized in valid_values:
            return normalized
        raise serializers.ValidationError('Invalid unit.')

    def to_internal_value(self, data):
        if isinstance(data, dict):
            normalized_data = data.copy()
            if 'category' in normalized_data:
                normalized_data['category'] = self._normalize_category(normalized_data['category'])
            if 'unit' in normalized_data:
                normalized_data['unit'] = self._normalize_unit(normalized_data['unit'])
            data = normalized_data
        return super().to_internal_value(data)
    
    class Meta:
        model = Product
        fields = ['name', 'description', 'category', 'unit', 'price', 'stock', 'image']
