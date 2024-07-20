// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./interfaces/ITheta.sol";

contract ThetaIntegration is ITheta {
    mapping(address => string[]) private userVideos;

    function uploadVideo(string calldata videoHash) external override {
        userVideos[msg.sender].push(videoHash);
    }

    function getVideos(address user) external view override returns (string[] memory) {
        return userVideos[user];
    }
}
