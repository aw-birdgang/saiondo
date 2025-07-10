import { ethers } from 'ethers';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.WALLET_SECRET_KEY!, 'hex'); // 32 bytes

/**
 * 랜덤 지갑 생성 (mnemonic 포함)
 */
export function createWalletWithMnemonic() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    mnemonic: wallet.mnemonic?.phrase ?? '',
    privateKey: wallet.privateKey,
  };
}

/**
 * 환경 변수 mnemonic으로부터 지갑 생성
 */
export function createWalletFromEnvMnemonic(index = 0) {
  const mnemonicPhrase = process.env.WALLET_MNEMONIC;
  if (!mnemonicPhrase) {
    throw new Error('WALLET_MNEMONIC env is not set!');
  }
  
  const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);
  const path = `m/44'/60'/0'/0/${index}`;
  const hdNode = ethers.HDNodeWallet.fromMnemonic(mnemonic, path);
  
  return {
    address: hdNode.address,
    mnemonic: mnemonicPhrase,
    privateKey: hdNode.privateKey,
  };
}

/**
 * 텍스트 암호화
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
}

/**
 * 텍스트 복호화
 */
export function decrypt(encrypted: string): string {
  const [ivHex, tagHex, data] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * 이더리움 주소 유효성 검사
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Web3 Provider 생성
 */
export function getProvider() {
  return new ethers.JsonRpcProvider(process.env.WEB3_RPC_URL);
}

/**
 * Web3 지갑 생성
 */
export function getWallet() {
  return new ethers.Wallet(process.env.WEB3_PRIVATE_KEY!, getProvider());
}

/**
 * ERC20 컨트랙트 생성
 */
export function getErc20Contract() {
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)"
  ];
  return new ethers.Contract(process.env.ERC20_CONTRACT_ADDRESS!, abi, getWallet());
}
