from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.models import User
from .models import Profile
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    TokenResponseSerializer,
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer to include user and role in token response."""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        user_serializer = UserSerializer(user)
        data['user'] = user_serializer.data
        data['role'] = user.profile.role
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token view that returns user data along with tokens."""
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user with username, email, password, and role."""
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate tokens for the new user
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        user_data = UserSerializer(user).data
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user_data,
            'role': user.profile.role,
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """Get current user profile."""
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

