const BridgeGetters = artifacts.require("BridgeGetters");

module.exports = async function (callback) {
  const bridgeGetters = await BridgeGetters.deployed();

  // Call functions or send transactions to the deployed contract
  const result = await bridgeGetters.someFunction();
  console.log(result);

  callback();
};
