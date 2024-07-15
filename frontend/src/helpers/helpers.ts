import {
  ChainAddress,
  ChainContext,
  DEFAULT_TASK_TIMEOUT,
  Network,
  Signer,
  TokenTransfer,
  TransferState,
  TxHash,
  Wormhole,
  Chain,
  api,
  tasks,
} from "@wormhole-foundation/sdk";
import algorand from "@wormhole-foundation/sdk/algorand";
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import sui from "@wormhole-foundation/sdk/sui";
import { ethers } from 'ethers';
import BridgeGetters from '../contracts/build/contracts/BridgeGetters.json'; // Adjust path as needed

// Use .env.example as a template for your .env file and populate it with secrets
// for funded accounts on the relevant chain+network combos to run the example

function getEnv(key: string): string {
  if (typeof process === 'undefined') return ""; // Browser environment

  const val = process.env[key];
  if (!val) throw new Error(`Missing env var ${key}, did you forget to set values in '.env'?`);

  return val;
}

export interface SignerStuff<N extends Network, C extends Chain> {
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}

export async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>,
): Promise<SignerStuff<N, C>> {
  (await import("dotenv")).config();

  let signer: Signer;
  const platform = chain.platform.utils()._platform;
  switch (platform) {
      case "Solana":
          signer = await (
              await solana()
          ).getSigner(await chain.getRpc(), getEnv("SOL_PRIVATE_KEY"), {
              debug: true,
          });
          break;
      case "Cosmwasm":
          signer = await (await cosmwasm()).getSigner(await chain.getRpc(), getEnv("COSMOS_MNEMONIC"));
          break;
      case "Evm":
          signer = await (await evm()).getSigner(await chain.getRpc(), getEnv("ETH_PRIVATE_KEY"));
          break;
      case "Algorand":
          signer = await (
              await algorand()
          ).getSigner(await chain.getRpc(), getEnv("ALGORAND_MNEMONIC"));
          break;
      case "Sui":
          signer = await (await sui()).getSigner(await chain.getRpc(), getEnv("SUI_PRIVATE_KEY"));
          break;
      default:
          throw new Error("Unrecognized platform: " + platform);
  }

  return {
      chain,
      signer: signer as Signer<N, C>,
      address: Wormhole.chainAddress(chain.chain, signer.address()),
  };
}

export async function waitLog<N extends Network = Network>(
  wh: Wormhole<N>,
  xfer: TokenTransfer<N>,
  tag: string = "WaitLog",
  timeout: number = DEFAULT_TASK_TIMEOUT,
) {
  const tracker = TokenTransfer.track(wh, TokenTransfer.getReceipt(xfer), timeout);
  let receipt;
  for await (receipt of tracker) {
      console.log(`${tag}: Current transfer state: `, TransferState[receipt.state]);
  }
  return receipt;
}

export async function waitForRelay(txid: TxHash): Promise<api.RelayData | null> {
  const relayerApi = "https://relayer.dev.stable.io";
  const task = () => api.getRelayStatus(relayerApi, txid);
  return tasks.retry<api.RelayData>(task, 5000, 60 * 1000, "Wormhole:GetRelayStatus");
}

// Ethereum Contract Interaction
const ETH_CONTRACT_ADDRESS = "0xYourContractAddress"; // Replace with your contract address
const ETH_PROVIDER = new Provider.Web3Provider((window as any)?.ethereum);
const ETH_SIGNER = ETH_PROVIDER.getSigner();
const ETH_CONTRACT = new ethers.Contract(ETH_CONTRACT_ADDRESS, BridgeGetters.abi, ETH_SIGNER);

export async function deployEthContract(): Promise<string> {
  // Replace with actual contract deployment logic
  const factory = new ethers.ContractFactory(BridgeGetters.abi, BridgeGetters.bytecode, ETH_SIGNER);
  const contract = await factory.deploy() as ethers.Contract & { address: string };
  await contract.deployed();
  return contract.address;
}

export async function getEthContractData(): Promise<any> {
  // Replace with actual method call
  return await ETH_CONTRACT.getSomeData(); // Ensure method exists in your contract
}

export async function sendEthTransaction(to: string, value: ethers.BigNumberish): Promise<ethers.ContractEvent> {
  const tx = await ETH_SIGNER.sendTransaction({ to, value });
  const receipt = await tx.wait();
  return receipt;
}
