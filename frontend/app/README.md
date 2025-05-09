# build
````
fvm flutter build web

fvm flutter pub run build_runner build
fvm dart run build_runner build --delete-conflicting-outputs

````

## build for firebase hosting deploy
````
./build_web_env.sh
ex) flutter build web --dart-define=webApiKey=AIzaSyDxxxx --dart-define=webAppId=... ...
````

## build & run local
````
./run_web_with_env.sh
````

## deploy on firebase hosting
````
./build_web_env.sh
firebase deploy --only hosting
````


#
````
fvm flutter run -d chrome
````

lib/
├── main.dart                # 앱 진입점
├── presentation/            # UI, 화면, 위젯
│   └── chat/                # 채팅 화면, 위젯, 상태관리
├── domain/                  # 비즈니스 로직, 엔티티, 유스케이스, 리포지토리
│   └── repository/          # 데이터 접근 추상화
│   └── usecase/             # 실제 비즈니스 유스케이스
│   └── entry/               # 엔티티(도메인 모델)
├── data/                    # 데이터 소스, API, 모델, 네트워크
│   └── network/             # API 연동, 모델, 엔드포인트
│       └── apis/            # 실제 API 호출 클래스
│       └── model/           # API 응답/요청 모델
│       └── constants/       # API 엔드포인트 상수
│       └── dio_client.dart  # Dio 기반 HTTP 클라이언트
├── core/                    # 공통 유틸, 에러, 상수 등
├── di/                      # 의존성 주입