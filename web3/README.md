# SAIONDO Web3 - Build, Deploy & Verify Guide

이 문서는 SAIONDO 프로젝트의 web3(스마트 컨트랙트) 개발 환경에서  
**컨트랙트 빌드, 배포, 검증(verify), 테스트, Troubleshooting**까지  
실제 프로젝트 구조와 운영 경험을 반영해 안내합니다.  
(Hardhat 기준, Truffle 등도 유사하게 적용 가능)

---

## 1. 환경 준비

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수(.env) 설정 예시
cp .env.example .env
# .env 파일에 PRIVATE_KEY, RPC_URL, ETHERSCAN_API_KEY 등 입력
```
- **PRIVATE_KEY**: 배포 계정의 프라이빗키(절대 외부 유출 금지)
- **RPC_URL**: 배포할 네트워크의 RPC 엔드포인트
- **ETHERSCAN_API_KEY**: 컨트랙트 검증용 API 키

---

## 2. 스마트 컨트랙트 빌드

```bash
# Hardhat 기준
npx hardhat compile
```
- `artifacts/` 및 `typechain/` 디렉토리에 ABI, 타입 등이 생성됩니다.

---

## 3. 스마트 컨트랙트 배포

```bash
# 네트워크 지정(예: Goerli, Sepolia, Mainnet 등)
npx hardhat run scripts/deploy-erc20-token.js --network sepolia
```
- 배포 스크립트(`scripts/deploy.js`)에서 컨트랙트 배포 및 주소 출력
- 배포 결과는 콘솔 및 `deployments/` 폴더(사용 시)에 저장

---

## 4. 컨트랙트 검증(Verify)

```bash
# Etherscan 등에서 소스코드 검증
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> [constructor arguments]
```
- `ETHERSCAN_API_KEY` 필요
- 배포 후 바로 verify 명령 실행 권장
- 컴파일러 버전, constructor arguments, 소스코드 일치 여부 확인

---

## 5. 테스트 실행

```bash
npx hardhat test
```
- `test/` 디렉토리 내의 스마트 컨트랙트 테스트 코드 실행

---

## 6. 주요 파일/디렉토리 구조

web3/
├── contracts/ # Solidity 스마트 컨트랙트
├── test/ # 테스트 코드
├── scripts/ # 배포/검증/상호작용 스크립트
├── artifacts/ # 컴파일 결과(자동 생성)
├── deployments/ # 배포 결과(옵션)
├── hardhat.config.js # Hardhat 설정
├── .env # 환경 변수
├── package.json
└── README.md

---

## 7. 배포/검증 스크립트 예시

**배포 스크립트 (`scripts/deploy.js`):**
```js
const { ethers } = require("hardhat");

async function main() {
  const Contract = await ethers.getContractFactory("SaiondoPush");
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log("Deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

**검증 명령 예시:**
```bash
npx hardhat verify --network sepolia 0x62bA3147617Ca54F8d9Fee727e07b02f4b3d90c8 --contract contracts/SAIONDO.sol:SAIONDO
```
- [Etherscan 예시 링크](https://sepolia.etherscan.io/address/0x62bA3147617Ca54F8d9Fee727e07b02f4b3d90c8#code)

---

## 8. Troubleshooting

- **환경 변수 누락**: `.env` 파일에 PRIVATE_KEY, RPC_URL, ETHERSCAN_API_KEY 등 필수 입력
- **네트워크 오류**: RPC URL, 네트워크 이름 확인
- **검증 실패**: constructor arguments, 컴파일러 버전, 소스코드 일치 여부 확인
- **가스비 부족/트랜잭션 실패**: 배포 계정 잔고 확인
- **배포/테스트 속도**: 로컬 노드(`npx hardhat node`)에서 테스트 가능

---

## 9. 운영/보안 팁

- **PRIVATE_KEY 등 민감 정보는 .env로만 관리, Git에 절대 올리지 마세요!**
- **테스트넷/메인넷 구분**: 실수로 메인넷에 배포하지 않도록 네트워크 설정 주의
- **컨트랙트 업그레이드/관리**: Proxy 패턴, OpenZeppelin Upgrades 등 활용 가능
- **자동화**: GitHub Actions 등으로 배포/검증 자동화 가능

---

## 10. 참고 링크

- [Hardhat 공식 문서](https://hardhat.org/getting-started/)
- [Etherscan Contract Verification](https://docs.etherscan.io/tutorials/verify-contracts)
- [OpenZeppelin Upgrades](https://docs.openzeppelin.com/upgrades-plugins/1.x/)

---
