from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import CustomTokenObtainPairSerializer, CustomTokenVerifySerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView


# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class VerifyView(TokenVerifyView):
    serializer_class = CustomTokenVerifySerializer

