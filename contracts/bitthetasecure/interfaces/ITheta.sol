// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface ITheta {
    function uploadVideo(string calldata videoHash) external;
    function getVideos(address user) external view returns (string[] memory);
}
