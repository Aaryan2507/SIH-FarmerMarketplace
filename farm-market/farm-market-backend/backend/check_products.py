#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product
from django.contrib.auth.models import User

print("\n=== All Products in Database ===")
products = Product.objects.all()
print(f"Total products: {products.count()}\n")

for p in products:
    print(f"ID: {p.id}")
    print(f"  Name: {p.name}")
    print(f"  Seller: {p.seller.username}")
    print(f"  Category: {p.category}")
    print(f"  Unit: {p.unit}")
    print(f"  Price: ₹{p.price}")
    print(f"  Stock: {p.stock}")
    print(f"  Created: {p.created_at}")
    print()

print("\n=== All Sellers ===")
sellers = User.objects.filter(profile__role='seller')
for seller in sellers:
    products_count = seller.products.count()
    print(f"{seller.username}: {products_count} products")
