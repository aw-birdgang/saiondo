# 📦 Saiondo Flutter 앱 - Android/iOS 빌드, 배포, Flavor(dev/prod) 관리 가이드

이 문서는 **Saiondo Flutter 앱**을 실제 서비스로 배포하기 위한  
**키 생성, 빌드, 릴리즈, flavor(dev/prod) 관리** 전 과정을 안내합니다.  
(프로젝트 구조, 환경변수, 빌드 스크립트, 실전 운영 경험을 반영)

---

## 📋 목차

1. [Android 앱 키 생성 및 사이닝](#1-android-앱-키-생성-및-사이닝)
2. [Android Flavor(dev/prod) 관리](#2-android-flavordevprod-관리)
3. [Android 릴리즈 빌드 및 배포](#3-android-릴리즈-빌드-및-배포)
4. [iOS 앱 키 사이닝 및 릴리즈 빌드](#4-ios-앱-키-사이닝-및-릴리즈-빌드)
5. [환경변수/스크립트/자동화](#5-환경변수스크립트자동화)
6. [Trouble Shooting & 운영 팁](#6-trouble-shooting--운영-팁)
7. [공식 문서/참고](#7-공식-문서참고)

---

## 1. Android 앱 키 생성 및 사이닝

### 1-1. 키스토어(keystore) 및 Key 생성

```bash
keytool -genkey -v -keystore android/app/saiondo-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias saiondo-release
```

- `-keystore android/app/saiondo-release-key.jks`: 생성될 키스토어 파일 경로
- `-alias saiondo-release`: 키 별칭(원하는 이름)
- **키 파일은 절대 외부에 유출 금지!**
- 비밀번호, 별칭(alias), 경로는 반드시 기록

### 1-2. `key.properties` 파일 작성

`android/key.properties` 파일을 아래와 같이 작성:

```properties
storePassword=키스토어 비밀번호
keyPassword=키 비밀번호 (동일하면 같은 값)
keyAlias=saiondo-release
storeFile=../app/saiondo-release-key.jks
```

### 1-3. `build.gradle` 사이닝 설정

`android/app/build.gradle`에 아래 설정이 포함되어야 합니다.

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            shrinkResources false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 1-4. `.gitignore`에 키 관련 파일 추가

```gitignore
# Android
android/key.properties
android/app/*.jks
android/app/*.keystore
```
- **키 파일, key.properties는 Git에 절대 올리지 마세요!**

---

## 2. Android Flavor(dev/prod) 관리

### 2-1. flavor 설정 추가

`android/app/build.gradle`의 `android` 블록에 아래와 같이 추가:

```gradle
flavorDimensions "app"
productFlavors {
    dev {
        dimension "app"
        applicationIdSuffix ".dev"
        versionNameSuffix "-dev"
    }
    prod {
        dimension "app"
    }
}
```

### 2-2. flavor별 리소스/환경변수 관리

- `android/app/src/dev/`, `android/app/src/prod/` 폴더에  
  각 flavor별 `AndroidManifest.xml`, 리소스, 환경설정 파일 분리 가능

- **환경변수**:  
  - `flutter_dotenv` 등으로 `.env.dev`, `.env.prod` 관리 추천
  - 빌드시 `--dart-define` 옵션 활용

### 2-3. flavor별 빌드 명령어

```bash
# dev 빌드
fvm flutter build apk --flavor dev -t lib/main_dev.dart

# prod 빌드
fvm flutter build apk --flavor prod -t lib/main_prod.dart
```

---

## 3. Android 릴리즈 빌드 및 배포

### 3-1. APK 빌드

```bash
fvm flutter build apk --flavor prod -t lib/main_prod.dart --release
# 결과: build/app/outputs/flutter-apk/app-prod-release.apk
```

### 3-2. AAB 빌드 (Google Play 권장)

```bash
fvm flutter build appbundle --flavor prod -t lib/main_prod.dart --release
# 결과: build/app/outputs/bundle/prodRelease/app-prod-release.aab
```

### 3-3. Google Play Console 업로드

- [Google Play Console](https://play.google.com/console)에서 앱 등록 및 APK/AAB 업로드

---

## 4. iOS 앱 키 사이닝 및 릴리즈 빌드

### 4-1. Apple Developer 계정 준비

- [Apple Developer](https://developer.apple.com/) 계정 필요 (유료)

### 4-2. 인증서/프로비저닝 프로파일 생성

- Apple Developer Center에서
    - **Certificates**: iOS Distribution(배포용) 인증서 생성/다운로드
    - **Identifiers**: App ID 생성
    - **Profiles**: 배포용 Provisioning Profile 생성/다운로드
- 다운로드한 인증서/프로파일을 **Keychain Access**와 **Xcode**에 등록

### 4-3. Xcode에서 사이닝 및 flavor 설정

```bash
open ios/Runner.xcworkspace
```
- **Signing & Capabilities**에서 Team, Bundle ID, Certificate, Profile 설정
- flavor별 Info.plist, Scheme 분리 가능

### 4-4. 릴리즈 빌드 생성

```bash
fvm flutter build ipa --flavor prod -t lib/main_prod.dart --release
# 결과: build/ios/ipa/Runner.ipa
```

### 4-5. App Store Connect 업로드

- **Xcode Organizer** 또는 **Transporter** 앱으로 업로드
- [App Store Connect](https://appstoreconnect.apple.com/)에서 앱 등록/심사

---

## 5. 환경변수/스크립트/자동화

- **환경변수 관리**:  
  - `flutter_dotenv` 등으로 `.env.dev`, `.env.prod` 분리
  - 빌드시 `--dart-define` 옵션 활용
- **빌드/배포 스크립트**:  
  - `build_web_env.sh`, `run_web_with_env.sh` 등 활용
- **CI/CD**:  
  - GitHub Actions, Codemagic 등으로 자동화 가능
  - 시크릿/환경변수는 CI 환경에 안전하게 등록

---

## 6. Trouble Shooting & 운영 팁

### Android

- **비밀번호/별칭 오류**: `key.properties`와 키스토어 생성 시 입력값 일치 확인
- **키스토어 파일 손상**: 새로 생성 필요
- **JDK 11 권장**: JDK 버전 불일치로 인한 빌드 오류 주의

### iOS

- **인증서/프로비저닝 프로파일 만료 또는 미등록 시**: 빌드/업로드 불가
- **Xcode에서 Team, Profile, Certificate 올바르게 선택**
- **flavor별 Info.plist, Scheme 분리**: 앱 이름, 번들ID, 아이콘 등 분리 관리

### 공통

- **flavor별 환경변수**:  
    - `.env.dev`, `.env.prod` + `flutter_dotenv` + `--dart-define` 조합 추천
- **.gitignore**:  
    - 민감 파일, 빌드 산출물, 환경변수 파일 반드시 제외
- **릴리즈 빌드 전**:  
    - `flutter clean` 후 빌드 권장
    - `pubspec.yaml` 의존성 최신화

---

## 7. 공식 문서/참고

- [Flutter 공식 문서 - Android 릴리즈](https://docs.flutter.dev/deployment/android)
- [Google Play 앱 서명](https://developer.android.com/studio/publish/app-signing)
- [Flutter 공식 문서 - iOS 릴리즈](https://docs.flutter.dev/deployment/ios)
- [Apple Developer Center](https://developer.apple.com/account/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [flutter_dotenv 패키지](https://pub.dev/packages/flutter_dotenv)

---

## 📝 Best Practice & 추가 팁

- **키스토어/프로비저닝 파일은 안전하게 백업** (팀 내 공유는 별도 보안 채널 사용)
- **빌드/배포 자동화**: CI/CD에서 flavor별 빌드, 테스트, 배포 자동화 추천
- **환경별 앱 아이콘/이름/설정 분리**: dev/prod 구분 명확히
- **릴리즈 전 실제 디바이스 테스트 필수**
- **Google Play/App Store 정책 최신화 주기적 확인**

---

> **문의/피드백:**  
> 문서 개선, 빌드/배포 이슈 등은 팀 Slack 또는 GitHub Issue로 공유해주세요.

---
