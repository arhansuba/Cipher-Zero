import { Wormhole, canonicalAddress, routes, wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import { getSigner } from "../helpers/index.js";

// Initialize and configure Wormhole
export async function initializeWormhole() {
  return await wormhole("Mainnet", [evm, solana]);
}

// Define a function to handle token transfers
export async function handleTokenTransfer() {
  const wh = await initializeWormhole();

  const sendChain = wh.getChain("Base");
  const destChain = wh.getChain("Arbitrum");

  const sender = await getSigner(sendChain);
  const receiver = await getSigner(destChain);

  const sendToken = Wormhole.tokenId(sendChain.chain, "native");

  const resolver = wh.resolver([
    routes.TokenBridgeRoute,
    routes.AutomaticTokenBridgeRoute,
    routes.CCTPRoute,
    routes.AutomaticCCTPRoute,
    routes.AutomaticPorticoRoute,
  ]);

  const srcTokens = await resolver.supportedSourceTokens(sendChain);
  console.log("Allowed source tokens:", srcTokens.map((t) => canonicalAddress(t)));

  const destTokens = await resolver.supportedDestinationTokens(sendToken, sendChain, destChain);
  console.log("Receivable tokens on destination chain:", destTokens.map((t) => canonicalAddress(t)));

  const transferToken = destTokens.pop()!;
  const tr = await routes.RouteTransferRequest.create(wh, {
    from: sender.address,
    to: receiver.address,
    source: sendToken,
    destination: transferToken,
  });

  const foundRoutes = await resolver.findRoutes(tr);
  console.log("Found routes for transfer request:", foundRoutes);

  const bestRoute = foundRoutes[0]!;
  console.log("Selected route:", bestRoute);

  console.log("Default options for route:", bestRoute.getDefaultOptions());
  const amt = "0.5";
  const transferParams = { amount: amt, options: { nativeGas: 0.1 } };

  const validated = await bestRoute.validate(transferParams);
  if (!validated.valid) throw validated.error;
  console.log("Validated parameters:", validated.params);

  const quote = await bestRoute.quote(validated.params);
  if (!quote.success) throw quote.error;
  console.log("Best route quote:", quote);

  const imSure = false;
  if (imSure) {
    const receipt = await bestRoute.initiate(sender.signer, quote, receiver.signer);
    console.log("Initiated transfer with receipt:", receipt);

    await routes.checkAndCompleteTransfer(bestRoute, receipt, receiver.signer);
  }
}
