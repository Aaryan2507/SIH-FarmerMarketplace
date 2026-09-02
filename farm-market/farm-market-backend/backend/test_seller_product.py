#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from accounts.models import Profile
from products.models import Product
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
import json

# Test 1: Create a test seller
print("\n=== TEST 1: Creating test seller ===")
try:
    user = User.objects.create_user(username='testcreator', password='test123', email='testcreator@test.com')
    profile = Profile.objects.create(user=user, role='seller')
    print(f"✓ Created seller: {user.username}")
except Exception as e:
    print(f"✗ Error: {e}")
    user = User.objects.get(username='testcreator')

# Test 2: Get JWT tokens
print("\n=== TEST 2: Getting JWT tokens ===")
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)
print(f"✓ Generated access token: {access_token[:30]}...")

# Test 3: Create API client and add auth header
print("\n=== TEST 3: Creating product via API ===")
client = APIClient()
client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

payload = {
    'name': 'Test Vegetables',
    'category': 'vegetables',
    'unit': 'kg',
    'price': '35.00',
    'stock': 50,
    'description': 'Fresh test vegetables'
}

print(f"Payload: {json.dumps(payload, indent=2)}")

response = client.post('/api/products/', payload, format='json')
print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

if response.status_code == 201:
    print("✓ Product created successfully!")
    product = response.json()
    print(f"  - Product ID: {product.get('id')}")
    print(f"  - Name: {product.get('name')}")
    print(f"  - Seller: {product.get('sellerName')}")
else:
    print(f"✗ Failed to create product")
    print(f"Errors: {response.json()}")
