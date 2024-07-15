// src/context/ClientWalletProvider.tsx

import React, { useMemo } from 'react';
import { WalletProvider, WalletProviderProps } from "@theta-rpc/wallet-adapter-react";
import { WalletModalProvider } from "@theta-rpc/wallet-adapter-react-ui";
import {
    getThetaWallet,
    getThetaKeystoreWallet,
    getThetaLedgerWallet,
} from '@theta-rpc/wallet-adapter-wallets';

import '@theta-rpc/wallet-adapter-react-ui/styles.css';

// Define the ClientWalletProvider component
export function ClientWalletProvider(
    props: Omit<WalletProviderProps, "wallets">
): JSX.Element {
    // Memoize the wallets array to avoid unnecessary re-renders
    const wallets = useMemo(
        () => [
            getThetaWallet(),
            getThetaKeystoreWallet(),
            getThetaLedgerWallet(),
        ],
        []
    );

    return (
        <WalletProvider wallets={wallets} {...props}>
            <WalletModalProvider>
                {props.children}
            </WalletModalProvider>
        </WalletProvider>
    );
}

// Export the component as default
export default ClientWalletProvider;
