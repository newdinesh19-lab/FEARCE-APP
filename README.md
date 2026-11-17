# FEARCE: installable package

FEARCE (Focused Education in Anaesthesia, Revision & Clinical Excellence). Face Your Fears. Study Fierce.

This folder is a static web app. It needs no build step and no server code.

## Files
- `index.html`: the whole app (single file).
- `manifest.webmanifest`: name, colours, icons, standalone mode.
- `sw.js`: service worker (offline cache, update detection).
- `offline.html`: shown only if the app was never saved on this device and there is no connection.
- `icons/`: 192, 512, maskable 512, Apple touch icon, SVG source.
- `pwa.js`: registers the service worker (already inlined in `index.html`).

## Test it on your computer
1. Open a terminal in this folder and run `python3 -m http.server 8000`.
2. Open `http://localhost:8000` in Chrome or Edge. `localhost` counts as secure, so install and offline work.
3. Chrome DevTools > Application > Manifest should show no errors.

## Put it online (needed for your phone)
Installation needs **HTTPS**. Any static host works: GitHub Pages, Netlify, Cloudflare Pages, Firebase Hosting.
- Upload all files keeping the `icons/` folder.
- Open the HTTPS address once while online, so the files are saved.

## Install on a phone or computer
- **Android Chrome:** menu (three dots) > Install app (or Add to Home screen).
- **iPhone or iPad (Safari):** Share > Add to Home Screen.
- **Desktop Chrome or Edge:** install icon at the right of the address bar.
- Inside FEARCE: Study > Data and Backup > Install and offline shows the real install button when your browser offers it, and a Download for Offline button.

## Releasing an update
1. Replace `index.html` with the new version.
2. Change `VERSION` in `sw.js` (for example `fearce-1.0.1`).
3. Upload. Installed copies detect the new worker and show "New version available" with an Update now button. It never appears during a flashcard review, a study session or an open dialog.

## Your data
Study data lives in the browser's local storage on each device, with an automatic second copy in IndexedDB. There is no cloud sync. Use Study > Data and Backup > Download backup to move data between devices. Clearing site data erases it, so keep a backup file.

## Limits
- iPhone Safari may delete site data after weeks of non-use if the app is not added to the Home Screen.
- Installation cannot be offered inside Claude's artifact viewer or a file opened from disk.

## GitHub Pages under a repository subpath (for example /FEARCE/)
All paths are relative (`./`, `icons/...`, `sw.js`), so the app works at `https://USER.github.io/FEARCE/` without changes.
1. Put every file in this folder in the repository root (or `/docs`), keep `icons/`, and keep the empty `.nojekyll` file.
2. Settings > Pages > deploy from the branch and folder.
3. Open the Pages address once while online. Updates: replace the files and raise `VERSION` in `sw.js`; open copies update on the next launch, and saved study data is never touched (the service worker only caches files, it does not read or clear localStorage or IndexedDB).

## v1.9.6 install fix (https://newdinesh19-lab.github.io/FEARCE-APP/)
- Cause found: in `index.html` the `<link rel="manifest">`, theme-colour and icon tags sat inside `<body>`. Chrome only reads the manifest link from `<head>`, so it saw "no manifest" and could not install. They are now in `<head>`; nothing else in the page changed.
- Manifest `id` is now the stable `/FEARCE-APP/` (before, `./` resolved to the site root). `start_url` `./index.html` and `scope` `./` resolve to `/FEARCE-APP/`.
- Theme colour in the page now matches the manifest (`#4F7F58`). Removed `orientation` and `categories`.
- `sw.js` version is `fearce-1.9.6`; old caches are deleted on activation. Study data in localStorage/IndexedDB is untouched.
- `install-check.html`: open `https://newdinesh19-lab.github.io/FEARCE-APP/install-check.html` in Android Chrome. It lists what passes or fails on the phone and has an Install button when Chrome allows it.
- Upload every file again, keep the `icons` folder and `.nojekyll`. After deploying, in Chrome open the page once, close all FEARCE tabs, reopen, then menu (three dots) > Install app. If an old FEARCE shortcut exists on the home screen, remove it first.
