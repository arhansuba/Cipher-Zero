import {
  AttestationReceipt,
  Chain,
  Network,
  ProtocolName,
  TransferReceipt,
  TransferState,
  Wormhole,
  circle,
  routes,
  wormhole,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";

import { getSigner } from "../helpers/index.js";

(async function () {
  try {
    // Initialize Wormhole SDK for Testnet
    const wh = await wormhole("Testnet", [evm, solana]);

    // Get chain contexts and signers
    const sendChain = wh.getChain("Avalanche");
    const rcvChain = wh.getChain("Polygon");
    const sender = await getSigner(sendChain);
    const receiver = await getSigner(rcvChain);

    // Create resolver with CCTP routes
    const resolver = wh.resolver([
      routes.CCTPRoute,
      routes.AutomaticCCTPRoute,
    ]);

    // Helper function to get USDC address
    const usdcAddress = (network: Network, chain: Chain) =>
      Wormhole.chainAddress(chain, circle.usdcContract.get(network, chain)!);

    const srcUsdc = usdcAddress(sendChain.network, sendChain.chain);
    const dstUsdc = usdcAddress(rcvChain.network, rcvChain.chain);

    // Create a transfer request
    const tr = await routes.RouteTransferRequest.create(wh, {
      from: sender.address,
      to: receiver.address,
      source: srcUsdc,
      destination: dstUsdc,
    });

    // Find possible routes for the transfer request
    const foundRoutes = await resolver.findRoutes(tr);
    console.log("Found routes:", foundRoutes);

    // Select the best route (pop the last route from the list)
    const bestRoute = foundRoutes.pop()!;
    console.log("Selected route:", bestRoute);

    // Define transfer parameters
    const transferParams = { amount: "1.5" };

    // Validate the transfer parameters
    const validated = await bestRoute.validate(transferParams);
    if (!validated.valid) throw validated.error;
    console.log("Validated parameters:", validated);

    // Get a quote for the transfer
    const quote = await bestRoute.quote(validated.params);
    if (!quote.success) throw quote.error;
    console.log("Transfer quote:", quote);

    // Initiate the transfer
    const receipt = await bestRoute.initiate(sender.signer, quote);
    console.log("Initiated transfer with receipt:", receipt);

    // Track the transfer until it is completed
    const checkAndComplete = async (receipt: TransferReceipt<AttestationReceipt<ProtocolName>>) => {
      console.log("Checking transfer state...");
      for await (receipt of bestRoute.track(receipt, 120 * 1000)) {
        console.log("Transfer State:", TransferState[receipt.state]);

        // Check if the transfer has reached the final state
        if (receipt.state >= TransferState.DestinationFinalized) return;

        // Complete the transfer if it's in the attested state and route requires manual completion
        if (receipt.state === TransferState.Attested) {
          if (routes.isManual(bestRoute)) {
            const completedTxids = await bestRoute.complete(receiver.signer, receipt);
            console.log("Completed transfer with txids:", completedTxids);
            return;
          }
        }

        // Wait and retry if not completed
        const wait = 2 * 1000;
        console.log(`Transfer not complete, retrying in ${wait}ms...`);
        setTimeout(() => checkAndComplete(receipt), wait);
      }
    };

    await checkAndComplete(receipt);

  } catch (error) {
    console.error("Error processing transfer:", error);
  }
})();
