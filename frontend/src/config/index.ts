// config/index.ts

import { networkConfigs as thetaNetworkConfigs, getProvider as getThetaProvider, getWallet as getThetaWallet, getExplorerUrl as getThetaExplorerUrl } from './theta.config.js';
import { networkConfigs as zksyncNetworkConfigs, getProvider as getZkSyncProvider, getWallet as getZkSyncWallet, getExplorerUrl as getZkSyncExplorerUrl } from './zksync.config.ts';

// Export all network configurations and utility functions
export const config = {
    theta: {
        networkConfigs: thetaNetworkConfigs,
        getProvider: getThetaProvider,
        getWallet: getThetaWallet,
        getExplorerUrl: getThetaExplorerUrl,
    },
    zksync: {
        networkConfigs: zksyncNetworkConfigs,
        getProvider: getZkSyncProvider,
        getWallet: getZkSyncWallet,
        getExplorerUrl: getZkSyncExplorerUrl,
    },
};

// Export types if necessary
export type { NetworkConfig } from './config'; // Ensure `config.ts` is defined with appropriate types
export type { ProjectSettings } from './config';
export type { ApiConfig } from './config';
export type { ContractConfig } from './config';

// Optionally, you can add additional utility functions or configurations here
