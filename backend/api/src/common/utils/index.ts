import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { createWinstonLogger } from '@common/logger/winston.logger';
import { ethers } from 'ethers';
import * as crypto from 'crypto';

const logger = createWinstonLogger('Utils');

// 기존 validationOptions 제거 (validation.util.ts로 이동)
// 기존 validateConfig 제거 (validation.util.ts로 이동)

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.WALLET_SECRET_KEY!, 'hex');

/**
 * 랜덤 지갑 생성 (mnemonic 포함)
 */
export function createWalletWithMnemonic() {
  try {
    const wallet = ethers.Wallet.createRandom();
    logger.debug('랜덤 지갑 생성 완료');
    return {
      address: wallet.address,
      mnemonic: wallet.mnemonic?.phrase ?? '',
      privateKey: wallet.privateKey,
    };
  } catch (error) {
    logger.error('랜덤 지갑 생성 실패:', error);
    throw error;
  }
}

/**
 * 환경 변수 mnemonic으로부터 지갑 생성
 */
export function createWalletFromEnvMnemonic(index = 0) {
  try {
    const mnemonicPhrase = process.env.WALLET_MNEMONIC;
    if (!mnemonicPhrase) {
      throw new Error('WALLET_MNEMONIC env is not set!');
    }
    
    const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);
    const path = `m/44'/60'/0'/0/${index}`;
    const hdNode = ethers.HDNodeWallet.fromMnemonic(mnemonic, path);
    
    logger.debug(`환경변수 기반 지갑 생성 완료: index=${index}`);
    return {
      address: hdNode.address,
      mnemonic: mnemonicPhrase,
      privateKey: hdNode.privateKey,
    };
  } catch (error) {
    logger.error('환경변수 기반 지갑 생성 실패:', error);
    throw error;
  }
}

/**
 * 텍스트 암호화
 */
export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    
    logger.debug('텍스트 암호화 완료');
    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
  } catch (error) {
    logger.error('텍스트 암호화 실패:', error);
    throw error;
  }
}

/**
 * 텍스트 복호화
 */
export function decrypt(encrypted: string): string {
  try {
    const [ivHex, tagHex, data] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    logger.debug('텍스트 복호화 완료');
    return decrypted;
  } catch (error) {
    logger.error('텍스트 복호화 실패:', error);
    throw error;
  }
}

/**
 * 이더리움 주소 유효성 검사
 */
export function isValidEthAddress(address: string): boolean {
  const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
  if (!isValid) {
    logger.warn(`유효하지 않은 이더리움 주소: ${address}`);
  }
  return isValid;
}

/**
 * Web3 Provider 생성
 */
export function getProvider() {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.WEB3_RPC_URL);
    logger.debug('Web3 Provider 생성 완료');
    return provider;
  } catch (error) {
    logger.error('Web3 Provider 생성 실패:', error);
    throw error;
  }
}

/**
 * Web3 지갑 생성
 */
export function getWallet() {
  try {
    const wallet = new ethers.Wallet(process.env.WEB3_PRIVATE_KEY!, getProvider());
    logger.debug('Web3 지갑 생성 완료');
    return wallet;
  } catch (error) {
    logger.error('Web3 지갑 생성 실패:', error);
    throw error;
  }
}

/**
 * ERC20 컨트랙트 생성
 */
export function getErc20Contract() {
  try {
    const abi = [
      "function balanceOf(address) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function decimals() view returns (uint8)"
    ];
    const contract = new ethers.Contract(process.env.ERC20_CONTRACT_ADDRESS!, abi, getWallet());
    logger.debug('ERC20 컨트랙트 생성 완료');
    return contract;
  } catch (error) {
    logger.error('ERC20 컨트랙트 생성 실패:', error);
    throw error;
  }
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 대화 내역을 토큰 제한에 맞게 구성
 */
export function buildHistory(
  messages: LLMMessage[],
  maxTokens = 3000
): LLMMessage[] {
  try {
    const systemMsgs = messages.filter((m) => m.role === 'system');
    let tokenCount = 0;
    const history: LLMMessage[] = [];

    // 최근 메시지부터 거꾸로 추가
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === 'system') continue; // 이미 포함
      const t = countTokens(m.content);
      if (tokenCount + t > maxTokens) break;
      history.unshift(m);
      tokenCount += t;
    }
    
    logger.debug(`대화 내역 구성 완료: ${history.length}개 메시지, ${tokenCount} 토큰`);
    return [...systemMsgs, ...history];
  } catch (error) {
    logger.error('대화 내역 구성 실패:', error);
    return messages;
  }
}

/**
 * 간단한 토큰 계산 (실제 서비스는 더 정교한 계산 필요)
 */
export function countTokens(text: string): number {
  return text.split(/\s+/).length;
}

/**
 * 대화 내역 요약 함수
 */
export function summarizeChatHistory(chatHistory: string): string {
  try {
    const lines = chatHistory.split('\n').filter(line => line.trim());
    const essential = lines.slice(-4); // 최근 2~3 round만
    const summary = essential.join(' ').replace(/\s+/g, ' ');
    
    logger.debug(
      `대화 내역 요약 완료: originalLength=${chatHistory.length}, summaryLength=${summary.length}`
    );
    return summary;
  } catch (error) {
    logger.error('대화 내역 요약 실패:', error);
    return chatHistory;
  }
}

/**
 * 랜덤 문자열 생성
 */
export function generateRandomString(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 지연 함수
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * null/undefined 체크
 */
export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

/**
 * 빈 문자열 체크
 */
export function isEmptyString(value: any): boolean {
  return typeof value === 'string' && value.trim() === '';
}

/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
