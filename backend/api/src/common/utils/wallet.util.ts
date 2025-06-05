import {ethers} from 'ethers';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.WALLET_SECRET_KEY!, 'hex'); // 32 bytes

export function createWalletWithMnemonic() {
  const wallet = ethers.Wallet.createRandom(); // 자동으로 mnemonic 생성
  return {
    address: wallet.address,
    mnemonic: wallet.mnemonic?.phrase ?? '',
    privateKey: wallet.privateKey,
  };
}

export function createWalletFromEnvMnemonic(index = 0) {
  const mnemonicPhrase = process.env.WALLET_MNEMONIC;
  if (!mnemonicPhrase) throw new Error('WALLET_MNEMONIC env is not set!');
  const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);
  const path = `m/44'/60'/0'/0/${index}`;
  const hdNode = ethers.HDNodeWallet.fromMnemonic(mnemonic, path);
  return {
    address: hdNode.address,
    mnemonic: mnemonicPhrase,
    privateKey: hdNode.privateKey,
  };
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
}

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

export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
