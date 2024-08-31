import {
    LightSystemProgram,
    Rpc,
    confirmTx,
    createRpc,
  } from "@lightprotocol/stateless.js";
  import { createMint, mintTo, transfer } from "@lightprotocol/compressed-token";
  import { Keypair } from "@solana/web3.js";
  
  const payer = Keypair.generate();
  const tokenRecipient = Keypair.generate();
  
  /// Helius exposes Solana and compression RPC endpoints through a single URL
  const RPC_ENDPOINT = "https://devnet.helius-rpc.com?api-key=<api_key>";
  const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
  const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT)
// Create a connection instance using the Stateless RPC library
//const connection = StatelessRpc.createRpc(RPC_ENDPOINT, RPC_ENDPOINT);

/**
 * Retrieves the current blockchain slot.
 * @returns The current slot number as a Promise.
 * @throws Error if the slot retrieval fails.
 */
export const getSlot = async (): Promise<number> => {
    try {
        const slot = await connection.getSlot();
        console.log(`Current Slot: ${slot}`);
        return slot;
    } catch (error) {
        console.error('Failed to retrieve slot:', error);
        throw new Error('Slot retrieval failed');
    }
};

/**
 * Retrieves the health status of the indexer for a specific slot.
 * @param slot - The slot number for which to check the indexer health.
 * @returns The health status as a Promise.
 * @throws Error if the indexer health check fails.
 */
export const getIndexerHealth = async (): Promise<string> => {
    try {
        const health = await connection.getIndexerHealth();
        console.log(`Indexer Health: ${health}`);
        return health;
    } catch (error) {
        console.error('Failed to retrieve indexer health:', error);
        throw new Error('Indexer health check failed');
    }
};

/**
 * Main function to demonstrate retrieving slot and indexer health.
 */
const main = async () => {
    try {
        const slot = await getSlot();
        await getIndexerHealth();
    } catch (error) {
        console.error('Error in main execution:', error);
    }
};

main();
