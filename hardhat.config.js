require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: {
    version: "0.8.21", // Kullanmak istediğiniz Solidity sürümünü buraya girin
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    }
  },
  etherscan: {
    // Etherscan API anahtarını buraya ekleyebilirsiniz (isteğe bağlı)
  }
};
