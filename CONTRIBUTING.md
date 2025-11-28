# Contributing to AquaSeal

Thanks for your interest in contributing! We welcome bug reports, improvements, and pull requests.

How to contribute

- Search existing issues before opening a new one.
- For bug reports, include steps to reproduce, expected behavior and logs if available.
- For feature requests, explain the use case and provide UI/UX suggestions if relevant.

Development workflow

1. Fork the repository and create a branch: `feature/your-short-description`.
2. Make your changes locally and ensure the app builds.
   - For UI changes: edit files in `www/` and run `npx cap sync android`.
   - For native changes: edit `android/` and build with Gradle.
3. Run static checks (if any) and format code consistently.
4. Submit a pull request describing the change and linking related issues.

Code style

- Java: follow existing code style in `android/`.
- JavaScript: use clear variable names and keep functions small.
- Avoid introducing large formatting-only changes.

Testing

- Manual testing on an Android emulator or device is recommended when making platform changes.

License and CLA

By contributing, you agree that your contributions will be licensed under the project's license (GPL-3.0-or-later).

Thank you for helping improve AquaSeal!