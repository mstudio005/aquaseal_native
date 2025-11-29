# AquaSeal

> A fully offline, multilingual media downloader that ships with its own Python 3.12 + yt-dlp runtime inside a Capacitor-powered Android app.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Android-green.svg)](android/)
[![Built with Capacitor](https://img.shields.io/badge/made%20with-Capacitor-119EFF.svg)](https://capacitorjs.com/)
[![Chaquopy Python](https://img.shields.io/badge/python-Chaquopy%203.12-yellow.svg)](https://chaquo.com/chaquopy/)
[![Download APK](https://img.shields.io/github/v/release/mstudio005/aquaseal_native?label=Download%20APK&color=brightgreen)](https://github.com/mstudio005/aquaseal_native/releases/latest)
[![Get it on Itch.io](https://static.itch.io/images/badge-color.svg)](https://mstudio005.itch.io/aquaseal)

AquaSeal brings together a modern glassmorphism UI, multi-language strings (English, Urdu, Hindi, Hinglish) and an embedded Chaquopy environment so that the app never calls out to remote servers. The APK contains yt-dlp, Python modules, UI assets, and native bridges—install and download immediately, even in airplane mode.

> 📚 Looking for deeper docs? Check out [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/LOCALIZATION.md`](docs/LOCALIZATION.md).

---

## Table of contents

1. [Feature tour](#feature-tour)
2. [Project status](#project-status)
3. [Architecture](#architecture)
4. [Tech stack](#tech-stack)
5. [Quick start](#quick-start)
6. [Development workflow](#development-workflow)
7. [Localization guide](#localization-guide)
8. [Downloads & storage](#downloads--storage)
9. [Native bridges](#native-bridges)
10. [Release automation](#release-automation)
11. [Security & privacy](#security--privacy)
12. [Roadmap](#roadmap)
13. [Support](#support)
14. [Contributing](#contributing)
15. [License](#license)

---

## Feature tour

| Category | Highlights |
| --- | --- |
| 🎯 Downloads | Videos, playlists, audio-only, thumbnails—powered by yt-dlp with format and quality selectors. |
| 🗂️ Downloads hub | Rich history list with type/status badges, filters, open-in-app, share/open-with, and one-tap delete/clear. |
| 🔌 Offline-first | Bundled Python 3.12 runtime + yt-dlp + FFmpeg (via Chaquopy) keeps everything on-device. |
| 🌐 Multi-language | Runtime language switcher covering English, Urdu, Hindi, Hinglish; extend via JSON dictionaries. |
| ☁️ Zero backend | No API keys, no servers, no analytics—ideal for constrained or privacy-conscious environments. |
| 📱 Native polish | Toast notifications, confirm dialogs, Android FileProvider integration, custom Capacitor plugins. |

Screenshots and promo assets live in the `docs/` directory—drop new captures into `docs/media/` and link them here.

## Project status

| Area | Status |
| --- | --- |
| Android debug build | ✅ `android/app/build/outputs/apk/debug/app-debug.apk` (~47 MB) |
| Embedded runtime | ✅ Chaquopy packaging Python 3.12 + yt-dlp |
| Release automation | ✅ GitHub Action builds APK + attaches to tagged releases |
| iOS / Desktop | ⏳ Planned (Capacitor web assets shared, but no native shell yet) |

## Architecture

```
┌────────────┐      ┌─────────────────────┐      ┌────────────────────────────┐
│   UI (www) │ ───► │ Capacitor Bridge    │ ───► │ Native Android (Java/Kotlin) │
│ HTML/CSS/JS│ ◄─── │ Plugins + WebView   │ ◄─── │  + Chaquopy Python runtime   │
└────────────┘      └─────────────────────┘      └────────────────────────────┘
																														│
																														▼
																									yt-dlp + python modules
```

- **UI Shell**: Single-page app under `www/` handles navigation, i18n, download queue, and history persistence (localStorage).
- **Capacitor runtime**: Wraps the web app inside an Android WebView and exposes native capabilities through plugins.
- **Custom plugins**:
	- `PythonBridgePlugin` executes Chaquopy scripts (`android/app/src/main/python`).
	- `FileOpenerPlugin` opens downloaded files/URLs with Android intents & FileProvider.
- **Storage**: Files land in device `Downloads/` or `Pictures/` so the system gallery can pick them up immediately.

Deep dive documents:
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): build graph, packaging tips, size considerations.
- [`docs/LOCALIZATION.md`](docs/LOCALIZATION.md): how translations map to UI keys.

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | Vanilla JS, CSS (glassmorphism), HTML, localStorage |
| Native shell | Capacitor 7, Android SDK 35, Kotlin-compatible Java |
| Python runtime | Chaquopy 16.x shipping Python 3.12, yt-dlp, FFmpeg dependencies |
| Tooling | Node.js 20+, Gradle 8, Java 21, GitHub Actions (release automation) |

## Quick start

### Prerequisites

- Node.js 20+ and npm
- Java JDK 21 (Temurin recommended)
- Android SDK with platform `android-35` and `build-tools;35.0.0`
- USB debugging device or emulator

### Clone & install

```powershell
git clone https://github.com/mstudio005/aquaseal_native.git
cd aquaseal_native
npm install
npx cap sync android
```

### Build (debug)

```powershell
cd android
.\gradlew.bat assembleDebug
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

### Optional: Release build

```powershell
# Supply your own keystore + signing config in android/app/build.gradle
cd android
.\gradlew.bat assembleRelease
```

Chaquopy takes care of installing bundled Python wheels during `gradlew`—first build may take a few minutes.

## Development workflow

1. **Edit web assets** (`www/index.html`, `www/style.css`, `www/script.js`).
2. **Sync** web changes into Android assets: `npx cap sync android`.
3. **Run / debug** from Android Studio or `cd android && ./gradlew assembleDebug` + `adb install`.
4. **Python changes** live under `android/app/src/main/python`; no extra packaging needed because Chaquopy bundles them.
5. **Testing downloads**: use the built-in Downloads page filters plus the toast logger for quick feedback.

Tip: `www/script.js` contains helper methods such as `addToDownloadsHistory`, `showToast`, and plugin calls—start there when adding UI states.

## Localization guide

- Language dictionaries live alongside the UI JS bundle; see `docs/LOCALIZATION.md` for structure and JSON keys.
- Add new languages by extending the `SUPPORTED_LANGUAGES` map and supplying translated strings for each UI label.
- Switch languages at runtime without reloading—the selection persists via localStorage.

## Downloads & storage

- Video/audio outputs go to the device `Downloads/` directory.
- Thumbnails default to `Pictures/AquaSeal/` for quick gallery previews.
- Each entry in history stores the `id`, original URL, format info, and filesystem path so the FileOpener plugin can invoke the correct Android intent.

## Native bridges

| Plugin | Path | Purpose |
| --- | --- | --- |
| `PythonBridgePlugin` | `android/app/src/main/java/com/mutaibstudio/aquaseal/PythonBridgePlugin.java` | Runs Chaquopy scripts for download logic. |
| `FileOpenerPlugin` | `android/app/src/main/java/com/mutaibstudio/aquaseal/FileOpenerPlugin.java` | Safely opens files/URLs via FileProvider + intents. |

When adding new native functionality, register the plugin inside `MainActivity.java` and sync via `npx cap sync`.

## Release automation

Pushing a tag like `v1.0.0` triggers `.github/workflows/release.yml`, which:

1. Installs Node, Capacitor deps, and syncs the Android project.
2. Sets up Java 21 + Android SDK (API 35, Build Tools 35.0.0).
3. Builds the debug APK via `./gradlew assembleDebug` on Ubuntu.
4. Uploads the APK both as a workflow artifact and as the GitHub Release asset via `softprops/action-gh-release`.

Customize the workflow to sign release builds by injecting keystore secrets and switching to `assembleRelease`. See [`RELEASE.md`](RELEASE.md) for manual steps.

## Security & privacy

- No analytics, tracking, or network calls beyond the media sources yt-dlp accesses.
- See [`SECURITY.md`](SECURITY.md) for responsible disclosure instructions.
- All contributions inherit the GPL-3.0-or-later license (see [`CONTRIBUTING.md`](CONTRIBUTING.md)).

## Roadmap

- [ ] Option to export download history to JSON/CSV.
- [ ] Parallel downloads with prioritization.
- [ ] In-app media player for offline preview.
- [ ] iOS + desktop wrappers (Capacitor, Electron).
- [ ] Automatic update notifications and delta patches.

Track roadmap discussions via GitHub issues using the provided templates.

## Support

- Bugs & feature requests: open an issue using `.github/ISSUE_TEMPLATE`. 
- Security reports: follow [`SECURITY.md`](SECURITY.md).
- General help: see [`SUPPORT.md`](SUPPORT.md) for FAQs and contact options.

## Contributing

Pull requests are welcome! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and abide by the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## License

GPL-3.0-or-later. See [`LICENSE`](LICENSE) for the full text.

## Acknowledgements

- Capacitor community and plugins
- Chaquopy + yt-dlp maintainers
- Early testers who pushed for offline capability and localization ❤️
- Built with Capacitor, Chaquopy and yt-dlp.

## Installation

## 📱 Android (APK)

To install AquaSeal on an Android device:

1. Download the latest AquaSeal APK from
👉 GitHub Releases or Itch.io


2. Open the downloaded APK.


3. If prompted, enable Install unknown apps.


4. Install and launch AquaSeal.


5. Everything runs fully offline — no servers required.




---

## 💻 Desktop (PC) — Development Preview

AquaSeal also includes a web frontend + local backend you can run on your computer.

Requirements

Node.js (LTS recommended)

Git

Any modern browser


Steps

1. Clone the repository

git clone https://github.com/mstudio005/aquaseal_native.git
cd aquaseal_native


2. Run the UI (frontend)

Open index.html in your browser
(located in the project root folder)



3. Start the backend server

cd backend
npm install
npm start


4. The backend will run locally, and the UI in your browser will connect to it.




---

## 🚧 Notes

The desktop setup is intended for development and debugging, not as a full desktop version.

All processing still happens locally on your machine.

The Android APK includes the Python + yt-dl-p + FFmpeg runtime, but the PC version does not auto-install these.
Installation
