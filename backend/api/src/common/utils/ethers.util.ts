import { ethers } from 'ethers';

export function getProvider() {
  return new ethers.JsonRpcProvider(process.env.WEB3_RPC_URL);
}

export function getWallet() {
  return new ethers.Wallet(process.env.WEB3_PRIVATE_KEY!, getProvider());
}

export function getErc20Contract() {
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)"
  ];
  return new ethers.Contract(process.env.ERC20_CONTRACT_ADDRESS!, abi, getWallet());
}
