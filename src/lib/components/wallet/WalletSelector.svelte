<script lang="ts">
    import { walletRegistry, activeWallet } from '$lib/ergo/wallets/registry';
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Alert from '$lib/components/ui/alert';
    import { ErgoPlatform } from '$lib/ergo/platform';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { connected } from '$lib/common/store';

    export let platform: ErgoPlatform;
    
    let showSelector = false;
    let connecting = false;
    let errorMessage = '';
    let installedWallets = [];
    let uninstalledWallets = [];

    onMount(() => {
        updateWalletLists();
    });

    function updateWalletLists() {
        const allWallets = walletRegistry.getAllAdapters();
        installedWallets = allWallets.filter(wallet => wallet.info.installed);
        uninstalledWallets = allWallets.filter(wallet => !wallet.info.installed);
    }

    async function connectWallet(wallet) {
        try {
            errorMessage = '';
            connecting = true;
            await platform.connect(wallet);
            showSelector = false;
        } catch (error) {
            errorMessage = `Failed to connect: ${error.message}`;
            console.error('Wallet connection error:', error);
        } finally {
            connecting = false;
        }
    }

    async function disconnectWallet() {
        try {
            await platform.disconnect();
        } catch (error) {
            console.error('Wallet disconnection error:', error);
        }
    }
</script>

<div class="wallet-selector">
    {#if $connected}
        <Button 
            variant="outline" 
            class="disconnect-button" 
            on:click={disconnectWallet}
        >
            Disconnect Wallet
        </Button>
    {:else}
        <Button 
            variant="default" 
            class="connect-button" 
            on:click={() => showSelector = true}
        >
            Connect Wallet
        </Button>
    {/if}
</div>

<Dialog.Root bind:open={showSelector}>
    <Dialog.Content class="wallet-selector-dialog">
        <Dialog.Header>
            <Dialog.Title>Select Wallet</Dialog.Title>
            <Dialog.Description>
                Choose a wallet to connect to the Ergo blockchain
            </Dialog.Description>
        </Dialog.Header>

        <div class="wallet-list">
            {#if connecting}
                <div class="connecting-message" transition:fade>
                    <p>Connecting to wallet...</p>
                    <div class="spinner"></div>
                </div>
            {:else if errorMessage}
                <Alert.Root variant="destructive" class="mb-4">
                    <Alert.Title>Connection Error</Alert.Title>
                    <Alert.Description>{errorMessage}</Alert.Description>
                </Alert.Root>
            {/if}

            <h3 class="wallet-category">Installed Wallets</h3>
            {#if installedWallets.length === 0}
                <p class="no-wallets">No supported wallets found. Please install one of the wallets below.</p>
            {:else}
                <div class="wallet-grid">
                    {#each installedWallets as wallet}
                        <button 
                            class="wallet-item"
                            on:click={() => connectWallet(wallet)}
                            disabled={connecting}
                        >
                            <img src={wallet.info.icon} alt={wallet.info.name} class="wallet-icon" />
                            <div class="wallet-info">
                                <h4>{wallet.info.name}</h4>
                                <p>{wallet.info.description}</p>
                            </div>
                        </button>
                    {/each}
                </div>
            {/if}

            {#if uninstalledWallets.length > 0}
                <h3 class="wallet-category">Other Supported Wallets</h3>
                <div class="wallet-grid">
                    {#each uninstalledWallets as wallet}
                        <a 
                            href={wallet.info.downloadUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="wallet-item unavailable"
                        >
                            <img src={wallet.info.icon} alt={wallet.info.name} class="wallet-icon" />
                            <div class="wallet-info">
                                <h4>{wallet.info.name}</h4>
                                <p>{wallet.info.description}</p>
                                <span class="install-badge">Install</span>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>

        <Dialog.Footer>
            <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
            </Dialog.Close>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<style>
    .wallet-selector-dialog {
        max-width: 500px;
    }

    .wallet-list {
        margin: 1rem 0;
    }

    .wallet-category {
        font-size: 1rem;
        margin: 1rem 0 0.5rem;
        color: var(--primary);
    }

    .wallet-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .wallet-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        background-color: var(--card);
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        transition: all 0.2s ease;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
    }

    .wallet-item:hover:not(.unavailable) {
        background-color: var(--accent);
        transform: translateY(-2px);
    }

    .wallet-item.unavailable {
        opacity: 0.7;
    }

    .wallet-icon {
        width: 40px;
        height: 40px;
        margin-right: 1rem;
        object-fit: contain;
    }

    .wallet-info {
        flex: 1;
    }

    .wallet-info h4 {
        margin: 0;
        font-size: 1rem;
    }

    .wallet-info p {
        margin: 0.25rem 0 0;
        font-size: 0.85rem;
        color: var(--muted-foreground);
    }

    .install-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background-color: var(--primary);
        color: var(--primary-foreground);
        border-radius: 0.25rem;
        font-size: 0.75rem;
        margin-top: 0.5rem;
    }

    .connecting-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        margin-bottom: 1rem;
    }

    .spinner {
        width: 1.5rem;
        height: 1.5rem;
        border: 2px solid var(--border);
        border-top: 2px solid var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-top: 0.5rem;
    }

    .no-wallets {
        color: var(--muted-foreground);
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media (min-width: 640px) {
        .wallet-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
