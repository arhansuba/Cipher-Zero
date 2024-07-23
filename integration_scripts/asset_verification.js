// integration_scripts/asset_verification.js

const { ethers } = require("ethers");

// Replace with your contract ABI and address
const realWorldAssetAbi = [
    // Add the ABI of your RealWorldAsset contract here
];
const realWorldAssetAddress = "0xYourRealWorldAssetContractAddress";

// Set up provider and signer
const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
const contract = new ethers.Contract(realWorldAssetAddress, realWorldAssetAbi, wallet);

async function main() {
    // Example function calls

    // Verify asset
    const assetId = "1"; // Replace with actual asset ID
    const assetDetails = await contract.verifyAsset(assetId);
    console.log("Asset Details:", assetDetails);

    // Verify multiple assets
    const assetIds = ["1", "2", "3"]; // Replace with actual asset IDs
    const assetDetailsList = await Promise.all(assetIds.map(id => contract.verifyAsset(id)));
    console.log("Asset Details List:", assetDetailsList);

    // Check asset ownership
    const owner = await contract.getAssetOwner(assetId);
    console.log("Asset Owner:", owner);
}

main().catch(console.error);
