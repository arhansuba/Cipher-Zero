import React, { useState } from 'react';

const WormholeTransfer = ({ wormholeBridgeContract }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [nonce, setNonce] = useState(0);

  const handleTransfer = async () => {
    await wormholeBridgeContract.methods.transfer(amount, recipient, nonce).send();
  };

  return (
    <div>
      <h3>Wormhole Transfer</h3>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient" />
      <input type="number" value={nonce} onChange={(e) => setNonce(e.target.value)} placeholder="Nonce" />
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
};

export default WormholeTransfer;
