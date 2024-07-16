import {  Contract } from 'ethers';

// Define types and interfaces if needed
interface WalletProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isThetaWallet?: boolean;
}

declare global {
  interface Window {
    ethereum?: WalletProvider;
  }
}

// Define the WalletService class
export class WalletService {
  private provider: providers.Web3Provider | null = null;

  constructor() {
    this.initializeProvider();
  }

  // Initialize the wallet provider
  private initializeProvider(): void {
    if (this.isThetaWalletProvider()) {
      this.provider = new providers.Web3Provider(window.ethereum as unknown as WalletProvider);
    } else {
      console.warn('Theta Wallet provider is not available');
    }
  }

  // Check if Theta Wallet provider is available
  private isThetaWalletProvider(): boolean {
    const windowAny = window as any;
    return Boolean(windowAny.ethereum && windowAny.ethereum.isThetaWallet);
  }

  // Get accounts from the wallet
  public async getAccounts(): Promise<string[]> {
    if (this.provider) {
      try {
        const accounts = await this.provider.send('eth_requestAccounts', []);
        return accounts;
      } catch (error) {
        console.error('Error requesting accounts:', error);
        return [];
      }
    }
    return [];
  }

  // Sign a message using the wallet
  public async signMessage(message: string): Promise<string | null> {
    if (this.provider) {
      try {
        const signer = this.provider.getSigner();
        const signature = await signer.signMessage(message);
        return signature;
      } catch (error) {
        console.error('Error signing message:', error);
        return null;
      }
    }
    return null;
  }

  // Sign a transaction using the wallet
  public async signTransaction(contractAddress: string, contractABI: any, functionName: string, ...args: any[]): Promise<any> {
    if (this.provider) {
      try {
        const signer = this.provider.getSigner();
        const contract = new Contract(contractAddress, contractABI, signer);
        const result = await contract[functionName](...args);
        return result;
      } catch (error) {
        console.error('Error signing transaction:', error);
        return null;
      }
    }
    return null;
  }

  // Example function for checking wallet connection
  public async checkConnection(): Promise<void> {
    const accounts = await this.getAccounts();
    if (accounts.length > 0) {
      console.log('User is connected with account:', accounts[0]);
      // TODO: Implement logic to show the user as logged in on your site
    } else {
      console.log('No accounts found. User may need to connect their wallet.');
    }
  }
}

// Export an instance of the WalletService for use in other parts of the application
export const walletService = new WalletService();
