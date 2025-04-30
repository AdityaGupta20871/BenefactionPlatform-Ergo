/**
 * SAFEW wallet adapter implementation
 */
import type { ErgoWalletAdapter, WalletInfo } from './types';

export class SafewWalletAdapter implements ErgoWalletAdapter {
  readonly id = 'safew';
  readonly info: WalletInfo = {
    name: 'SAFEW',
    icon: '/wallet-icons/safew.png', // This will need to be added to static assets
    website: 'https://github.com/ThierryM1212/SAFEW',
    description: 'Simple And Fast Ergo Wallet',
    downloadUrl: 'https://chromewebstore.google.com/detail/safew-simple-and-fast-erg/fmpbldieijjehhalgjblbpgjmijencll',
    installed: false
  };

  constructor() {
    this.checkIfInstalled();
  }

  private checkIfInstalled(): void {
    if (typeof window !== 'undefined' && typeof window.ergoConnector !== 'undefined') {
      this.info.installed = !!window.ergoConnector.safew;
    }
  }

  async connect(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ergoConnector?.safew) {
      console.error('SAFEW wallet not available');
      return false;
    }

    try {
      return await window.ergoConnector.safew.connect();
    } catch (error) {
      console.error('Error connecting to SAFEW wallet:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (typeof window === 'undefined' || !window.ergoConnector?.safew) {
      return;
    }

    try {
      if (window.ergoConnector.safew.disconnect) {
        await window.ergoConnector.safew.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting from SAFEW wallet:', error);
    }
  }

  async isConnected(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ergoConnector?.safew) {
      return false;
    }

    try {
      return await window.ergoConnector.safew.isConnected();
    } catch (error) {
      console.error('Error checking SAFEW connection status:', error);
      return false;
    }
  }

  async getChangeAddress(): Promise<string> {
    if (typeof window === 'undefined' || !window.ergo) {
      throw new Error('Wallet not connected');
    }

    return await window.ergo.get_change_address();
  }

  async getUsedAddresses(): Promise<string[]> {
    if (typeof window === 'undefined' || !window.ergo) {
      throw new Error('Wallet not connected');
    }

    return await window.ergo.get_used_addresses();
  }

  async getUnusedAddresses(): Promise<string[]> {
    if (typeof window === 'undefined' || !window.ergo) {
      throw new Error('Wallet not connected');
    }

    return await window.ergo.get_unused_addresses();
  }

  async getBalance(tokenId?: string): Promise<any> {
    if (typeof window === 'undefined' || !window.ergo) {
      throw new Error('Wallet not connected');
    }

    return await window.ergo.get_balance(tokenId || 'all');
  }

  async getUtxos(amount?: string, tokens?: Array<{ tokenId: string, amount?: string }>): Promise<any[]> {
    if (typeof window === 'undefined' || !window.ergo) {
      throw new Error('Wallet not connected');
    }

    const params: any = {};
    if (amount !== undefined) {
      params.amount = amount;
    }
    if (tokens !== undefined) {
      params.tokens = tokens;
    }

    return await window.ergo.get_utxos(params);
  }

  async getCurrentHeight(): Promise<number> {
    if (typeof window === 'undefined' || !window.ergo) {
      throw new Error('Wallet not connected');
    }

    return await window.ergo.get_current_height();
  }

  async signTx(tx: any): Promise<any> {
    if (typeof window === 'undefined' || !window.ergo) {
      throw new Error('Wallet not connected');
    }

    return await window.ergo.sign_tx(tx);
  }

  async submitTx(tx: any): Promise<string> {
    if (typeof window === 'undefined' || !window.ergo) {
      throw new Error('Wallet not connected');
    }

    return await window.ergo.submit_tx(tx);
  }
}
