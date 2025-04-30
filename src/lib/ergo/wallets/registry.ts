/**
 * Wallet registry to manage all available wallet adapters
 */
import { NautilusWalletAdapter } from './nautilus';
import { SafewWalletAdapter } from './safew';
import type { ErgoWalletAdapter } from './types';
import { writable } from 'svelte/store';

// Create stores for currently active wallet and connection status
export const activeWallet = writable<ErgoWalletAdapter | null>(null);
export const walletConnected = writable<boolean>(false);

/**
 * Registry of all supported wallet adapters
 */
class WalletRegistry {
  private walletAdapters: Map<string, ErgoWalletAdapter> = new Map();
  
  constructor() {
    // Register all supported wallets
    this.register(new NautilusWalletAdapter());
    this.register(new SafewWalletAdapter());
    // Additional wallets can be registered here
  }

  /**
   * Register a wallet adapter
   */
  register(adapter: ErgoWalletAdapter): void {
    this.walletAdapters.set(adapter.id, adapter);
  }

  /**
   * Get a wallet adapter by ID
   */
  getAdapter(id: string): ErgoWalletAdapter | undefined {
    return this.walletAdapters.get(id);
  }

  /**
   * Get all registered wallet adapters
   */
  getAllAdapters(): ErgoWalletAdapter[] {
    return Array.from(this.walletAdapters.values());
  }

  /**
   * Get all installed wallet adapters
   */
  getInstalledAdapters(): ErgoWalletAdapter[] {
    return this.getAllAdapters().filter(adapter => adapter.info.installed);
  }
}

// Export a singleton instance of the registry
export const walletRegistry = new WalletRegistry();
