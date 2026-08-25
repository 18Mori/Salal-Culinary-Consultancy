import os
from django.core.wsgi import get_wsgi_application

# Replace 'your_project_folder' with the actual folder name containing settings.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = get_wsgi_application()