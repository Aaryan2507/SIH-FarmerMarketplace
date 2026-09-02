#!/usr/bin/env python
import requests

response = requests.get('http://127.0.0.1:8000/api/products/')
data = response.json()
print(f"Total products: {data['count']}")
print("\nProducts:")
for p in data['results']:
    print(f"  - {p['name']} ({p['category']}) - ₹{p['price']}/{p['unit']} - Stock: {p['stock']} by {p['sellerName']}")
