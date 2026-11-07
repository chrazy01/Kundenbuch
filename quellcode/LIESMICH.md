# Quellcode

- `src/index.html` – die App (wird 1:1 nach oben kopiert)
- `src/fb-entry.js`, `src/firebase-config.js` – Firebase-Anbindung, wird mit esbuild zu `fb.js` gebündelt (Firebase JS SDK 12.x, target es2020, IIFE)
- `build.sh` – baut alles in `dist/`
- Neue Version: Dateien im Hauptordner ersetzen und in `sw.js` die Cache-Version (`kundenbuch-v1`) erhöhen.
- Ordner `test/` = Testversion (https://chrazy01.github.io/Kundenbuch/test/). `quellcode/src/index.html` entspricht immer dem neuesten Stand (ggf. erst in test/ veröffentlicht).
