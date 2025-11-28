Release checklist and instructions

This project uses semantic versioning. Use `vMAJOR.MINOR.PATCH` tags for releases.

Local release (create tag and push)

```powershell
# Update version in package.json if needed
git add package.json CHANGELOG.md
git commit -m "chore(release): prepare v1.0.0"

git tag -a v1.0.0 -m "AquaSeal v1.0.0 - initial Android release"
# Push tag to origin
git push origin v1.0.0
```

Create GitHub release

- Open the repository Releases page and create a release from tag `v1.0.0`.
- Add release notes (see `CHANGELOG.md` entry for v1.0.0).
- Attach the built APK located at `android/app/build/outputs/apk/debug/app-debug.apk` (or the signed release APK) to the release.

Automating releases

- We have included a skeleton GitHub Actions workflow (`.github/workflows/release.yml`) that can be extended to build the APK and upload it as a release asset when a tag is pushed.
- Building Android in CI requires setting up the Android SDK and signing keys as secrets. Add `ANDROID_SECRET_*` and `KEYSTORE` secrets as needed.

Notes

- This project bundles Python and yt-dlp; consider including checksum/hashes for large release artifacts to help users verify integrity.