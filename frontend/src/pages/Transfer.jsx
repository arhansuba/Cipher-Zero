import React from 'react';
import WormholeTransfer from '../components/WormholeTransfer';

const Transfer = ({ wormholeBridgeContract }) => {
  return (
    <div>
      <h2>Transfer Page</h2>
      <WormholeTransfer wormholeBridgeContract={wormholeBridgeContract} />
    </div>
  );
};

export default Transfer;
