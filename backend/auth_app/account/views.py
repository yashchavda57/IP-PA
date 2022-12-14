from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from .models import *
from .serializers import UserSerializer, UserSerializerWithToken, TodoSerializer
from rest_framework.decorators import action


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]
    authentication_classes = []

    def post(self, request):
        data = request.data
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')
        repass = data.get('repass', '')
        messages = {'errors': []}

        if first_name == None:
            messages['errors'].append('first_name can\'t be empty')
        if last_name == None:
            messages['errors'].append('last_name can\'t be empty')
        if email == None:
            messages['errors'].append('Email can\'t be empty')
        if password == None:
            messages['errors'].append('Password can\'t be empty')
        if password != repass:
            messages['errors'].append('Password doen\'t match')
        if CustomUser.objects.filter(email=email).exists():
            messages['errors'].append(
                "Account already exists with this email id.")
        if len(messages['errors']) > 0:
            return Response({"detail": messages['errors']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = CustomUser.objects.create(
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=make_password(password)
            )
            current_site = get_current_site(request)
            mail_subject = 'Activation link has been sent to your email id'
            tokenSerializer = UserSerializerWithToken(user, many=False)

            # Next version will add a HTML template
            message = "Confirm your email {}/api/v1/accounts/confirmation{}/{}/".format(current_site,
                                                                                        tokenSerializer.data['refresh'],
                                                                                        user.id)
            to_email = email
            # send_mail(
            #         mail_subject, message, "youremail@email.com", [to_email]
            # )
            serializer = UserSerializerWithToken(user, many=False)
        except Exception as e:
            print(e)
            return Response({'detail': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data)


from django.http import HttpResponse
import datetime
import jwt
from auth_app import settings


@api_view(['GET'])
def confirmation(request, pk, uid):
    user = CustomUser.objects.get(id=uid)
    token = jwt.decode(pk, settings.SECRET_KEY, algorithms=["HS256"])

    if user.isVerified == False and datetime.datetime.fromtimestamp(token['exp']) > datetime.datetime.now():
        user.isVerified = True
        user.save()
        return HttpResponse('Your account has been activated')

    elif (datetime.datetime.fromtimestamp(token['exp']) < datetime.datetime.now()):

        # For resending confirmation email use send_mail with the following encryption
        # print(jwt.encode({'user_id': user.user.id, 'exp': datetime.datetime.now() + datetime.timedelta(days=1)}, settings.SECRET_KEY, algorithm='HS256'))

        return HttpResponse('Your activation link has been expired')
    else:
        return HttpResponse('Your account has already been activated')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(ReadOnlyModelViewSet):
    throttle_classes = [UserRateThrottle]
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todos.objects.all()
    serializer_class = TodoSerializer

    # def get_queryset(self):
    #     if self.request.query_params['status']=='NEW':
    #         return self.queryset.filter(status='new')
    #     return self.queryset.none()

    @action(detail=False, methods=['post'])
    def update_data(self, *args, **kwargs):
        obj_id = self.request.data.get('id', '')
        if not id:
            return Response("ID Required", status.HTTP_400_BAD_REQUEST)
        todo_obj = self.queryset.get(id=obj_id)
        if self.request.data.get('is_delete', ''):
            todo_obj.is_delete = True
        if self.request.data.get('title', ''):
            todo_obj.title = self.request.data.get('title')
        if self.request.data.get('description', ''):
            todo_obj.description = self.request.data.get('description')
        if self.request.data.get('status', ''):
            todo_obj.status = self.request.data.get('status')
        if self.request.data.get('img', ''):
            todo_obj.img = self.request.data.get('img')

        todo_obj.save()
        return Response("Updated Successfully", status.HTTP_200_OK)