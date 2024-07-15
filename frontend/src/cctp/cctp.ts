import {
  Chain,
  CircleTransfer,
  Network,
  Signer,
  TransactionId,
  Wormhole,
  amount,
  wormhole,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";

import { SignerStuff, getSigner, waitForRelay } from "./helpers/helpers";

// Initialize Wormhole for the desired network and supported platforms
async function initializeWormhole(): Promise<Wormhole<Network>> {
  return wormhole("Testnet", [evm]); // Removed Solana from the platforms
}

// Perform CCTP transfer
export async function cctpTransfer<N extends Network>(
  wh: Wormhole<N>,
  src: SignerStuff<N, Chain>,
  dst: SignerStuff<N, Chain>,
  req: {
      amount: bigint;
      automatic: boolean;
      nativeGas?: bigint;
  }
): Promise<void> {
  try {
      const xfer = await wh.circleTransfer(
          req.amount,
          src.address,
          dst.address,
          req.automatic,
          undefined,
          req.nativeGas,
      );
      console.log("Transfer Initiated: ", xfer);

      const quote = await CircleTransfer.quoteTransfer(src.chain, dst.chain, xfer.transfer);
      console.log("Transfer Quote: ", quote);

      const srcTxids = await xfer.initiateTransfer(src.signer);
      console.log(`Transfer Started: `, srcTxids);

      if (req.automatic) {
          const relayStatus = await waitForRelay(srcTxids[srcTxids.length - 1]!);
          console.log(`Relay Completed: `, relayStatus);
      } else {
          console.log("Waiting for Attestation...");
          const attestIds = await xfer.fetchAttestation(60_000);
          console.log(`Attestation Received: `, attestIds);

          console.log("Completing Transfer...");
          const dstTxids = await xfer.completeTransfer(dst.signer);
          console.log(`Transfer Completed: `, dstTxids);
      }
  } catch (error) {
      console.error("Error during CCTP Transfer:", error);
  }
}

// Complete transfer using transaction ID
export async function completeTransfer(
  wh: Wormhole<Network>,
  txid: TransactionId,
  signer: Signer
): Promise<void> {
  try {
      const xfer = await CircleTransfer.from(wh, txid);

      const attestIds = await xfer.fetchAttestation(60 * 60 * 1000);
      console.log("Attestation Received: ", attestIds);

      const dstTxIds = await xfer.completeTransfer(signer);
      console.log("Transfer Completed: ", dstTxIds);
  } catch (error) {
      console.error("Error completing transfer:", error);
  }
}

// Main function to run the transfer
(async function main() {
  try {
      const wh = await initializeWormhole();
      const sendChain = wh.getChain("Avalanche");
      const rcvChain = wh.getChain("BaseSepolia");

      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      const amt = amount.units(amount.parse("0.2", 6));
      const automatic = false;
      const nativeGas = automatic ? amount.units(amount.parse("0.0", 6)) : 0n;

      await cctpTransfer(wh, source, destination, {
          amount: amt,
          automatic,
          nativeGas,
      });
  } catch (error) {
      console.error("Error in main function:", error);
  }
})();
