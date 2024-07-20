// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./Token.sol";
import "./Storage.sol";
import "./Messaging.sol";
import "./BitTorrentIntegration.sol";
import "./ThetaIntegration.sol";

contract BitThetaSecure {
    Token public token;
    Storage public storageContract;
    Messaging public messaging;
    BitTorrentIntegration public bitTorrent;
    ThetaIntegration public theta;

    event Deposit(address indexed sender, uint256 amount);

    constructor(address tokenAddress, address storageAddress, address messagingAddress, address bitTorrentAddress, address thetaAddress) {
        token = Token(tokenAddress);
        storageContract = Storage(storageAddress);
        messaging = Messaging(messagingAddress);
        bitTorrent = BitTorrentIntegration(bitTorrentAddress);
        theta = ThetaIntegration(thetaAddress);
    }

    receive() external payable {
        require(msg.value > 0, "No Ether sent");
        emit Deposit(msg.sender, msg.value);
    }

    fallback() external payable {
        require(msg.value > 0, "No Ether sent");
        emit Deposit(msg.sender, msg.value);
    }
}
