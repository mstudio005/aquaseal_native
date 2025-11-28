# Localization Guide

AquaSeal ships with English, Urdu, Hindi, and Hinglish strings. This guide explains how to contribute new languages or update existing translations.

## Where translations live

- Text resources are defined inside `www/script.js` in a map similar to:
  ```js
  const SUPPORTED_LANGUAGES = {
    en: {...},
    ur: {...},
    hi: {...},
    hn: {...}
  };
  ```
- Each entry mirrors the default English keys. UI components look up strings through helper functions so the DOM updates instantly.

## Adding a language

1. Pick a language code (ISO 639-1 preferred) and add it to `SUPPORTED_LANGUAGES`.
2. Provide translations for **all** keys. Missing keys fall back to English; avoid partial translations.
3. Add a button/option to the language picker so users can activate the new locale.
4. Test flows:
   - Navigation tabs (Home, Downloads)
   - Toasts and confirm dialogs
   - Button labels (Download, Clear, Open)
   - Error states from native plugins

## RTL (right-to-left) languages

- Use the HTML `dir` attribute when switching to RTL languages.
- Ensure CSS accommodates RTL text (flex direction, margins, icons).
- The current build adjusts body classes; reuse that logic for new RTL locales.

## Pluralization & formatting

- Keep strings human-friendly. For complex plural rules, consider moving to message-format libraries.
- Dates in the Downloads page rely on `toLocaleString`. Pass the selected language so dates reflect the active locale.

## Testing tips

- Use the built-in language switcher to live-preview translations.
- Run the app on devices/emulators that match the locale to verify fonts/rendering.
- For languages needing custom fonts, add them to `www/style.css` and load conditionally.

## Contributing translations

- Small fixes: open a pull request editing `www/script.js`.
- Large additions: create an issue to coordinate terminology and reviewers.
- Please include screenshots showing the UI with your translations applied.
