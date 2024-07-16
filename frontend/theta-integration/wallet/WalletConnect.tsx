//import { providers } from 'ethers';

// Define types and interfaces if needed
interface WalletProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isThetaWallet?: boolean;
}

interface CustomWindow extends Window {
  ethereum?: any;
}

declare const window: CustomWindow;

// Detect if the Theta Wallet provider is available
export function isThetaWalletProvider(): boolean {
  const windowAny = window as any;
  return Boolean(windowAny.ethereum && windowAny.ethereum.isThetaWallet);
}

// Initialize the provider
export function getProvider(): providers.Web3Provider | null {
  if (isThetaWalletProvider()) {
    return new providers.Web3Provider(window.ethereum as unknown as WalletProvider);
  }
  console.warn('Theta Wallet provider is not available');
  return null;
}

// Get accounts from the Theta Wallet
export async function getAccounts(): Promise<string[]> {
  const provider = getProvider();
  if (provider) {
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      return accounts;
    } catch (error) {
      console.error('Error requesting accounts:', error);
      return [];
    }
  }
  return [];
}

// Sign a message using the Theta Wallet
export async function signMessage(message: string): Promise<string | null> {
  const provider = getProvider();
  if (provider) {
    try {
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  }
  return null;
}

// Sign a transaction using the Theta Wallet
export async function signTransaction(contractAddress: string, contractABI: any, functionName: string, ...args: any[]): Promise<any> {
  const provider = getProvider();
  if (provider) {
    try {
      const signer = provider.getSigner();
      const contract = new providers.Contract(contractAddress, contractABI, signer);
      const result = await contract[functionName](...args);
      return result;
    } catch (error) {
      console.error('Error signing transaction:', error);
      return null;
    }
  }
  return null;
}

// Example usage function to demonstrate the usage of the wallet methods
export async function exampleUsage() {
  const windowAny = window as any;
  const isThetaWallet = Boolean(windowAny.ethereum && windowAny.ethereum.isThetaWallet);

  if (isThetaWallet) {
    console.log('Theta Wallet provider is available');

    // Auto-connect and show the user as logged in
    const accounts = await getAccounts();
    if (accounts.length > 0) {
      console.log('User is connected with account:', accounts[0]);
      // TODO: Implement logic to show the user as logged in on your site
    } else {
      console.log('No accounts found. User may need to connect their wallet.');
    }

    // Example: Sign a message
    const message = 'Hello, Theta Wallet!';
    const signature = await signMessage(message);
    console.log('Signature:', signature);

    // Example: Sign a transaction
    // Replace with actual contract address, ABI, function name, and arguments
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    const contractABI = []; // Replace with actual ABI
    const functionName = 'someFunctionInYourContract';

    const transactionResult = await signTransaction(contractAddress, contractABI, functionName, /* arguments */);
    console.log('Transaction Result:', transactionResult);
  } else {
    console.log('Theta Wallet provider is not available');
  }
}
