from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
import requests
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import base64
import json
import logging
logger = logging.getLogger(__name__)


# Helpe to Generate access token
def get_access_token():
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    
    r = requests.get(api_url, auth=(consumer_key, consumer_secret))
    return r.json().get('access_token')

# Helpers to Generate password (timestamp + shortcode + passkey)
def generate_password():
    shortcode = settings.MPESA_SHORTCODE
    passkey = settings.MPESA_PASSKEY
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    data_to_encode = shortcode + passkey + timestamp
    return base64.b64encode(data_to_encode.encode()).decode('utf-8'), timestamp

# Test view
def test_view(request):
    return JsonResponse({"message": "STK Push App is running!"})

# Main STK Push view
@csrf_exempt
def stk_push(request):
    if request.method == "POST":
        data = json.loads(request.body)
    
        phone = data.get('phone')
        amount = data.get('amount')
        account_ref = data.get('account_reference', 'Test Payment')
        desc = data.get('transaction_desc', 'Payment for services')

        # Validate input
        if not phone or not amount:
            return JsonResponse({"error": "Phone and amount required"}, status=400)

        # Format phone (assume 07... -> 2547...)
        if phone.startswith('0'):
            phone = '254' + phone[1:]

        # Get token and password
        access_token = get_access_token()
        password, timestamp = generate_password()

        # Prepare STK Push payload
        stk_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "BusinessShortCode": settings.MPESA_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": settings.MPESA_SHORTCODE,
            "PhoneNumber": phone,
            "CallBackURL": settings.MPESA_CALLBACK_URL,
            "AccountReference": account_ref,
            "TransactionDesc": desc
        }

        # Send request to Daraja
        response = requests.post(stk_url, json=payload, headers=headers)

        # Save to DB (optional)
        mpesa_request = MpesaRequest.objects.create(
            phone_number=phone,
            amount=amount,
            account_reference=account_ref,
            transaction_desc=desc
        )

        if response.status_code == 200:
            result = response.json()
            mpesa_request.checkout_request_id = result.get('CheckoutRequestID')
            mpesa_request.save()

            return JsonResponse({
                "message": "STK Push Sent!",
                "CheckoutRequestID": result.get('CheckoutRequestID'),
                "ResponseCode": result.get('ResponseCode')
            })
        else:
            return JsonResponse({"error": "Failed to send STK Push", "details": response.json()}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)

# Callback URL (Daraja will POST here after user action)
@csrf_exempt
def mpesa_callback(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        # Extract important fields from callback
        result_code = data['Body']['stkCallback']['ResultCode']
        result_desc = data['Body']['stkCallback']['ResultDesc']
        checkout_id = data['Body']['stkCallback']['CheckoutRequestID']
        merchant_id = data['Body']['stkCallback'].get('MerchantRequestID', '')

        # Find associated request
        try:
            mpesa_request = MpesaRequest.objects.get(checkout_request_id=checkout_id)
            MpesaResponse.objects.create(
                request=mpesa_request,
                response_code=result_code,
                response_description=result_desc,
                customer_message=result_desc,
                merchant_request_id=merchant_id,
                checkout_request_id=checkout_id
            )
        except MpesaRequest.DoesNotExist:
            pass  # Log this error for debugging

        # Acknowledge callback
        return JsonResponse({"ResultCode": 0, "ResultDesc": "Success"})

    return JsonResponse({"error": "Invalid request"}, status=400)


class ClientDashboardView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        if not user.last_login_at:
            user.last_login_at = timezone.now()
            user.save(update_fields=['last_login_at'])
            
            # Fetch all required data
        stats = self._get_dashboard_stats(user)
        upcoming_consultations = self._get_upcoming_consultations(user)
        
        # Serialize
        stats_data = stats
        
        return Response({
                'stats': stats_data,
                'upcoming_consultations': BookingSerializer(upcoming_consultations, many=True).data,
            })
        
class BookingView(APIView):
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        user = request.user
        bookings = Booking.objects.filter(client=user).order_by('-date', '-time')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @api_view(['POST'])
    @permission_classes([IsAuthenticated])
    def post(self, request):
        user = request.user
        data = request.data.copy()
        data['client'] = user.id
        
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, client=request.user)
            booking.delete()
            return Response({"message": "Booking deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found or access denied"}, status=status.HTTP_404_NOT_FOUND)
        


class LoginView(APIView):
    permission_classes = []
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'username': 'Username is required', 'password': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user = authenticate(request, username=username, password=password)
        if not user:
            return Response(
                {'non_field_errors': ['Invalid username or password.']}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        if not user.is_active:
            return Response(
                {'non_field_errors': ['This account is inactive.']}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'password': user.password,
            }
        }, status=status.HTTP_200_OK)
        
        
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'firstname': user.first_name,
                    'lastname': user.last_name,
                    'email': user.email,
                    'username': user.username,
                    'password': user.password,
                }
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
