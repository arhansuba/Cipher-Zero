// WormholeUtils.ts

import { providers, Wallet, Contract } from 'ethers';
import { WormholeBridgeABI, WormholeBridgeAddress, WormholeRelayerABI, WormholeRelayerAddress } from '../config/WormholeConfig';

// Define types for WormholeUtils configuration
interface WormholeUtilsConfig {
  providers: { [chainId: number]: providers.Provider };
  defaultChainId: number;
  wallet: Wallet;
}

// Define WormholeUtils class
export class WormholeUtils {
  private providers: { [chainId: number]: providers.Provider };
  private defaultProvider: providers.Provider;
  private wallet: Wallet;
    defaultChainId: number;

  constructor(config: WormholeUtilsConfig) {
    this.providers = config.providers;
    this.defaultChainId = config.defaultChainId;
    this.defaultProvider = this.providers[this.defaultChainId];
    this.wallet = config.wallet;
  }

  // Get a provider for a specific chain ID
  public getProvider(chainId: number): providers.Provider {
    const provider = this.providers[chainId];
    if (!provider) {
      throw new Error(`Provider for chain ID ${chainId} not found.`);
    }
    return provider;
  }

  // Initialize a Wormhole Bridge contract
  public getWormholeBridgeContract(chainId: number): Contract {
    const provider = this.getProvider(chainId);
    return new Contract(WormholeBridgeAddress, WormholeBridgeABI, provider);
  }

  // Initialize a Wormhole Relayer contract
  public getWormholeRelayerContract(chainId: number): Contract {
    const provider = this.getProvider(chainId);
    return new Contract(WormholeRelayerAddress, WormholeRelayerABI, provider);
  }

  // Send a cross-chain message via Wormhole
  public async sendMessage(
    fromChainId: number,
    toChainId: number,
    message: string,
    nonce: number
  ): Promise<providers.TransactionResponse> {
    try {
      const bridgeContract = this.getWormholeBridgeContract(fromChainId).connect(this.wallet);
      
      // Convert message to bytes
      const messageBytes = utils.formatBytes32String(message);
      
      // Example sending message function
      const tx = await bridgeContract.sendMessage(toChainId, messageBytes, nonce);
      return tx;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Handle incoming cross-chain messages
  public async handleMessage(chainId: number, messageId: string): Promise<void> {
    try {
      const relayerContract = this.getWormholeRelayerContract(chainId).connect(this.wallet);
      
      // Example receiving message function
      const message = await relayerContract.getMessage(messageId);
      
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

  // Utility function to convert a string message to bytes32
  public stringToBytes32(message: string): string {
    return utils.formatBytes32String(message);
  }

  // Utility function to convert bytes32 to a string message
  public bytes32ToString(bytes32: string): string {
    return utils.parseBytes32String(bytes32);
  }
}

// Usage Example
const chainProviders = {
  1: new providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
  137: new providers.JsonRpcProvider('https://polygon-rpc.com/'), // Example for Polygon
  // Add more chains as needed
};

const wallet = new Wallet('YOUR_PRIVATE_KEY');

const wormholeUtils = new WormholeUtils({
  providers: chainProviders,
  defaultChainId: 1,
  wallet
});

// Example usage
async function exampleUsage() {
  try {
    // Send a message from Ethereum (chain ID 1) to Polygon (chain ID 137)
    const txResponse = await wormholeUtils.sendMessage(1, 137, 'Hello from Ethereum!', 12345);
    console.log('Message sent:', txResponse);

    // Handle incoming messages on Polygon
    await wormholeUtils.handleMessage(137, '0xMessageId');
  } catch (error) {
    console.error('Error during example usage:', error);
  }
}

exampleUsage();
