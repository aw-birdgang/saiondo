# 📲 Saiondo API - FCM(푸시) 메시지 연동 가이드

Saiondo API는 **Firebase Cloud Messaging(FCM)**을 이용해 모바일 클라이언트에 푸시 알림을 전송합니다.  
아래는 실제 프로젝트 구조와 코드에 기반한 FCM 연동 방식, 데이터 흐름, API 사용법, 실전 예시를 정리한 가이드입니다.

---

## 1. 전체 연동 구조

- **Firebase Admin SDK**로 서버에서 직접 FCM 메시지 전송
- 유저별 FCM 토큰을 DB(User 테이블)에 저장/관리
- 푸시 발송 로직은 `PushService`에서 담당, API는 `PushController`에서 제공
- 역할별로 서비스/컨트롤러/DTO가 명확히 분리됨

---

## 2. 주요 컴포넌트 및 역할

### 2.1 `FirebaseService` (`src/common/firebase/firebase.service.ts`)

- Firebase Admin SDK 초기화 및 메시징 객체 제공
- 앱 시작 시 서비스 계정 키(`config/firebase-service-account.json`)로 Firebase 앱 초기화

```typescript
@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    }
  }
  get messaging() {
    return admin.messaging();
  }
}
```

---

### 2.2 `PushService` (`src/modules/push-schedule/push.service.ts`)

- **sendFcmMessage**: FCM 메시지 전송(내부)
- **getUserFcmToken**: 유저의 FCM 토큰 조회(내부)
- **sendPushToUser**: 유저ID로 푸시 발송(토큰 자동 조회)
- **sendPush**: 토큰 직접 지정하여 푸시 발송(외부 API용)
- 푸시 발송 시 채팅 히스토리 저장 등 부가 로직 포함

```typescript
async sendPushToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
  const fcmToken = await this.getUserFcmToken(userId);
  const pushResult = await this.sendFcmMessage(fcmToken, title, body, data);
  // ... (채팅 히스토리 저장 등)
  return pushResult;
}
async sendPush(token: string, title: string, body: string, data?: Record<string, string>) {
  return this.sendFcmMessage(token, title, body, data);
}
```

---

### 2.3 `PushController` (`src/modules/push-schedule/push.controller.ts`)

- `/push/send` : 토큰 직접 지정하여 푸시 발송
- `/push/send/user/:userId/message` : 유저ID로 푸시 발송

```typescript
@Post('send')
async sendPush(@Body() dto: SendPushDto) {
  return this.pushService.sendPush(dto.token, dto.title, dto.body, dto.data);
}
@Post('send/user/:userId/message')
async sendPushToUser(@Param('userId') userId: string, @Body() dto: SendPushToUserDto) {
  return this.pushService.sendPushToUser(userId, dto.title, dto.body, dto.data);
}
```

---

### 2.4 유저 FCM 토큰 관리

- `/users/:id/fcm-token` : 유저의 FCM 토큰 업데이트(PATCH)
- 토큰은 User 테이블의 `fcmToken` 컬럼에 저장

```typescript
@Patch(':id/fcm-token')
async updateFcmToken(@Param('id') userId: string, @Body() body: UpdateFcmTokenDto) {
  return this.userService.updateFcmToken(userId, body.fcmToken);
}
```

---

## 3. 데이터 흐름 요약

1. **클라이언트**가 FCM 토큰을 발급받아 `/users/:id/fcm-token`으로 서버에 저장
2. **서버**는 푸시 발송 시 유저ID로 토큰을 조회하거나, 직접 토큰을 받아 FCM 메시지 전송
3. **FirebaseService**가 실제 FCM 메시지 전송을 담당
4. 푸시 발송 API는 PushController에서 제공

---

## 4. 관련 DTO

- `SendPushDto`, `SendPushToUserDto` : 푸시 발송 요청용
- `UpdateFcmTokenDto` : 유저 FCM 토큰 업데이트용

---

## 5. 실전 예시 시나리오

- **유저가 앱에 로그인/회원가입 → FCM 토큰을 서버에 저장**
- **서버에서 특정 이벤트 발생 시 → PushService가 FCM 메시지 전송**
- **관리자/시스템이 직접 API 호출로 푸시 발송 가능**

---

## 6. 참고 및 Best Practice

- FCM 서비스 계정 키는 `config/firebase-service-account.json`에 위치 (절대 외부 유출 금지)
- Firebase Admin SDK는 서버에서만 사용 (클라이언트 X)
- 푸시 메시지 포맷, 데이터 구조 등은 [Firebase 공식 문서](https://firebase.google.com/docs/cloud-messaging) 참고
- 푸시 발송 실패/성공 로그, 토큰 만료/갱신 등 예외처리 로직도 구현 권장

---

## 7. 확장/운영 팁

- **멀티 디바이스 지원**: 유저별 복수 FCM 토큰 관리 필요시, User-Token 테이블 분리 추천
- **테스트**: 개발 환경에서는 실제 푸시 대신 로그/모킹 처리 가능
- **보안**: 서비스 계정 키, 토큰 등 민감 정보는 환경변수/비밀관리로 관리

---