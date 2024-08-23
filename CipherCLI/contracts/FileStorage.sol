// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {

    struct File {
        string fileName;
        string fileHash;
        string fileType;
        uint256 fileSize;
        address owner;
        uint256 uploadTime;
    }

    // Mapping to store files by their hash
    mapping(string => File) private files;
    // Mapping to store files owned by a user
    mapping(address => string[]) private userFiles;

    event FileUploaded(
        string fileName,
        string fileHash,
        string fileType,
        uint256 fileSize,
        address indexed owner,
        uint256 uploadTime
    );

    event FileRetrieved(
        string fileName,
        string fileHash,
        string fileType,
        uint256 fileSize,
        address indexed owner,
        uint256 uploadTime
    );

    // Upload a file
    function uploadFile(
        string memory _fileName,
        string memory _fileHash,
        string memory _fileType,
        uint256 _fileSize
    ) public {
        require(bytes(_fileHash).length > 0, "File hash is required");
        require(bytes(_fileType).length > 0, "File type is required");
        require(_fileSize > 0, "File size must be greater than zero");

        File memory newFile = File({
            fileName: _fileName,
            fileHash: _fileHash,
