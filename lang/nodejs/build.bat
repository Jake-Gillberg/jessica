:; cd `dirname "$0"` || exit $?
:; rm -rf tsout
:; tsc -p ./tsconfig.app.json --outDir tsout
:; for f in tsout/lang/nodejs/*.js; do test -f "$f" || continue; mv "$f" `echo "$f" | sed -e 's!^.*/\(.*\.mjs\)\.js$!\1!; s!^.*/\(.*\.js\)$!\1!'`; done
:; rm -rf tsout
