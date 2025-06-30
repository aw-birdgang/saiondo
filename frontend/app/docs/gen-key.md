# Flutter 앱 배포를 위한 키 생성, 빌드, 릴리즈, Flavor(dev/prod) 관리 가이드

이 문서는 Flutter 앱을 실제 서비스로 배포하기 위한 **키 생성, 빌드, 릴리즈, flavor(dev/prod) 관리** 전 과정을 안내합니다.

---

## 1. Android 앱 키 생성 및 사이닝

### 1-1. 키스토어(keystore) 및 Key 생성

터미널에서 아래 명령어를 실행하여 키스토어와 키를 생성합니다.

```bash
keytool -genkey -v -keystore android/app/test-saiondo-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias test-saiondo-alias
```

- `-keystore android/app/my-release-key.jks`: 생성될 키스토어 파일 경로
- `-alias my-key-alias`: 키 별칭(원하는 이름)
- `-keyalg RSA`: 암호화 알고리즘
- `-keysize 2048`: 키 크기
- `-validity 10000`: 유효기간(일)

**실행 시 입력 예시**
```
Enter keystore password: [storePassword 입력]
Re-enter new password: [storePassword 재입력]
What is your first and last name? [입력]
...
Enter key password for <my-key-alias>:  [keyPassword 입력]
    (RETURN if same as keystore password): [엔터]
```

- 생성 결과: `android/app/test-saiondo-key.jks` 파일이 생성됩니다.
- 이 파일은 **절대 외부에 유출되면 안 됩니다!**
- 비밀번호, 별칭(alias), 경로는 반드시 기록해 두세요.

---

### 1-2. 생성한 키 정보를 `key.properties`에 입력

`android/key.properties` 파일을 아래와 같이 작성합니다.

```properties
storePassword=위에서 입력한 keystore password
keyPassword=위에서 입력한 key password (동일하면 같은 값)
keyAlias=my-key-alias
storeFile=../app/my-release-key.jks
```

---

### 1-3. `build.gradle` 설정 확인

`android/app/build.gradle` 파일에 아래 설정이 포함되어 있는지 확인합니다.

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

---

### 1-4. `.gitignore`에 키 관련 파일 추가

민감한 키 파일이 Git에 올라가지 않도록 `.gitignore`에 아래 내용을 추가합니다.

```
# Android
android/key.properties
android/app/*.jks
android/app/*.keystore

# iOS
ios/Runner/GoogleService-Info.plist
ios/Pods/
ios/Podfile.lock
ios/Flutter/ephemeral/
ios/Flutter/Generated.xcconfig
ios/Runner.xcworkspace
ios/Runner.xcodeproj/project.xcworkspace/
ios/Runner.xcodeproj/xcuserdata/
ios/Runner.xcworkspace/xcuserdata/

# Flutter/Dart
.dart_tool/
.packages
.pub/
build/
.idea/
.vscode/
*.iml
*.log
*.tmp
*.swp
*.swo
.env
.env.*
*.secret
*.bak
coverage/
test-results/
```

---

## 2. Android Flavor(dev/prod) 관리

### 2-1. flavor 설정 추가

`android/app/build.gradle`의 `android` 블록에 아래와 같이 flavor를 추가합니다.

```gradle
android {
    ...
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
    ...
}
```

- `dev`: 개발용(별도의 앱으로 설치됨)
- `prod`: 운영용

### 2-2. flavor별 아이콘, 이름, 환경변수 관리

- `android/app/src/dev/`와 `android/app/src/prod/` 폴더를 만들어  
  각 flavor별 `AndroidManifest.xml`, 리소스, 환경설정 파일을 분리 관리할 수 있습니다.

예시:
```
android/app/src/dev/AndroidManifest.xml
android/app/src/prod/AndroidManifest.xml
```

---

### 2-3. flavor별 빌드 명령어

```bash
# dev 빌드
fvm flutter build apk --flavor dev -t lib/main_dev.dart

# prod 빌드
fvm flutter build apk --flavor prod -t lib/main_prod.dart
```

- `lib/main_dev.dart`, `lib/main_prod.dart`에서 flavor별 환경설정 분기 가능

---

## 3. Android 릴리즈 빌드 및 배포

### 3-1. APK 빌드

```bash
flutter build apk --flavor prod -t lib/main_prod.dart --release
```
- 결과: `build/app/outputs/flutter-apk/app-prod-release.apk`

### 3-2. AAB 빌드 (Google Play 권장)

```bash
flutter build appbundle --flavor prod -t lib/main_prod.dart --release
```
- 결과: `build/app/outputs/bundle/prodRelease/app-prod-release.aab`

### 3-3. Google Play Console에 업로드

- [Google Play Console](https://play.google.com/console)에서 앱 등록 및 APK/AAB 업로드

---

## 4. iOS 앱 키 사이닝 및 릴리즈 빌드

### 4-1. Apple Developer 계정 준비

- [Apple Developer](https://developer.apple.com/) 계정 필요 (유료)

---

### 4-2. 인증서(Certificate) 및 프로비저닝 프로파일(Provisioning Profile) 생성

1. [Apple Developer Center](https://developer.apple.com/account/resources/certificates/list)에서
    - **Certificates**: iOS Distribution(배포용) 인증서 생성 및 다운로드
    - **Identifiers**: App ID 생성
    - **Profiles**: 배포용 Provisioning Profile 생성 및 다운로드

2. 다운로드한 인증서와 프로비저닝 프로파일을 더블클릭하여 **Keychain Access**와 **Xcode**에 등록

---

### 4-3. Xcode에서 사이닝 및 flavor 설정

1. Flutter 프로젝트 루트에서 Xcode 실행:
   ```bash
   open ios/Runner.xcworkspace
   ```
2. **Runner** 프로젝트 선택 → **Signing & Capabilities** 탭에서
    - **Team**: 본인(회사) Apple Developer Team 선택
    - **Bundle Identifier**: 고유한 앱 ID 입력 (예: com.example.myapp)
    - **Signing Certificate**: "Apple Distribution" 선택
    - **Provisioning Profile**: 배포용 프로파일 선택

#### iOS flavor 관리 예시

- `ios/Runner/Info-dev.plist`, `ios/Runner/Info-prod.plist` 등으로 분리
- Xcode의 Scheme을 복제하여 dev/prod로 구분
- `flutter build ipa --flavor dev -t lib/main_dev.dart` 등으로 빌드

---

### 4-4. 릴리즈 빌드 생성

```bash
flutter build ipa --flavor prod -t lib/main_prod.dart --release
```
- 결과: `build/ios/ipa/Runner.ipa`

---

### 4-5. App Store Connect 업로드

1. **Xcode Organizer** 또는 **Transporter** 앱을 사용해 `Runner.ipa` 업로드
2. [App Store Connect](https://appstoreconnect.apple.com/)에서 앱 등록 및 심사 요청

---

## 5. 참고/문제 해결

- **Android**
    - 비밀번호/별칭 오류: `key.properties`와 키스토어 생성 시 입력값 일치 확인
    - 키스토어 파일 손상: 새로 생성 필요
    - JDK 11 권장
- **iOS**
    - 인증서/프로비저닝 프로파일 만료 또는 미등록 시 빌드/업로드 불가
    - Xcode에서 Team, Profile, Certificate 올바르게 선택
- **flavor별 환경변수**:  
    - [flutter_dotenv](https://pub.dev/packages/flutter_dotenv) 등 패키지로 `.env.dev`, `.env.prod` 등 관리 추천

---

## 6. .gitignore 예시

```
# Android
android/key.properties
android/app/*.jks
android/app/*.keystore

# iOS
ios/Runner/GoogleService-Info.plist
ios/Pods/
ios/Podfile.lock
ios/Flutter/ephemeral/
ios/Flutter/Generated.xcconfig
ios/Runner.xcworkspace
ios/Runner.xcodeproj/project.xcworkspace/
ios/Runner.xcodeproj/xcuserdata/
ios/Runner.xcworkspace/xcuserdata/

# Flutter/Dart
.dart_tool/
.packages
.pub/
build/
.idea/
.vscode/
*.iml
*.log
*.tmp
*.swp
*.swo
.env
.env.*
*.secret
*.bak
coverage/
test-results/
```

---

## 7. 공식 문서

- [Flutter 공식 문서 - Android 릴리즈](https://docs.flutter.dev/deployment/android)
- [Google Play 앱 서명](https://developer.android.com/studio/publish/app-signing)
- [Flutter 공식 문서 - iOS 릴리즈](https://docs.flutter.dev/deployment/ios)
- [Apple Developer Center](https://developer.apple.com/account/)
- [App Store Connect](https://appstoreconnect.apple.com/)

---