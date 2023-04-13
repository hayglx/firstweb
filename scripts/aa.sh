cd ..
sudo redis-server /etc/redis/redis.conf
sudo /etc/init.d/nginx start
uwsgi --ini uwsgi.ini
daphne -b 0.0.0.0 -p 5015 firstweb.asgi:application
~/firstweb/match_system/src/main.py
