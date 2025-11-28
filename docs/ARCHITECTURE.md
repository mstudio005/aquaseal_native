# AquaSeal Architecture

This document provides a deeper look at how the Capacitor shell, native plugins, and Chaquopy-based Python runtime fit together.

## High-level flow

1. Users interact with the single-page application inside `www/`.
2. Capacitor loads those assets in an Android WebView (`BridgeActivity`).
3. JavaScript calls native capabilities using Capacitor plugins.
4. `PythonBridgePlugin` invokes Chaquopy to run Python code (including yt-dlp).
5. Download results are written to device storage and surfaced back to JS, which updates the Downloads page and localStorage history.

```
User → Web UI → Capacitor Bridge → Native Plugin → Chaquopy Python → yt-dlp/OS
                      ↑                 ↓
             FileOpenerPlugin ◄─────────┘
```

## Modules

| Module | Location | Notes |
| --- | --- | --- |
| Web UI | `www/` | Contains HTML, CSS, JS, i18n dictionaries, toast/confirm components. |
| Capacitor Android | `android/` | Standard Capacitor project scaffold; `MainActivity` registers custom plugins. |
| Python runtime | `android/app/src/main/python/` | `downloader.py` wraps yt-dlp for videos, audio, and thumbnails. |
| Native plugins | `android/app/src/main/java/com/mutaibstudio/aquaseal/` | `PythonBridgePlugin`, `FileOpenerPlugin` (extend as needed). |
| Assets sync | `npx cap sync android` | Copies `www/` outputs into the Android module before building. |

## Build pipeline

1. `npm install` installs Capacitor CLI.
2. `npx cap sync android` ensures `android/app/src/main/assets/public` matches `www/`.
3. `./gradlew assembleDebug` (or `assembleRelease`) builds the APK.
4. Chaquopy downloads required Python components at build time and bundles them into the APK.

## Size considerations

- Embedding Python + yt-dlp increases APK size (~47 MB debug). Consider splitting ABI builds and enabling Android App Bundles for production.
- Keep an eye on `android/app/src/main/python/requirements.txt` (if added) to lock Python dependencies.

## Extending architecture

- **New plugins**: create a Java/Kotlin class extending `Plugin`, annotate with `@CapacitorPlugin`, and register it in `MainActivity`.
- **Shared code**: move repeated JS helpers into modules under `www/js/` if the codebase grows.
- **Background downloads**: use Android WorkManager via a new Capacitor plugin for long-running tasks.

For further guidance, open an issue or start a discussion in the repository.
