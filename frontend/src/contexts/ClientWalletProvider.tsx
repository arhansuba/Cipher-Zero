import type { WalletProviderProps } from "@theta-rpc/wallet-adapter-react";
import { WalletProvider } from "@theta-rpc/wallet-adapter-react";
import {
    getThetaWallet,
    getThetaKeystoreWallet,
    getThetaLedgerWallet,
} from '@theta-rpc/wallet-adapter-wallets'
import { useMemo } from "react";
import { WalletModalProvider } from "@theta-rpc/wallet-adapter-react-ui";

import '@theta-rpc/wallet-adapter-react-ui/styles.css';
import React from "react";

export function ClientWalletProvider(
    props: Omit<WalletProviderProps, "wallets">
): JSX.Element {
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
            <WalletModalProvider {...props} />
        </WalletProvider>
    );
}

export default ClientWalletProvider;