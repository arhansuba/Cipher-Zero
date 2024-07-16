// MetachainConnector.ts

import {  Wallet, Contract } from 'ethers';
import { BridgeContractABI, BridgeContractAddress } from '../config/BridgeConfig';

// Define a type for the MetachainConnector configuration
interface MetachainConnectorConfig {
  chainProviders: { [chainId: number]: providers.Provider };
  defaultChainId: number;
  wallet: Wallet;
}

// Define the MetachainConnector class
export class MetachainConnector {
  private providers: { [chainId: number]: providers.Provider };
  private defaultProvider: providers.Provider;
  private wallet: Wallet;
    defaultChainId: number;

  constructor(config: MetachainConnectorConfig) {
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
    const contract = new Contract(address, abi, provider);
    
    // Update the type of the 'contract' variable to include the 'crossChainTransfer' property
    const contractWithCrossChainTransfer = contract as Contract & { crossChainTransfer: any };
    contractWithCrossChainTransfer.crossChainTransfer = contractWithCrossChainTransfer.functions.crossChainTransfer;
    
    return contract;
  }

  // Example method to send a transaction to a specific chain
  public async sendTransaction(chainId: number, to: string, amount: utils.BigNumber): Promise<providers.TransactionResponse> {
    try {
      const provider = this.getProvider(chainId);
      const contract = this.getContract(chainId, BridgeContractAddress, BridgeContractABI).connect(this.wallet);
      //const tx = await contract.yourContractFunction(to, amount); // Replace 'yourContractFunction' with the actual name of your contract function
      //return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  // Example method for cross-chain communication
  public async crossChainTransfer(fromChainId: number, toChainId: number, amount: utils.BigNumber): Promise<providers.TransactionResponse> {
    try {
      const fromProvider = this.getProvider(fromChainId);
      const toProvider = this.getProvider(toChainId);
      const fromContract = this.getContract(fromChainId, BridgeContractAddress, BridgeContractABI).connect(this.wallet);
      
      // Example cross-chain transfer logic (customize based on your bridge implementation)
      const tx = await fromContract.crossChainTransfer(toChainId, amount); // Replace with actual cross-chain function
      return tx;
    } catch (error) {
      console.error('Error during cross-chain transfer:', error);
      throw error;
    }
  }
}

// Usage Example
const chainProviders = {
  1: new providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
  137: new providers.JsonRpcProvider('https://polygon-rpc.com/'), // Example for Polygon
  // Add more chains as needed
};

const wallet = new Wallet('YOUR_PRIVATE_KEY');

const metachainConnector = new MetachainConnector({
  chainProviders,
  defaultChainId: 1,
  wallet
});

// Example usage
async function exampleUsage() {
  try {
    // Set default chain to Polygon (chain ID 137)
    metachainConnector.setDefaultChain(137);
    
    // Send transaction on Polygon
    const txResponse = await metachainConnector.sendTransaction(137, '0xRecipientAddress', utils.parseUnits('1.0', 18));
    console.log('Transaction sent:', txResponse);

    // Cross-chain transfer from Ethereum to Polygon
    const crossChainTxResponse = await metachainConnector.crossChainTransfer(1, 137, utils.parseUnits('1.0', 18));
    console.log('Cross-chain transfer initiated:', crossChainTxResponse);
  } catch (error) {
    console.error('Error during example usage:', error);
  }
}

exampleUsage();
