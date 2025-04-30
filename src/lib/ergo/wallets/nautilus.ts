/**
 * Nautilus wallet adapter implementation
 */
import type { ErgoWalletAdapter, WalletInfo } from './types';

export class NautilusWalletAdapter implements ErgoWalletAdapter {
  readonly id = 'nautilus';
  readonly info: WalletInfo = {
    name: 'Nautilus',
    icon: '/wallet-icons/nautilus.png', // This will need to be added to static assets
    website: 'https://nautiluswallet.io',
    description: 'Fast, secure, and easy to use wallet for Ergo',
    downloadUrl: 'https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai',
    installed: false
  };

  constructor() {
    this.checkIfInstalled();
  }

  private checkIfInstalled(): void {
    if (typeof window !== 'undefined' && typeof window.ergoConnector !== 'undefined') {
      this.info.installed = !!window.ergoConnector.nautilus;
    }
  }

  async connect(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ergoConnector?.nautilus) {
      console.error('Nautilus wallet not available');
      return false;
    }

    try {
      return await window.ergoConnector.nautilus.connect();
    } catch (error) {
      console.error('Error connecting to Nautilus wallet:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (typeof window === 'undefined' || !window.ergoConnector?.nautilus) {
      return;
    }

    try {
      if (window.ergoConnector.nautilus.disconnect) {
        await window.ergoConnector.nautilus.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting from Nautilus wallet:', error);
    }
  }

  async isConnected(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ergoConnector?.nautilus) {
      return false;
    }

    try {
      return await window.ergoConnector.nautilus.isConnected();
    } catch (error) {
      console.error('Error checking Nautilus connection status:', error);
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
