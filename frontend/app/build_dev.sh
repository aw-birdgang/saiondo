#!/bin/bash

# dev flavor로 release 빌드
fvm flutter build apk --flavor dev -t lib/main_dev.dart

# 빌드된 APK 파일명을 원하는 이름으로 변경
mv build/app/outputs/flutter-apk/app-dev-release.apk build/app/outputs/flutter-apk/saiondo_dev_release.apk

echo "빌드 및 파일명 변경 완료: saiondo_dev_release.apk"
