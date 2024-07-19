// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract LiveStreaming {
    event StreamStarted(address indexed user, string streamKey);
    event StreamStopped(address indexed user, string streamKey);

    function startStream(string memory streamKey) external {
        // Logic to start streaming using Theta’s infrastructure
        emit StreamStarted(msg.sender, streamKey);
    }

    function stopStream(string memory streamKey) external {
        // Logic to stop streaming
        emit StreamStopped(msg.sender, streamKey);
    }
}
