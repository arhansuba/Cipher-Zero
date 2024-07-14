const WormholeBridge = artifacts.require("WormholeBridge");
const BridgeGetters = artifacts.require("BridgeGetters");
const ITokenBridge = artifacts.require("ITokenBridge");
const IWormhole = artifacts.require("IWormhole");
const PortalWrappedToken = artifacts.require("PortalWrappedToken");
const Structs = artifacts.require("Structs");
const Treasury = artifacts.require("Treasury");
const Wormhole = artifacts.require("Wormhole");

module.exports = async function (deployer) {
  await deployer.deploy(BridgeGetters);
  await deployer.deploy(ITokenBridge);
  await deployer.deploy(IWormhole);
  await deployer.deploy(PortalWrappedToken);
  await deployer.deploy(Structs);
  await deployer.deploy(Treasury);
  await deployer.deploy(Wormhole);
};

module.exports = async function(deployer) {
  const wormholeAddress = process.env.WORMHOLE_ADDRESS;
  const tokenAddress = process.env.TOKEN_ADDRESS;

  await deployer.deploy(WormholeBridge, wormholeAddress, tokenAddress);
};
