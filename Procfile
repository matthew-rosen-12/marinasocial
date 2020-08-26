release: python3 manage.py migrate

web: python3 manage.py collectstatic --noinput; bin/gunicorn_django --workers=4 --bind=0.0.0.0:$PORT marinasocial/settings.py; gunicorn marinasocial.wsgi --log-file -