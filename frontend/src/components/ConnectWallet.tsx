import { FC, useEffect } from "react";
import { useWallet } from "@thetablockchain/wallet-adapter-react";
import { useWalletModal } from "@theta-blockchain/wallet-adapter-react";
import React from "react";

type Props = {
  onUseWalletClick: () => void;
};

export const ConnectWallet: FC<Props> = ({
  onUseWalletClick,
}) => {
  const { setVisible } = useWalletModal();
  const { wallet, connect, connecting, publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey && wallet) {
      try {
        connect();
      } catch (error) {
        console.log("Error connecting to the wallet: ", (error as any).message);
      }
    }
  }, [wallet]);

  const handleWalletClick = () => {
    try {
      if (!wallet) {
        setVisible(true);
      } else {
        connect();
      }
      onUseWalletClick();
    } catch (error) {
      console.log("Error connecting to the wallet: ", (error as any).message);
    }
  };

  return (
    <button
      className="btn btn-primary btn-lg"
      onClick={handleWalletClick}
      disabled={connecting}
    >
      {publicKey ? <div>Use Wallet Address</div> : <div>Connect Wallet</div>}
    </button>
  );
};