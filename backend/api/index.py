import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# Resolve absolute path to the repository root directory
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent

# Add root directory to sys.path so 'backend' module is importable
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Ensure DJANGO_SETTINGS_MODULE points to where settings.py lives
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Expose 'app' for Vercel Serverless Function engine
app = get_wsgi_application()