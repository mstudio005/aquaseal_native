
AquaSeal

AquaSeal is a self-contained, offline-capable Android app (Capacitor + Chaquopy) for downloading videos, playlists and thumbnails from YouTube and many other platforms. The app bundles an embedded Python runtime and yt-dlp so it can run entirely on-device with no external servers.

## Highlights

- Fully self-contained Android APK (embedded Python + yt-dlp)
- Multi-language UI (English, Urdu, Hindi, Hinglish)
- Downloads page with history, filters, and open/delete actions
- Uses Chaquopy to run Python code on Android and yt-dlp for downloading

This repository contains the full web UI (under `www/`) and the Android project (under `android/`).

## Quick start

Requirements

- Java JDK 21
- Android SDK (platforms + build-tools)
- Node.js + npm (for Capacitor CLI)

Build and install (debug)

```powershell
# from project root
npx cap sync android
cd android
.\gradlew.bat assembleDebug
# Install the generated APK on a device/emulator:
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

Notes

- The app bundles Python via Chaquopy and yt-dlp as a pip dependency. This makes the APK larger but fully self-contained.
- Downloads are saved to the device (Downloads or Pictures folders depending on type).

## Development

- UI files are in `www/` — edit `index.html`, `style.css`, `script.js` and re-run `npx cap sync android`.
- Android plugins are under `android/app/src/main/java/...`.

## Contributing

See `CONTRIBUTING.md` for contribution guidelines.

## License

This project is released under the GNU General Public License v3.0. See `LICENSE`.

## Credits

- Built with Capacitor, Chaquopy and yt-dlp.
