// src/cosmos/cosmosConfig.ts

// import { CosmosConfig } from ".";

// import { CosmosConfig } from ".";

// Define the network configurations for Cosmos-related chains
const cosmosNetworks = {
    dymension: {
      chainId: 'dymension-1', // Replace with actual chain ID
      rpcUrl: 'https://rpc.dymension.network', // Replace with actual RPC URL
      restUrl: 'https://rest.dymension.network', // Replace with actual REST URL
    },
    injective: {
      chainId: 'injective-1', // Replace with actual chain ID
      rpcUrl: 'https://rpc.injective.network', // Replace with actual RPC URL
      restUrl: 'https://rest.injective.network', // Replace with actual REST URL
    },
    // Add additional Cosmos chains as needed
  };
  
  // Define configuration details for Wormhole integration
  const wormholeConfig = {
    // Define Wormhole-related settings, such as the Wormhole contract addresses
    wormholeAddress: '0xYourWormholeContractAddress', // Replace with actual Wormhole contract address
    tokenBridgeAddress: '0xYourTokenBridgeAddress', // Replace with actual Token Bridge contract address
    // Add additional configuration details as needed
  };
  
  // Export the configurations for use in other parts of the application
  export { cosmosNetworks, wormholeConfig };
  
  // Optionally, you can export any types or interfaces related to the configurations
  export interface CosmosNetworkConfig {
    chainId: string;
    rpcUrl: string;
    restUrl: string;
  }
  
  export interface WormholeConfig {
    wormholeAddress: string;
    tokenBridgeAddress: string;
  }
  