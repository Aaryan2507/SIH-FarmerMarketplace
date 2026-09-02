from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('grains', 'Grains'),
        ('dairy', 'Dairy'),
        ('other', 'Other'),
    ]
    
    UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('liter', 'Liter'),
        ('dozen', 'Dozen'),
        ('unit', 'Unit'),
        ('bundle', 'Bundle'),
    ]
    
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} by {self.seller.username}"


class ProductDemand(models.Model):
    """Track demand for products to help sellers see what customers want."""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='demand')
    total_ordered = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Demand for {self.product.name}: {self.total_ordered} units"

