/**
 * Common types and interfaces for wallet adapters
 */

export interface WalletInfo {
  name: string;
  icon: string;
  website: string;
  description: string;
  downloadUrl: string;
  installed: boolean;
}

export interface ErgoWalletAdapter {
  readonly id: string;
  readonly info: WalletInfo;
  
  // Connection methods
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  
  // Wallet information methods
  getChangeAddress(): Promise<string>;
  getUsedAddresses(): Promise<string[]>;
  getUnusedAddresses(): Promise<string[]>;
  getBalance(tokenId?: string): Promise<any>;
  
  // Transaction methods
  getUtxos(amount?: string, tokens?: Array<{ tokenId: string, amount?: string }>): Promise<any[]>;
  getCurrentHeight(): Promise<number>;
  signTx(tx: any): Promise<any>;
  submitTx(tx: any): Promise<string>;
}

export interface WalletConnectionOptions {
  silent?: boolean;
  onDisconnect?: () => void;
}
