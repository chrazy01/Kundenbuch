# Kundenbuch

Eigene Web-App für die Akquise: Kunden, Notizen, Termine, Bilder, Kalender und Tagestour.

- Login und Daten: Google Firebase (Projekt `eier-kundenbuch`)
- Die Kundendaten liegen **nicht** in dieser Ablage, sondern geschützt in Firebase.
- Adresse: https://chrazy01.github.io/Kundenbuch/

## Dateien

| Datei | Inhalt |
| --- | --- |
| `index.html` | Die App |
| `fb.js` | Firebase (Login, Datenbank, Offline-Speicher), gebündelt |
| `sw.js` | Offline-Speicher für die App-Dateien |
| `manifest.webmanifest`, `*.png` | Angaben und Symbole zum Installieren als App |

Bei einer neuen Version: Dateien ersetzen und in `sw.js` die Versionsnummer (`kundenbuch-vN`) erhöhen.
