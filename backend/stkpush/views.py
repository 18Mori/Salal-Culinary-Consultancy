from django.shortcuts import render
from django.shortcuts import render
from .serializers import *
from .models import *
import requests
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime

