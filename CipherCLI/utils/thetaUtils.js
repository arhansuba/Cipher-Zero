const thetajs = require("@thetalabs/theta-js");
const { ThetaWallet, ThetaToken, ThetaContract } = require(thetajs);
const Web3 = require('web3');

// Initialize Web3 with Theta Network RPC
//const web3 = new Web3('https://your-theta-network-rpc-url');
const axios = require('axios');

// Theta Node RPC URL (default port 16888)
const THETA_RPC_URL = 'http://localhost:16888/rpc';

// Helper function to make RPC requests
const rpcRequest = async (method, params = [], id = 1) => {
    try {
        const response = await axios.post(THETA_RPC_URL, {
            jsonrpc: '2.0',
            method,
            params,
            id,
        });
        return response.data;
    } catch (error) {
        console.error(`RPC request failed: ${error.message}`);
        throw error;
    }
};

// Get Theta Node Version
const getVersion = async () => {
    const result = await rpcRequest('theta.GetVersion');
    return result.result;
};

// Get Account Details
const getAccount = async (address) => {
    const result = await rpcRequest('theta.GetAccount', [{ address }]);
    return result.result;
};

// Get Block Details
const getBlock = async (hash, includeEthTxHashes = false) => {
    const result = await rpcRequest('theta.GetBlock', [{ hash, include_eth_tx_hashes: includeEthTxHashes }]);
    return result.result;
};

// Export functions for use in other parts of the project
module.exports = {
    getVersion,
    getAccount,
    getBlock,
};

// Load Theta Wallet
function loadWallet(privateKey) {
    return new ThetaWallet(web3, privateKey);
}

/**
 * Deploy a contract on the Theta Network.
 * @param {string} contractAbi - The ABI of the contract.
 * @param {string} contractBytecode - The bytecode of the contract.
 * @param {Object} constructorArgs - Arguments for the contract constructor.
 * @param {string} privateKey - The private key of the deployer.
 * @returns {Promise<string>} - The contract address.
 */
async function deployContract(contractAbi, contractBytecode, constructorArgs, privateKey) {
    const wallet = loadWallet(privateKey);
    const contract = new ThetaContract(contractAbi, contractBytecode, web3);

    const deployTx = contract.deploy({
        data: contractBytecode,
        arguments: constructorArgs
    });

    const signedTx = await wallet.signTransaction(deployTx);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Contract deployed at address: ${receipt.contractAddress}`);
    return receipt.contractAddress;
}

/**
 * Interact with a deployed contract.
 * @param {string} contractAddress - The address of the deployed contract.
 * @param {string} contractAbi - The ABI of the contract.
 * @param {string} privateKey - The private key of the caller.
 * @param {string} methodName - The name of the method to call.
 * @param {Array} args - Arguments for the method.
 * @returns {Promise<any>} - The result of the method call.
 */
async function interactWithContract(contractAddress, contractAbi, privateKey, methodName, args) {
    const wallet = loadWallet(privateKey);
    const contract = new ThetaContract(contractAbi, contractAddress, web3);

    const method = contract.methods[methodName](...args);
    const tx = method.encodeABI();

    const signedTx = await wallet.signTransaction({
        to: contractAddress,
        data: tx,
        gas: 2000000
    });

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

/**
 * Query the Theta Network for a contract's state.
 * @param {string} contractAddress - The address of the contract.
 * @param {string} contractAbi - The ABI of the contract.
 * @param {string} methodName - The method to call for querying state.
 * @param {Array} args - Arguments for the method.
 * @returns {Promise<any>} - The result of the query.
 */
async function queryContractState(contractAddress, contractAbi, methodName, args) {
    const contract = new ThetaContract(contractAbi, contractAddress, web3);
    const result = await contract.methods[methodName](...args).call();
    return result;
}

module.exports = {
    loadWallet,
    deployContract,
    interactWithContract,
    queryContractState
};
