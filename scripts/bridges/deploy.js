const WormholeBridge = artifacts.require("WormholeBridge");

module.exports = async function(deployer) {
  const wormholeAddress = process.env.WORMHOLE_ADDRESS;
  const tokenAddress = process.env.TOKEN_ADDRESS;

  await deployer.deploy(WormholeBridge, wormholeAddress, tokenAddress);
};
