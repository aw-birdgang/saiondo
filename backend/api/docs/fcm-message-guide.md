# 📲 Saiondo API - FCM(푸시) 메시지 연동 가이드

Saiondo API는 **Firebase Cloud Messaging(FCM)**을 이용해 모바일 클라이언트에 푸시 알림을 전송합니다.  
실제 프로젝트 구조와 코드에 기반한 FCM 연동 방식, 데이터 흐름, API 사용법을 정리한 가이드입니다.

---

## 📋 목차
- [1. 전체 연동 구조](#1-전체-연동-구조)
- [2. 주요 컴포넌트](#2-주요-컴포넌트)
- [3. 데이터 흐름](#3-데이터-흐름)
- [4. API 사용법](#4-api-사용법)
- [5. 실전 예시](#5-실전-예시)
- [6. Best Practices](#6-best-practices)

---

## 1. 전체 연동 구조

### 🔧 컴포넌트 다이어그램

<p align="center">
  <img src="../../../assets/images/api/component-push-service.png" alt="FCM 컴포넌트 구조" width="700"/>
</p>

**핵심 특징:**
- ✅ **Firebase Admin SDK**로 서버에서 직접 FCM 메시지 전송
- ✅ 유저별 FCM 토큰을 DB(User 테이블)에 저장/관리
- ✅ 푸시 발송 로직은 `PushService`에서 담당
- ✅ API는 `PushController`에서 제공
- ✅ 역할별로 서비스/컨트롤러/DTO가 명확히 분리

---

## 2. 주요 컴포넌트

### 2.1 📤 FirebaseService
**위치:** `src/common/firebase/firebase.service.ts`

**역할:** Firebase Admin SDK 초기화 및 메시징 객체 제공

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

### 2.2 📤 PushService
**위치:** `src/modules/push-schedule/push.service.ts`

**주요 메서드:**
- `sendFcmMessage()` - FCM 메시지 전송 (내부)
- `getUserFcmToken()` - 유저의 FCM 토큰 조회 (내부)
- `sendPushToUser()` - 유저ID로 푸시 발송 (토큰 자동 조회)
- `sendPush()` - 토큰 직접 지정하여 푸시 발송 (외부 API용)

```typescript
async sendPushToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
  const fcmToken = await this.getUserFcmToken(userId);
  const pushResult = await this.sendFcmMessage(fcmToken, title, body, data);
  // 채팅 히스토리 저장 등 부가 로직
  return pushResult;
}
```

### 2.3 📤 PushController
**위치:** `src/modules/push-schedule/push.controller.ts`

**API 엔드포인트:**
- `POST /push/send` - 토큰 직접 지정하여 푸시 발송
- `POST /push/send/user/:userId/message` - 유저ID로 푸시 발송

```typescript
@Post('send/user/:userId/message')
async sendPushToUser(@Param('userId') userId: string, @Body() dto: SendPushToUserDto) {
  return this.pushService.sendPushToUser(userId, dto.title, dto.body, dto.data);
}
```

---

## 3. 데이터 흐름

### 🔄 시퀀스 다이어그램

<p align="center">
  <img src="../../../assets/images/api/sequence-push-service.png" alt="FCM 데이터 흐름" width="700"/>
</p>

### 단계별 설명

1. **🔑 토큰 발급**: 클라이언트가 FCM 토큰을 발급받음
2. **토큰 저장**: `/users/:id/fcm-token`으로 서버에 저장
3. **푸시 요청**: 서버에 푸시 발송 요청
4. **토큰 조회**: 유저ID로 FCM 토큰 조회
5. **☁️ FCM 전송**: FirebaseService가 FCM 메시지 전송
6. **알림 수신**: 클라이언트에서 푸시 알림 수신

---

## 4. API 사용법

### 4.1 유저별 푸시 발송

```bash
POST /api/push/send/user/{userId}/message
Content-Type: application/json

{
  "title": "새로운 메시지",
  "body": "새로운 메시지가 도착했습니다.",
  "data": {
    "channelId": "123",
    "messageId": "456"
  }
}
```

### 4.2 🔑 FCM 토큰 업데이트

```bash
PATCH /api/users/{userId}/fcm-token
Content-Type: application/json

{
  "fcmToken": "fcm_token_string_here"
}
```

### 4.3 직접 토큰으로 푸시 발송

```bash
POST /api/push/send
Content-Type: application/json

{
  "token": "fcm_token_string",
  "title": "테스트 알림",
  "body": "이것은 테스트 메시지입니다.",
  "data": {
    "type": "test"
  }
}
```

---

## 5. 실전 예시

### 5.1 🚀 기본 사용 시나리오

```typescript
// 1. 유저 로그인 시 FCM 토큰 저장
await updateFcmToken(userId, fcmToken);

// 2. 특정 이벤트 발생 시 푸시 발송
await pushService.sendPushToUser(userId, "새 메시지", "새로운 메시지가 도착했습니다.");

// 3. 커플 알림 (채널 멤버들에게)
for (const member of channel.members) {
  await pushService.sendPushToUser(member.userId, "커플 알림", "새로운 커플 이벤트가 있습니다.");
}
```

### 5.2 에러 처리 예시

```typescript
try {
  await pushService.sendPushToUser(userId, title, body);
} catch (error) {
  if (error.message.includes('FCM 환경 이상')) {
    // FCM 환경 문제 - DB에는 저장, 푸시는 스킵
    console.log('FCM 환경 문제로 푸시 전송 실패');
  } else {
    // 기타 에러 처리
    console.error('푸시 전송 실패:', error);
  }
}
```

---

## 6. Best Practices

### 🎨 보안
- ❌ **절대 GitHub에 서비스 계정 키 업로드 금지**
- ✅ **환경변수로 키 파일 경로 관리**
- ✅ **서비스 계정 키는 정기적으로 갱신**

### 🚀 성능
- ✅ **토큰 캐싱**: 자주 사용하는 토큰은 Redis에 캐시
- ✅ **배치 처리**: 대량 푸시는 배치로 처리
- ✅ **에러 재시도**: 일시적 실패 시 재시도 로직 구현

### �� 모니터링
- ✅ **푸시 전송 성공률 추적**
- ✅ **토큰 만료/갱신 로그**
- ✅ **FCM 환경 상태 체크**

### 🔧 테스트
- ✅ **개발 환경**: 실제 푸시 대신 로그/모킹 처리
- ✅ **테스트 토큰**: 개발용 FCM 토큰 별도 관리
- ✅ **통합 테스트**: 전체 푸시 플로우 테스트

---

## 7. 참고 자료

- [Firebase Cloud Messaging 공식 문서](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Admin SDK 문서](https://firebase.google.com/docs/admin/setup)
- [NestJS 공식 문서](https://docs.nestjs.com/)

---

## 8. 문제 해결

### 자주 발생하는 문제

1. **"Invalid JWT Signature" 에러**
   - 서버 시간 동기화 필요
   - 서비스 계정 키 재발급 필요

2. **토큰 만료**
   - 클라이언트에서 토큰 갱신 후 서버 업데이트

3. **FCM 환경 문제**
   - `validateFcmEnvironment()` 메서드로 사전 체크

---
