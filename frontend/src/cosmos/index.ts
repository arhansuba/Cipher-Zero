// src/cosmos/index.ts

// Export the functions related to Cosmos transfers
export * from './cosmos';

// Optionally, you might want to export any additional configurations or utilities
// related to Cosmos integration.

import { transferOutOfCosmos, transferBetweenCosmos } from './cosmos';

// You might want to create a more organized export for ease of use elsewhere
export const CosmosUtils = {
  transferOutOfCosmos,
  transferBetweenCosmos,
};

// Optionally, export any constants or configurations
export { cosmosNetworks } from './cosmosConfig';

// If you have types or interfaces to export
export type { SignerStuff } from '../helpers/helpers'; // Adjust import path as necessary
export type { Network, Chain } from '@wormhole-foundation/sdk';
