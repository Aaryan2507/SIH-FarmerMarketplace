#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from products.models import Product, ProductDemand
from accounts.models import Profile

# Create a test seller if doesn't exist
seller, _ = User.objects.get_or_create(
    username='farmer1',
    defaults={'email': 'farmer1@test.com', 'is_staff': False}
)
seller.set_password('farmer123')
seller.save()

# Make sure seller has a profile with role='seller'
profile, _ = Profile.objects.get_or_create(user=seller, defaults={'role': 'seller'})
profile.role = 'seller'
profile.save()

# Create sample products
products_data = [
    {
        'name': 'Tomatoes (Fresh)',
        'category': 'vegetables',
        'unit': 'kg',
        'price': 45,
        'stock': 50,
        'description': 'Fresh red tomatoes, perfect for cooking'
    },
    {
        'name': 'Carrots',
        'category': 'vegetables',
        'unit': 'kg',
        'price': 30,
        'stock': 40,
        'description': 'Organic carrots from our farm'
    },
    {
        'name': 'Onions',
        'category': 'vegetables',
        'unit': 'kg',
        'price': 25,
        'stock': 100,
        'description': 'Yellow onions, sweet and fresh'
    },
    {
        'name': 'Apples',
        'category': 'fruits',
        'unit': 'kg',
        'price': 80,
        'stock': 30,
        'description': 'Crisp red apples'
    },
    {
        'name': 'Bananas',
        'category': 'fruits',
        'unit': 'dozen',
        'price': 60,
        'stock': 25,
        'description': 'Golden yellow bananas, ripe and sweet'
    },
    {
        'name': 'Rice (Basmati)',
        'category': 'grains',
        'unit': 'kg',
        'price': 120,
        'stock': 50,
        'description': 'Premium basmati rice'
    },
]

for prod_data in products_data:
    product, created = Product.objects.get_or_create(
        name=prod_data['name'],
        seller=seller,
        defaults={
            'category': prod_data['category'],
            'unit': prod_data['unit'],
            'price': prod_data['price'],
            'stock': prod_data['stock'],
            'description': prod_data['description'],
        }
    )
    # Create or update demand tracking
    ProductDemand.objects.get_or_create(product=product)
    if created:
        print(f"✓ Created: {product.name}")
    else:
        print(f"✓ Already exists: {product.name}")

print("\nSample products created successfully!")
print(f"Total products: {Product.objects.count()}")
print(f"Seller username: farmer1 | password: farmer123")
