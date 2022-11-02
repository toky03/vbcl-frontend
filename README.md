# Helfereinsatz Tool VBC Lyss

Frontend Code fuer Helfereinsatz Tool

Benoetigte Tools für das Lokale Setup
- npm Verion 8
- angular cli Version 14
- Optional Docker

Lokaler Development Server starten: `ng serve`.
Der Frontend ist danach auf http://localhost:4200 erreichbar.

# Projekt bauen
## Docker Image
Command: `docker build -t <image-name> .`
Im [Dockerfile](./Dockerfile) wird in zwei Schritten das Docker Image erstellt. Der erste Schritt erstellt ein Bundle an statischen Dateien. Im zweiten Schritt werden die statischen Dateien in einen Nginx Server gepackt um so ein möglichst schlankes Image ohne Node oder npm Artefakte zu erhalten.

## Native Build
Mit `ng build` werden ein Bundle mit allen statischen Dateien im Ordner dist/frontend-volley erstellt.
