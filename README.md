# Plumb Line

Posture and range-of-motion screening for the clinic iPad.

**Open it:** https://iamlearningaboutai.github.io/plumb-line/

On the iPad, open that link in Safari, tap Share, then **Add to Home Screen**. It then opens full screen from its own icon and works without internet once it has been opened.

## Privacy

This repository holds only the app's code. Patients, photos and results are stored on each device (in the browser's on-device storage) and are never sent anywhere. Use **Settings → Save backup file** regularly, and keep the backup somewhere safe (e.g. iCloud Drive).

## What's in here

- `index.html` – the whole app
- `sw.js`, `manifest.webmanifest`, `icons/` – make it installable and work offline
- `mp/` – MediaPipe Pose model and runtime (Apache 2.0) for automatic landmark detection, run on the device
- `vendor/jspdf.umd.min.js` – jsPDF (MIT) for PDF reports

Readings are screening estimates from photographs, not a diagnosis.
