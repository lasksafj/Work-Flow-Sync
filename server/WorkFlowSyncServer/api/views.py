from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import CustomTokenObtainPairSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Another way to verify
# class VerifyView(TokenVerifyView):
#     serializer_class = CustomTokenVerifySerializer

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def verify_view(request):
    user = UserSerializer(request.user).data
    return Response(user)

# ----------------------------------------------------------------

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def some_view(request, number):
    # Your view logic here
    user = UserSerializer(request.user).data

    print('user_data', user)
    print('number', number)

    data = {
        'user': user['profile'],
        'number': number
    }

    return Response(data)


