const Token = artifacts.require("Token");
const Staking = artifacts.require("Staking");
const FileStorage = artifacts.require("FileStorage");

module.exports = async function (deployer, network, accounts) {
  // Deploy the Token contract
  console.log("Deploying Token contract...");
  await deployer.deploy(Token);
  const tokenInstance = await Token.deployed();
  console.log("Token contract deployed at address:", tokenInstance.address);

  // Deploy the Staking contract with the Token contract address and fee address (using the first account for fee address)
  console.log("Deploying Staking contract...");
  await deployer.deploy(Staking, tokenInstance.address, accounts[0]);
  const stakingInstance = await Staking.deployed();
  console.log("Staking contract deployed at address:", stakingInstance.address);

  // Deploy the FileStorage contract
  console.log("Deploying FileStorage contract...");
  await deployer.deploy(FileStorage);
  const fileStorageInstance = await FileStorage.deployed();
  console.log("FileStorage contract deployed at address:", fileStorageInstance.address);
};
