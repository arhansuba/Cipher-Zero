// frontend/src/components/CrossChainBridge.ts

import React, { useState } from 'react';
import { Contract, providers, Wallet } from '@thetalabs/theta-js';
import { ethers } from 'ethers';
import { BridgeContractABI, BridgeContractAddress } from '../config/BridgeConfig';


// Define the type for the component props
interface CrossChainBridgeProps {
    thetaWallet: Wallet; // Wallet for Theta transactions
    otherWallet: ethers.Wallet; // Wallet for the other blockchain
}

const CrossChainBridge: React.FC<CrossChainBridgeProps> = ({ thetaWallet, otherWallet }) => {
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState<string | null>(null);

    // Initialize Theta provider and contract
    const thetaProvider = new providers.HttpProvider('https://theta-testnet.api.theta.network'); // Use mainnet URL in production
    const thetaBridgeContract = new Contract(BridgeContractAddress, BridgeContractABI, thetaProvider) as any;

    // Initialize Ethereum provider and contract
    const otherProvider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // Replace with actual provider
    const otherBridgeContract = new ethers.Contract(BridgeContractAddress, BridgeContractABI, otherProvider);

    // Handle amount change
    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(event.target.value));
    };

    // Function to initiate cross-chain transfer
    const initiateTransfer = async () => {
        if (amount <= 0) {
            setError('Amount must be greater than zero');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Transfer from Theta to the other blockchain
            const thetaTxData = {
                from: thetaWallet.address,
                to: BridgeContractAddress,
                data: thetaBridgeContract.interface.encodeFunctionData('transferToOtherChain', [amount]),
            };

            const thetaTx = await thetaWallet.sendTransaction(thetaTxData);
            await thetaTx.wait(); // Wait for the transaction to be mined

            // Transfer from the other blockchain
            const otherTx = await otherWallet.sendTransaction({
                to: BridgeContractAddress,
                value: ethers.utils.parseUnits(amount.toString(), 'ether'),
            });

            await otherTx.wait(); // Wait for the transaction to be mined

            setTransactionId(otherTx.hash);
            console.log('Cross-chain transfer completed successfully:', otherTx.hash);

        } catch (err) {
            setError('Failed to complete cross-chain transfer');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Amount to transfer"
            />
            <button onClick={initiateTransfer} disabled={loading}>
                {loading ? 'Processing...' : 'Initiate Transfer'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {transactionId && (
                <p>Transaction completed successfully. Transaction ID: {transactionId}</p>
            )}
        </div>
    );
};

export default CrossChainBridge;
