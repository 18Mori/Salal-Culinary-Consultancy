import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# 1. Add project directory to Python path if settings live in a subfolder
# Useful if your Django project is inside a directory like 'backend/'
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

# 2. Point to your Django settings module
# Format: 'your_django_project_name.settings'
# Change 'salal' to the directory containing your settings.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# 3. Create WSGI application
app = get_wsgi_application()

# 4. Map 'app' to 'handler' for Vercel Serverless Function compatibility
handler = app