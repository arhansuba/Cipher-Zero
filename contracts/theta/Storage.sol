// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;


interface IStorage {
    function storeFile(bytes32 fileHash, string calldata fileUri) external;
    function retrieveFile(bytes32 fileHash) external view returns (string memory fileUri);
}
