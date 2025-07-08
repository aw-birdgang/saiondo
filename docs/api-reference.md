# 📚 SAIONDO API 레퍼런스

SAIONDO의 주요 API 엔드포인트, 요청/응답 예시, 인증 방식, 에러 코드, 문서화 도구(Swagger/Redoc) 링크를 정리합니다.

---

## 🗂️ API 문서 도구

- **Swagger UI**  
  [http://localhost:8000/docs](http://localhost:8000/docs) (LLM 서버)  
  [http://localhost:3000/api](http://localhost:3000/api) (API 서버)

- **ReDoc**  
  [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🔑 인증

- **JWT 기반 인증**  
  - Access Token, Refresh Token
  - 로그인/회원가입 시 토큰 발급
  - 모든 보호된 엔드포인트는 `Authorization: Bearer <token>` 헤더 필요

---

## 📝 주요 엔드포인트 예시

### 1. 회원가입

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "birdgang"
}
```

#### 응답
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "nickname": "birdgang"
}
```

---

### 2. 로그인

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 응답
```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

---

### 3. 커플 분석 요청 (LLM)

```http
POST /llm/couple-analysis
Content-Type: application/json

{
  "user_data": { ... },
  "partner_data": { ... }
}
```

#### 응답
```json
{
  "summary": "...",
  "compatibility_score": 0.87,
  "advice": "...",
  "personality_analysis": { ... }
}
```

---

## ⚠️ 에러 코드 예시

| 코드 | 설명 |
|------|------|
| 400  | 잘못된 요청 (파라미터 오류 등) |
| 401  | 인증 실패 (토큰 만료/누락) |
| 403  | 권한 없음 |
| 404  | 리소스 없음 |
| 500  | 서버 내부 오류 |

---

## 📌 참고

- **API 스펙 전체**는 Swagger UI/Redoc에서 최신 상태로 확인하세요.
- 엔드포인트, 파라미터, 응답 구조 등은 실제 서버 문서와 동기화되어야 합니다.

---

> 문서 개선/추가 요청은 GitHub Issue로 남겨주세요!
