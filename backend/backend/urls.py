from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from salal.views import User
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'salal-api'})

urlpatterns = [
    path('', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("salal.urls")),
    # path('mpesa/', include('stkpush.urls')),
]
