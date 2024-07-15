// zksyncconfig.js

const { Network, Provider, Wallet } = require('zksync');
const { ethers } = require('ethers');

// Define a type for zkSync network configurations
const networkConfigs = {
    mainnet: {
        network: Network.Mainnet,
        providerUrl: 'https://zksync2-mainnet.zksync.io',
        explorerUrl: 'https://zkscan.io',
        contractAddresses: {
            // Define contract addresses specific to zkSync mainnet if needed
            // Example:
            // zkSyncContractAddress: '0xYourZkSyncMainnetContractAddress',
        },
    },
    testnet: {
        network: Network.Testnet,
        providerUrl: 'https://zksync2-testnet.zksync.dev',
        explorerUrl: 'https://zkscan.io/testnet',
        contractAddresses: {
            // Define contract addresses specific to zkSync testnet if needed
            // Example:
            // zkSyncContractAddress: '0xYourZkSyncTestnetContractAddress',
        },
    },
};

// Function to get zkSync provider based on environment
const getProvider = (network = 'testnet') => {
    if (!networkConfigs[network]) {
        throw new Error(`Network configuration for ${network} not found.`);
    }
    return new Provider(networkConfigs[network].providerUrl);
};

// Function to create a zkSync wallet instance
const getWallet = (privateKey, network = 'testnet') => {
    if (!networkConfigs[network]) {
        throw new Error(`Network configuration for ${network} not found.`);
    }
    const provider = getProvider(network);
    return new Wallet(privateKey, provider);
};

// Function to get zkSync network explorer URL
const getExplorerUrl = (network = 'testnet') => {
    if (!networkConfigs[network]) {
        throw new Error(`Network configuration for ${network} not found.`);
    }
    return networkConfigs[network].explorerUrl;
};

// Export configurations and utility functions
module.exports = {
    networkConfigs,
    getProvider,
    getWallet,
    getExplorerUrl,
};

// Export types if using TypeScript
// export type { NetworkConfig } from './types'; // Define appropriate types in a types file if using TypeScript
// Define your types and configurations here
//export const networkConfigs = {
    // Your network configuration
//};

// Remove the redeclaration of getProvider
//export function getProvider(network: string) {
    // Your implementation here
//}

// Remove the redeclaration of getExplorerUrl
// export const getExplorerUrl = (network?: string) => {
//     // Your implementation here
// };