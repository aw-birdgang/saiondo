# 🍏 Saiondo Flutter App - iOS 빌드 & 배포 가이드

이 문서는 `frontend/app` Flutter 프로젝트의 iOS 앱을  
**빌드, TestFlight/앱스토어 배포, flavor(dev/prod) 관리, 에뮬레이터 실행**까지  
실제 프로젝트 구조와 운영 경험을 반영해 안내합니다.

---

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [프로젝트 설정 확인](#2-프로젝트-설정-확인)
3. [빌드 환경 설정](#3-빌드-환경-설정)
4. [iOS 빌드](#4-ios-빌드)
5. [TestFlight/앱스토어 배포](#5-testflight앱스토어-배포)
6. [기타 참고사항](#6-기타-참고사항)
7. [자주 발생하는 이슈 & Trouble Shooting](#7-자주-발생하는-이슈--trouble-shooting)
8. [참고 명령어](#8-참고-명령어)
9. [참고 파일 구조](#9-참고-파일-구조)
10. [에뮬레이터에서 실행하기](#10-에뮬레이터에서-실행하기)
11. [공식 문서/참고](#11-공식-문서참고)
12. [Best Practice & 운영 팁](#12-best-practice--운영-팁)

---

## 1. 사전 준비

### 1.1. 필수 도구 설치
- **macOS** (최신)
- **Xcode** (최신, App Store 또는 [공식](https://developer.apple.com/xcode/))
- **CocoaPods** (`sudo gem install cocoapods`)
- **Flutter & FVM** (`brew install fvm`)
- **Apple Developer 계정** (앱 배포용, 유료)

### 1.2. 인증서 및 프로비저닝 프로파일
- [Apple Developer Center](https://developer.apple.com/account/resources/certificates/list)에서
  - **Certificates**: iOS Distribution(배포용) 인증서 생성/다운로드
  - **Identifiers**: App ID 생성
  - **Profiles**: 배포용 Provisioning Profile 생성/다운로드
- Xcode > Preferences > Accounts에서 Apple ID 로그인, 인증서/프로파일 등록

---

## 2. 프로젝트 설정 확인

### 2.1. Info.plist
- 위치: `ios/Runner/Info.plist`
- 앱 이름, 번들 ID, 권한 등 확인/수정

### 2.2. 번들 ID
- 기본: `com.saiondo.sample` (flavor 사용 시 suffix가 붙을 수 있음)
- Xcode에서 실제 배포용 번들 ID로 맞춰야 함

### 2.3. GoogleService-Info.plist (Firebase 사용 시)
- 위치: `ios/Runner/GoogleService-Info.plist`
- Firebase 콘솔에서 다운로드 후 해당 위치에 복사

### 2.4. 의존성 설치
```bash
fvm flutter pub get
cd ios
pod install
cd ..
```

---

## 3. 빌드 환경 설정

### 3.1. Flavor(옵션)
- dev/prod 등 flavor를 사용하는 경우, Xcode의 Scheme에서 해당 flavor를 선택
- 필요시 `ios/Runner.xcworkspace`에서 Scheme 추가/수정
- `lib/main_dev.dart`, `lib/main_prod.dart` 등으로 분기

### 3.2. 빌드 번호/버전 설정
- `pubspec.yaml`의 `version: 1.0.0+1` 참고
- 빌드시 `--build-name`, `--build-number` 옵션으로 덮어쓸 수 있음

---

## 4. iOS 빌드

### 4.1. Xcode로 빌드 (권장)
1. `ios/Runner.xcworkspace` 파일을 Xcode로 연다
2. 상단의 타겟(디바이스/시뮬레이터) 및 Scheme(flavor) 선택
3. Product > Archive 실행

### 4.2. 터미널에서 빌드
```bash
# Release 빌드 (기본 main.dart)
fvm flutter build ios --release

# flavor 사용 시
fvm flutter build ios --flavor prod -t lib/main_prod.dart
fvm flutter build ios --flavor dev -t lib/main_dev.dart
```
- 빌드 결과물: `build/ios/iphoneos/Runner.app` 또는 `build/ios/ipa/Runner.ipa`

---

## 5. TestFlight/앱스토어 배포

### 5.1. Xcode Organizer에서 업로드
1. Archive 완료 후, Xcode > Window > Organizer에서 Archive 선택
2. "Distribute App" 클릭
3. "App Store Connect" → "Upload" 선택
4. 안내에 따라 업로드 진행

### 5.2. Transporter 앱 사용 (대안)
- `build/ios/ipa`에 .ipa 파일이 있다면, Transporter 앱으로 업로드 가능

---

## 6. 기타 참고사항

- **앱 아이콘/런치 이미지**: `ios/Runner/Assets.xcassets`에서 관리
- **권한 설정**: `Info.plist`에서 필요 권한 추가
- **Firebase 등 외부 서비스 연동**: 관련 파일/설정 누락 주의
- **배포 전, 실제 디바이스에서 테스트 권장**
- **flavor별 환경변수**: [flutter_dotenv](https://pub.dev/packages/flutter_dotenv) 등으로 `.env.dev`, `.env.prod` 관리 추천
- **.gitignore**: 민감 정보, 빌드 산출물, 환경변수 파일 반드시 제외

---

## 7. 자주 발생하는 이슈 & Trouble Shooting

| 이슈/오류 | 해결 방법 |
|-----------|-----------|
| 코드사인 오류 | 인증서/프로비저닝 프로파일 확인, Xcode에서 Team/Certificate/Provisioning Profile 올바르게 선택 |
| 앱 아이콘/스플래시 누락 | Assets.xcassets 확인 |
| 푸시/딥링크 등 동작 안함 | Info.plist, Firebase 설정 확인 |
| 빌드 실패 | `pod install`, Xcode Clean Build Folder 후 재시도 |
| flavor 실행 오류 | Xcode Scheme과 flutter --flavor 옵션 이름 일치 확인 |
| 빌드/배포 중 "No profiles for ..." | Apple Developer Center에서 Provisioning Profile 재확인/재생성 |

---

## 8. 참고 명령어

```bash
# 의존성 설치
fvm flutter pub get
cd ios && pod install && cd ..

# iOS 빌드 (release)
fvm flutter build ios --release

# flavor 빌드
fvm flutter build ios --flavor prod -t lib/main_prod.dart
fvm flutter build ios --flavor dev -t lib/main_dev.dart

# 시뮬레이터 실행
open -a Simulator

# flavor로 실행
fvm flutter run --flavor dev -t lib/main_dev.dart
```

---

## 9. 참고 파일 구조

```plaintext
frontend/app/
  ├── ios/
  │    ├── Runner/
  │    │    ├── Info.plist
  │    │    ├── GoogleService-Info.plist
  │    │    └── Assets.xcassets/
  │    ├── Flutter/
  │    │    ├── Release.xcconfig
  │    │    └── Generated.xcconfig
  │    └── Runner.xcworkspace
  ├── pubspec.yaml
  └── ...
```

---

## 10. 에뮬레이터에서 실행하기

### 10.1. iOS 시뮬레이터 실행
```bash
open -a Simulator
```
또는 Xcode에서 시뮬레이터를 직접 실행할 수 있습니다.

### 10.2. flavor로 실행하기

**중요:**  
iOS에서 flavor로 실행하려면, Xcode에 flavor별 scheme이 반드시 존재해야 합니다.  
(예: dev, prod 등)

예시:
```bash
fvm flutter run --flavor dev -t lib/main_dev.dart
```
- `--flavor` 뒤에는 Xcode의 scheme 이름을 정확히 입력해야 합니다.
- `-t` 뒤에는 해당 flavor의 main 파일을 지정합니다.

### 10.3. 참고

- 시뮬레이터에서는 코드서명/개발자 계정 없이도 실행 가능
- 여러 시뮬레이터가 있을 경우, 원하는 기기를 선택할 수 있음
- scheme 이름이 기억나지 않으면,  
  Xcode > Product > Scheme > Manage Schemes...에서 확인

---

## 11. 공식 문서/참고

- [Flutter 공식 문서 - iOS 릴리즈](https://docs.flutter.dev/deployment/ios)
- [Apple Developer Center](https://developer.apple.com/account/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [flutter_dotenv 패키지](https://pub.dev/packages/flutter_dotenv)

---

## 12. Best Practice & 운영 팁

- **인증서/프로비저닝 파일은 안전하게 백업** (팀 내 공유는 별도 보안 채널 사용)
- **빌드/배포 자동화**: GitHub Actions, Codemagic 등 CI/CD에서 빌드, 테스트, 배포 자동화 추천
- **환경별 앱 아이콘/이름/설정 분리**: dev/prod 구분 명확히
- **릴리즈 전 실제 디바이스 테스트 필수**
- **Apple/Flutter 정책 및 버전 최신화 주기적 확인**
- **.gitignore**에 민감 정보, 빌드 산출물, 환경변수 파일 반드시 추가

---

> **문의/피드백:**  
> 문서 개선, 빌드/배포 이슈 등은 팀 Slack 또는 GitHub Issue로 공유해주세요.

---
