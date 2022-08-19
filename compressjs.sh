#! /bin/bash
JSPATH=/home/kk/firstweb/game/static/js/
JSPATH_DIST=${JSPATH}dist/
JSPATH_SRC=${JSPATH}src/
find ${JSPATH_SRC} -type f -name '*.js'
find ${JSPATH_SRC} -type f -name '*.js' | sort | xargs cat > ${JSPATH_DIST}game.js
echo yes | python3 /home/kk/firstweb/manage.py collectstatic
