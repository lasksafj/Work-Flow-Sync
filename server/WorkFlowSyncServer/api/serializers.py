from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['email', 'last_name', 'first_name', 'phone_number', 'date_of_birth']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=True)

    class Meta:
        model = User
        fields = ['username', "password", 'profile']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        with transaction.atomic():
            user = User.objects.create_user(
                username=validated_data['username'],
                password=validated_data['password']
            )
            UserProfile.objects.create(user=user, **profile_data)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        # Custom data you want to include
        extra_data = {
            'profile': UserProfileSerializer(self.user.profile).data
        }
        data.update(extra_data)
        return data

# Another way to verify
# class CustomTokenVerifySerializer(TokenVerifySerializer):
#     def validate(self, attrs):
#         # The default result (access/refresh tokens)
#         data = super().validate(attrs)
#         token = attrs['token']
        
#         backend = TokenBackend(algorithm='HS256')
#         token_data = backend.decode(token, verify=False)

#         user = User.objects.get(id=token_data['user_id'])
#         profile = UserSerializer(user).data['profile']
#         # Custom data you want to include
#         extra_data = {
#             'profile': profile
#         }
#         data.update(extra_data)
#         return data