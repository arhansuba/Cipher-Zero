// MetachainMessageHandler.ts

import {  Wallet, Contract, utils } from 'ethers';
import { BridgeContractABI, BridgeContractAddress } from '../config/BridgeConfig';
import { BridgeContract } from '../types'; // Replace '../types' with the actual path to the file containing the BridgeContract type.

// Define a type for the MetachainMessageHandler configuration
interface MetachainMessageHandlerConfig {
  chainProviders: { [chainId: number]: providers.Provider };
  defaultChainId: number;
  wallet: Wallet;
}

// Define the MetachainMessageHandler class
export class MetachainMessageHandler {
  private providers: { [chainId: number]: providers.Provider };
  private defaultProvider: providers.Provider;
  private wallet: Wallet;
    defaultChainId: number;

  constructor(config: MetachainMessageHandlerConfig) {
    this.providers = config.chainProviders;
    this.defaultChainId = config.defaultChainId;
    this.defaultProvider = this.providers[this.defaultChainId];
    this.wallet = config.wallet;
  }

  // Set a different default provider based on chain ID
  public setDefaultChain(chainId: number): void {
    if (this.providers[chainId]) {
      this.defaultChainId = chainId;
      this.defaultProvider = this.providers[chainId];
    } else {
      throw new Error(`Provider for chain ID ${chainId} not found.`);
    }
  }

  // Get a provider for a specific chain ID
  public getProvider(chainId: number): providers.Provider {
    const provider = this.providers[chainId];
    if (!provider) {
      throw new Error(`Provider for chain ID ${chainId} not found.`);
    }
    return provider;
  }

  // Initialize a contract on a specific chain
  public getContract(chainId: number, address: string, abi: any): Contract {
    const provider = this.getProvider(chainId);
    return new Contract(address, abi, provider);
  }

  // Send a message from one chain to another
  public async sendMessage(fromChainId: number, toChainId: number, message: string): Promise<providers.TransactionResponse> {
    try {
      const fromProvider = this.getProvider(fromChainId);
      const fromContract = this.getContract(fromChainId, BridgeContractAddress, BridgeContractABI).connect(this.wallet);
      
      // Example send message function
      const fromContract = this.getContract(fromChainId, BridgeContractAddress, BridgeContractABI).connect(this.wallet) as SpecificContractType;
      const tx = await fromContract.sendMessage(toChainId, utils.formatBytes32String(message));
      return tx;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Handle incoming messages from another chain
  public async handleMessage(chainId: number, messageId: string): Promise<void> {
    try {
      const provider = this.getProvider(chainId);
      const contract = this.getContract(chainId, BridgeContractAddress, BridgeContractABI).connect(this.wallet) as BridgeContract;
      
      // Example receive message function
      const message = await contract.getMessage(messageId);
      
      // Process the message (custom logic here)
      console.log('Received message:', utils.parseBytes32String(message));
    } catch (error) {
      console.error('Error handling message:', error);
      throw error;
    }
  }

  // Verify the integrity of a message (e.g., check signatures or data validity)
  public verifyMessage(message: string, expectedData: string): boolean {
    // Implement your message verification logic here
    // Example: return message === expectedData;
    return message === expectedData; // This is a placeholder; replace with actual verification logic
  }
}

// Usage Example
const chainProviders = {
  1: new providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
  137: new providers.JsonRpcProvider('https://polygon-rpc.com/'), // Example for Polygon
  // Add more chains as needed
};

const wallet = new Wallet('YOUR_PRIVATE_KEY');

const messageHandler = new MetachainMessageHandler({
  chainProviders,
  defaultChainId: 1,
  wallet
});

// Example usage
async function exampleUsage() {
  try {
    // Send a message from Ethereum (chain ID 1) to Polygon (chain ID 137)
    const txResponse = await messageHandler.sendMessage(1, 137, 'Hello from Ethereum!');
    console.log('Message sent:', txResponse);

    // Handle incoming messages on Polygon
    await messageHandler.handleMessage(137, '0xMessageId');
  } catch (error) {
    console.error('Error during example usage:', error);
  }
}

exampleUsage();
