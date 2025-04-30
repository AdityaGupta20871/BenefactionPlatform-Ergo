// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	// Extension of the window interface for Ergo wallet connectors
	interface Window {
		ergoConnector?: {
			safew?: {
				connect: () => Promise<boolean>;
				disconnect?: () => Promise<void>;
				isConnected: () => Promise<boolean>;
			};
			// Add other wallet connectors as needed (nautilus, etc.)
		};
		
		// Wallet API interface available after connection
		ergo?: {
			get_change_address: () => Promise<string>;
			get_used_addresses: () => Promise<string[]>;
			get_unused_addresses: () => Promise<string[]>;
			get_balance: (tokenId: string) => Promise<any>;
			get_utxos: (amount?: string, tokens?: Array<{ tokenId: string, amount?: string }>) => Promise<any[]>;
			get_current_height: () => Promise<number>;
			sign_tx: (tx: any) => Promise<any>;
			submit_tx: (tx: any) => Promise<string>;
		};
	}
}

export {};
