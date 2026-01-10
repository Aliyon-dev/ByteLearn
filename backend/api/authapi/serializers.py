from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=Profile.USER_ROLES, default='student')
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'role', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        role = validated_data.pop('role')
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)

        # Profile might be created by signals in some setups, but here we do it explicitly if it doesn't exist
        # Check if profile already exists (e.g. from signal)
        if not hasattr(user, 'profile'):
             Profile.objects.create(user=user, role=role)
        else:
             user.profile.role = role
             user.profile.save()

        return user
