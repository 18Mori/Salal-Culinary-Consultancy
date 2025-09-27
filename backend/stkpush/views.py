# from django.shortcuts import render
# import requests
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from datetime import datetime
# from .serializers import *
# from .models import *

# @api_view(['POST'])
# def stk_push(request):
#     serializer = MpesaRequestSerializer(data=request)
#     if serializer.is_valid:
#         mpesa_request = serializer.save()
#         response_data = initiate_stk_push(mpesa_request)
#         mpesa_response = MpesaResponcse.objects.create(
#             request = models.OneToOneField(MpesaRequest, on_delete=models.CASCADE)
#             response_code = models.CharField(max_length=10)
#             response_description = models.TextField()
#             customer_message = models.TextField()
#             merchant_request_id = models.CharField(max_length=100)
#             checkout_request_id = models.CharField(max_length=100)
#             timestamp = models.DateTimeField(auto_now_add=True)
#         )
            
        
#         response_serializer = MpesaRequestSerializer(mpesa_response)
#         return Response(response_serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)