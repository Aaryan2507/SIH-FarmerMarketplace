from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import Profile


class ProductCreateAPITest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='seller1', password='secret123')
        Profile.objects.create(user=self.user, role='seller')
        self.client = APIClient()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_create_product_accepts_frontend_payload_values(self):
        payload = {
            'name': 'Tomatoes',
            'category': 'Vegetables',
            'unit': 'bunch',
            'price': '35.00',
            'stock': 10,
            'description': 'Fresh and local',
        }

        response = self.client.post('/api/products/', payload, format='json')

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['category'], 'vegetables')
        self.assertEqual(response.data['unit'], 'bundle')
        self.assertEqual(response.data['sellerName'], self.user.username)
