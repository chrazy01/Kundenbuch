#!/bin/sh
# Baut den Ordner dist/ aus src/: Firebase bündeln, Dateien kopieren.
set -e
cd /tmp/fbcheck
cp /home/claude/webapp/src/fb-entry.js /home/claude/webapp/src/firebase-config.js .
./node_modules/.bin/esbuild fb-entry.js --bundle --minify --format=iife --target=es2020 --outfile=/home/claude/webapp/dist/fb.js --log-level=warning
cd /home/claude/webapp
cp src/index.html src/manifest.webmanifest src/sw.js dist/
cp icons/*.png dist/
echo built
