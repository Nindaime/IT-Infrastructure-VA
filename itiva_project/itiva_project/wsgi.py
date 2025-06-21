"""
WSGI config for itiva_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

# ==============================================================================
# itiva_project/itiva_project/wsgi.py and asgi.py
#
# Boilerplate files for deploying your application.
# ==============================================================================

# --- wsgi.py ---
import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'itiva_project.settings')
application = get_wsgi_application()
