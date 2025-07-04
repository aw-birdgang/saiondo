# SAIONDO Web3 확장 아이디어 및 구조

## 1. 포인트 ↔ 토큰 연동

### 개념
- 기존 앱 내 포인트를 블록체인 기반 토큰(ERC-20 등)으로 전환
- 포인트 적립/사용/전송 내역을 온체인에 기록하여 투명성과 소유권 보장

### 활용 예시
- 알림 미션/이벤트 참여 시 토큰 지급  
  (예: "매일 서로에게 질문 알림을 보내면 10P 적립 → 토큰으로 전환")
- 토큰으로 프리미엄 기능 결제, NFT 발행, 리워드 교환
- 커플/친구 간 토큰 선물, 랭킹/리더보드 운영

---

## 2. 커플의 추억을 담은 NFT

### 개념
- 커플(또는 친구, 가족 등)이 함께한 추억(메시지, 사진, 기념일, 알림 기록 등)을  
  NFT(ERC-721/1155 등)로 발행하여 영구 소장/공유

### 활용 예시
- 기념일/특별한 날에 "추억 NFT" 자동 발행  
  (예: "100일째 매일 질문 알림을 주고받은 커플 → '100일의 기록' NFT 생성")
- 커플만의 메시지/사진/음성/이모지 등을 NFT 메타데이터에 저장
- NFT를 소장, 전시, SNS 공유, 마켓플레이스 거래(선택적)
- 커플 NFT 보유자만을 위한 특별 알림/이벤트/혜택 제공

---

## 3. Web3 기반 커플/관계 서비스 확장 아이디어

### 3.1 커플/친구 전용 토큰
- 커플이 함께 미션을 달성할 때마다 "LoveToken" 등 커스텀 토큰 지급
- 토큰으로 커플 전용 아이템, NFT, 프리미엄 알림 등 구매

### 3.2 커플/관계 인증 NFT
- "우리 커플 인증" NFT 발행 → 커플만의 고유한 증표
- 커플 해제/재결합 등 상태 변화도 온체인에 기록

### 3.3 추억 타임캡슐 NFT
- 미래의 특정 날짜에만 열리는 "타임캡슐 NFT" (예: 1주년, 10년 뒤 등)
- 메시지, 사진, 영상 등 비공개 데이터 포함

### 3.4 커플/관계 히스토리 온체인
- 알림, 메시지, 기념일 등 주요 이벤트를 블록체인에 기록
- "우리의 연애/우정 히스토리"를 영구 보관

### 3.5 커플/관계 기반 DAO
- 커플/관계 커뮤니티를 DAO로 운영  
  (토큰/NFT 보유자만 참여 가능한 투표, 이벤트, 혜택 제공)

---

## 4. 기술적 구조 예시

saiondo/
├── backend/
│ ├── api/ # 포인트-토큰 연동, NFT 발행 API 등
│ └── llm/
├── frontend/
│ └── app/ # NFT/토큰 지갑 연동, 커플 NFT UI 등
├── web3/
│ ├── smart-contract/
│ │ ├── SaiondoToken.sol # 포인트 토큰(ERC-20)
│ │ └── CoupleMemoryNFT.sol # 커플 추억 NFT(ERC-721)
│ ├── scripts/
│ └── sdk/
└── docs/

## 5. 비즈니스/서비스 확장성

- **차별화**: "우리만의 추억을 NFT로 소장", "관계의 가치를 토큰으로 보상" 등 Web3만의 감성/소유권 제공
- **수익모델**: NFT 발행 수수료, 프리미엄 NFT, 토큰 결제, 커뮤니티 DAO 등 다양한 BM 가능
- **커뮤니티/바이럴**: NFT 공유, 커플 랭킹, 이벤트 등으로 자연스러운 확산 유도

---

## 결론

- 포인트-토큰 연동과 커플 추억 NFT는 SAIONDO의 "관계", "알림", "보상" 컨셉과  
  Web3의 "소유권", "투명성", "커뮤니티"를 자연스럽게 결합할 수 있는 강력한 확장 아이디어입니다.
- 기술적으로도 기존 구조에 무리 없이 추가 가능하며,  
  서비스/비즈니스적으로도 차별화와 확장성이 매우 높습니다.

> 본 문서는 SAIONDO 프로젝트의 Web3 확장 아이디어와 구조를 정리한 자료입니다.
