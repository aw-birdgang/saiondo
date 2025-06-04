# SAIONDO Web3 - Build, Deploy & Verify Guide

이 문서는 SAIONDO 프로젝트의 web3(스마트 컨트랙트) 개발 환경에서  
**컨트랙트 빌드, 배포, 검증(verify)** 과정을 단계별로 안내합니다.  
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
npx hardhat verify --network goerli <CONTRACT_ADDRESS> [constructor arguments]
```
- `ETHERSCAN_API_KEY` 필요
- 배포 후 바로 verify 명령 실행 권장

---

## 5. 테스트 실행

```bash
npx hardhat test
```
- `test/` 디렉토리 내의 스마트 컨트랙트 테스트 코드 실행

---

## 6. 주요 파일/디렉토리 구조

web3/
├── smart-contract/
│ ├── contracts/ # Solidity 스마트 컨트랙트
│ ├── test/ # 테스트 코드
│ ├── scripts/ # 배포/검증/상호작용 스크립트
│ ├── hardhat.config.js # Hardhat 설정
│ └── .env # 환경 변수

---

## 7. 참고 예시

**배포 스크립트 예시 (`scripts/deploy.js`):**
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
npx hardhat verify --network goerli 0x1234...abcd


npx hardhat verify --network sepolia 0x62bA3147617Ca54F8d9Fee727e07b02f4b3d90c8 --contract contracts/SAIONDO.sol:SAIONDO

https://sepolia.etherscan.io/address/0x62bA3147617Ca54F8d9Fee727e07b02f4b3d90c8#code

```

---

## 8. Troubleshooting

- **환경 변수 누락**: `.env` 파일에 PRIVATE_KEY, RPC_URL, ETHERSCAN_API_KEY 등 필수 입력
- **네트워크 오류**: RPC URL, 네트워크 이름 확인
- **검증 실패**: constructor arguments, 컴파일러 버전, 소스코드 일치 여부 확인

---

## 9. 참고 링크

- [Hardhat 공식 문서](https://hardhat.org/getting-started/)
- [Etherscan Contract Verification](https://docs.etherscan.io/tutorials/verify-contracts)

---

> 본 문서는 SAIONDO Web3 프로젝트의 스마트 컨트랙트 빌드, 배포, 검증 방법을 안내합니다.

