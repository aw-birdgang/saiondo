# 🔒 Saiondo Security & Privacy Guide

> **이 문서는 Saiondo 프로젝트의 인증/보안 정책, 개인정보 처리방침,  
> 운영/개발 환경에서의 보안 실천 방안을 안내합니다.**

---

## 1. 인증(Authentication) 정책

- **API 서버**
  - JWT 기반 인증(Access/Refresh Token)
  - 사용자별 권한(Role) 분리(일반, 관리자 등)
  - 비밀번호는 bcrypt 등 강력한 해시로 저장
  - 인증 실패/만료 시 적절한 에러 및 토큰 갱신 프로세스 제공

- **LLM 서버**
  - 내부 API 연동 시 서비스 간 토큰/Key 기반 인증
  - 외부 노출 API는 인증/허가된 서비스만 접근 가능

- **Web3**
  - 스마트컨트랙트 상의 민감 연산은 온체인 권한 체크(예: onlyOwner, AccessControl 등)

---

## 2. 인가(Authorization) 정책

- **API 엔드포인트별 Role/Scope 기반 접근 제어**
- **관리자/운영자 기능은 별도 권한 필요**
- **중요 데이터(예: 결제, 개인정보 등)는 추가 인증(2FA, OTP 등) 적용 가능**

---

## 3. 데이터 보호 및 암호화

- **비밀번호, API Key, 시크릿 등은 절대 평문 저장 금지**
- **환경변수(.env), AWS Secrets Manager, SSM Parameter Store 등으로 민감 정보 관리**
- **DB 연결, 외부 API 연동 등은 TLS(SSL) 강제**
- **RDS, S3 등 저장소는 암호화 옵션 활성화**
- **로그/트레이스에 개인정보/민감정보 노출 금지**

---

## 4. 네트워크/인프라 보안

- **VPC, 서브넷, 보안그룹 등으로 네트워크 계층 분리**
- **ECS/EC2 등 인스턴스는 최소 권한 원칙 적용**
- **ALB, API Gateway 등에서 HTTPS(SSL) 강제**
- **방화벽/보안그룹에서 인바운드 최소화, IP 제한**
- **Terraform 등 IaC로 보안 설정 일관성 유지**

---

## 5. CI/CD & 운영 보안

- **CI/CD 시크릿은 GitHub Actions, CodePipeline 등에서 암호화 관리**
- **빌드/배포 로그에 민감 정보 노출 금지**
- **자동화 배포 시 IAM Role 최소 권한만 부여**
- **배포/운영 환경 분리(dev/stage/prod) 및 접근 제어**

---

## 6. 개인정보 처리방침(예시)

- **수집 항목**: 이메일, 닉네임, 대화/분석 데이터 등 서비스 제공에 필요한 최소 정보만 수집
- **이용 목적**: 커플 케어 서비스 제공, 맞춤형 분석/리포트, 서비스 개선
- **보관 기간**: 회원 탈퇴 시 즉시 파기, 법적 보관 의무가 있는 경우 예외
- **제3자 제공**: 원칙적으로 외부 제공 없음(법령 등 예외 명시)
- **이용자 권리**: 정보 열람/수정/삭제 요청 가능, 개인정보 보호 책임자 지정
- **보안 조치**: 암호화 저장, 접근권한 제한, 정기적 보안 점검

---

## 7. 취약점 대응 및 모니터링

- **정기적 보안 업데이트 및 취약점 점검(의존성, OS, 패키지 등)**
- **Sentry, Datadog, CloudWatch 등으로 실시간 모니터링/알림**
- **이상 징후(로그인 시도, 에러, 트래픽 급증 등) 탐지 및 알림**
- **보안 사고 발생 시 즉시 대응 프로세스 마련**

---

## 8. 개발자/기여자 보안 실천 가이드

- **민감 정보는 코드/커밋/GitHub에 절대 노출 금지**
- **.env, key, 인증서 등은 .gitignore로 관리**
- **Pull Request/이슈에 개인정보/시크릿 포함 금지**
- **외부 패키지/라이브러리 사용 시 공식/신뢰된 소스만 활용**
- **보안 관련 PR/이슈는 maintainer에게 직접 연락**

---

## 9. 참고/권장 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [개인정보 보호법](https://www.law.go.kr/법령/개인정보보호법)
- [AWS 보안 모범 사례](https://docs.aws.amazon.com/ko_kr/wellarchitected/latest/security-pillar/welcome.html)
- [JWT Best Practices](https://jwt.io/introduction/)

---