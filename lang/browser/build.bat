:; cd `dirname "$0"` || exit $?
:; test -d ./node_modules/parcel-bundler || npm install || exit $?
:; exec ./node_modules/.bin/parcel build --global=jessica ./jessica.mjs
:; exit $?
