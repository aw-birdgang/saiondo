import * as fs from 'fs';
import * as path from 'path';

let promptCache: Record<string, string> | null = null;

/**
 * 프롬프트 템플릿을 환경 변수로 채우는 함수
 */
export function fillPromptTemplate(template: string, params: Record<string, any>): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const value = params[key.trim()];
    if (typeof value === 'object') return JSON.stringify(value);
    return value ?? '';
  });
}

/**
 * 프롬프트 파일에서 템플릿을 로드하는 함수
 */
export function loadPromptTemplate(key: string): string {
  if (!promptCache) {
    const filePath = path.join(__dirname, '../../prompts/prompt-chat.json');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Prompt file not found: ${filePath}`);
    }
    const file = fs.readFileSync(filePath, 'utf-8');
    promptCache = JSON.parse(file);
  }
  
  if (!promptCache || !(key in promptCache)) {
    throw new Error(`Prompt key "${key}" not found in prompt file`);
  }
  
  return promptCache[key];
}

/**
 * 프롬프트 캐시를 초기화하는 함수 (테스트용)
 */
export function clearPromptCache(): void {
  promptCache = null;
}

import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

/**
 * 검증 에러를 생성하는 함수
 */
function generateErrors(errors: ValidationError[]) {
  return errors.reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', '),
    }),
    {},
  );
}

/**
 * NestJS ValidationPipe 옵션
 */
export const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    console.error('Validation errors:', JSON.stringify(errors, null, 2));
    return new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(errors),
    });
  },
};

/**
 * 환경 변수 설정 검증 함수
 */
export function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
): T {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.toString()}`);
  }
  
  return validatedConfig;
}

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
  return [...systemMsgs, ...history];
}

/**
 * 간단한 토큰 계산 (실제 서비스는 더 정교한 계산 필요)
 */
export function countTokens(text: string): number {
  // 한글/영문 혼용 기준, 1단어 ≈ 1토큰 근사치
  return text.split(/\s+/).length;
}

/**
 * 대화 내역 요약 함수
 */
export function summarizeChatHistory(chatHistory: string): string {
  const lines = chatHistory.split('\n').filter(line => line.trim());
  const essential = lines.slice(-4); // 최근 2~3 round만
  return essential.join(' ').replace(/\s+/g, ' ');
}

/**
 * JSON 코드 블록에서 JSON 추출
 */
export function extractJsonFromCodeBlock(text: string): any | null {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch {
      const braceMatch = match[1].match(/{[\s\S]*}/);
      if (braceMatch) {
        try {
          return JSON.parse(braceMatch[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }
  
  const braceMatch = text.match(/{[\s\S]*}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
}

// 유틸리티 함수들을 통합하여 export
export * from './prompt.util';
export * from './validation.util';
export * from './wallet.util';
export * from './chat.util';
export * from './llm-response.util';
export * from './invite-code.util';

// 공통 유틸리티 함수들
export function generateRandomString(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

export function isEmptyString(value: any): boolean {
  return typeof value === 'string' && value.trim().length === 0;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
