# BijliOptima Builds

This folder contains ready-to-install build artifacts.

## 📱 Android

| File | Version | Type | Size |
|------|---------|------|------|
| `android/BijliOptima-release.apk` | 1.0.2 | Release (Standalone) | 77.56 MB |

### Install via USB (ADB)
```powershell
# Make sure USB Debugging is ON in your phone's Developer Options
C:\Users\hunain\AppData\Local\Android\Sdk\platform-tools\adb.exe install android\BijliOptima-release.apk
```

### Install manually (sideload)
1. Copy `BijliOptima-release.apk` to your phone (USB / WhatsApp / Google Drive)
2. On phone: **Settings → Security → Install unknown apps** → Allow
3. Open the APK file on your phone and tap **Install**

---

## 🍎 iOS

iOS builds require macOS + Xcode. Use EAS Cloud Build:

```bash
npx eas build --platform ios --profile preview
```

---

## 🔄 Rebuild Commands

### Android Debug APK
```powershell
# From project root — uses Android Studio JDK 21
powershell -Command {
  $env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
  $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
  Set-Location android
  .\gradlew.bat assembleDebug --no-daemon
}
```

### Android Release APK (signed, for Play Store)
```bash
npx eas build --platform android --profile production
```
