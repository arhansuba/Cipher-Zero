import {
  Chain,
  GatewayTransfer,
  GatewayTransferDetails,
  Network,
  TokenId,
  Wormhole,
  amount,
  wormhole,
} from "@wormhole-foundation/sdk";

// Import the platform-specific packages
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";

import { SignerStuff, getSigner } from "../helpers/helpers"; // Updated import


(async function () {
  try {
    // Init Wormhole object, passing config for which network to use (e.g., Mainnet/Testnet) and what Platforms to support
    const wh = await wormhole("Mainnet", [evm, solana, cosmwasm]);

    // Grab chain contexts for each leg of our journey
    const external = wh.getChain("Solana");
    const cosmos1 = wh.getChain("Dymension");
    const cosmos2 = wh.getChain("Injective");

    // Get signer from local key; anything that implements Signer interface should work
    const leg1 = await getSigner(external);
    const leg2 = await getSigner(cosmos1);
    const leg3 = await getSigner(cosmos2);

    // Use the native token on the source chain
    const token: TokenId = Wormhole.tokenId(external.chain, "native");
    const amt = amount.units(amount.parse("0.001", external.config.nativeTokenDecimals));

    // Transfer native token from source chain, through gateway, to a Cosmos chain
    let route1 = await transferIntoCosmos(wh, token, amt, leg1, leg2);
    console.log("Route 1 (External => Cosmos):", route1);

    // Lookup the Gateway representation of the wrapped token
    const { denom } = route1.ibcTransfers![0]!.data;
    const cosmosTokenAddress = Wormhole.parseAddress("Wormchain", denom);

    // Transfer Gateway factory tokens over IBC through gateway to another Cosmos chain
    let route2 = await transferBetweenCosmos(wh, { chain: cosmos1.chain, address: cosmosTokenAddress }, 1000n, leg2, leg3);
    console.log("Route 2 (Cosmos -> Cosmos):", route2);

    // Transfer Gateway factory token through gateway back to source chain
    let route3 = await transferOutOfCosmos(wh, { chain: cosmos2.chain, address: cosmosTokenAddress }, 1000n, leg3, leg1);
    console.log("Route 3 (Cosmos => External):", route3);

  } catch (error) {
    console.error('Error in Cosmos transfer process:', error);
  }
})();

async function transferIntoCosmos(
  wh: Wormhole<Network>,
  token: TokenId,
  amount: bigint,
  src: SignerStuff<Network, Chain>,
  dst: SignerStuff<Network, Chain>
): Promise<GatewayTransfer<Network>> {
  try {
    console.log(
      `Beginning transfer into Cosmos from ${src.chain.chain}:${src.address.address.toString()} to ${
        dst.chain.chain
      }:${dst.address.address.toString()}`
    );

    const xfer = await GatewayTransfer.from(wh, {
      token: token,
      amount: amount,
      from: src.address,
      to: dst.address,
    } as GatewayTransferDetails);
    console.log("Created GatewayTransfer:", xfer.transfer);

    const srcTxIds = await xfer.initiateTransfer(src.signer);
    console.log("Started transfer on source chain", srcTxIds);

    const attests = await xfer.fetchAttestation(600_000);
    console.log("Got Attestations", attests);

    return xfer;
  } catch (error) {
    console.error('Error during transferIntoCosmos:', error);
    throw error;
  }
}

export async function transferBetweenCosmos<N extends Network>(
  wh: Wormhole<N>,
  token: TokenId,
  amount: bigint,
  src: SignerStuff<N, Chain>,
  dst: SignerStuff<N, Chain>
): Promise<GatewayTransfer<N>> {
  try {
    console.log(
      `Beginning transfer within cosmos from ${
        src.chain.chain
      }:${src.address.address.toString()} to ${dst.chain.chain}:${dst.address.address.toString()}`
    );

    const xfer = await GatewayTransfer.from(wh, {
      token: token,
      amount: amount,
      from: src.address,
      to: dst.address,
    } as GatewayTransferDetails);
    console.log("Created GatewayTransfer:", xfer.transfer);

    const srcTxIds = await xfer.initiateTransfer(src.signer);
    console.log("Started transfer on source chain", srcTxIds);

    const attests = await xfer.fetchAttestation(60_000);
    console.log("Got attests:", attests);

    return xfer;
  } catch (error) {
    console.error('Error during transferBetweenCosmos:', error);
    throw error;
  }
}

export async function transferOutOfCosmos<N extends Network>(
  wh: Wormhole<N>,
  token: TokenId,
  amount: bigint,
  src: SignerStuff<N, Chain>,
  dst: SignerStuff<N, Chain>
): Promise<GatewayTransfer<N>> {
  try {
    console.log(
      `Beginning transfer out of cosmos from ${
        src.chain.chain
      }:${src.address.address.toString()} to ${dst.chain.chain}:${dst.address.address.toString()}`
    );

    const xfer = await GatewayTransfer.from(wh, {
      token: token,
      amount: amount,
      from: src.address,
      to: dst.address,
    } as GatewayTransferDetails);
    console.log("Created GatewayTransfer:", xfer.transfer);

    const srcTxIds = await xfer.initiateTransfer(src.signer);
    console.log("Started transfer on source chain", srcTxIds);

    const attests = await xfer.fetchAttestation(600_000);
    console.log("Got attests", attests);

    // Since we're leaving Cosmos, this is required to complete the transfer
    const dstTxIds = await xfer.completeTransfer(dst.signer);
    console.log("Completed transfer on destination chain", dstTxIds);

    return xfer;
  } catch (error) {
    console.error('Error during transferOutOfCosmos:', error);
    throw error;
  }
}
