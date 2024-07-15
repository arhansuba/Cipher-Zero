// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;


import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./_setupRole.sol";
/**
 * @title DID
 * @dev This contract manages Decentralized Identifiers (DIDs) and their associated identities.
 */
contract DID is AccessControl {
    using ECDSA for bytes32;
    using Strings for string;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Event emitted when a DID is created
    event DIDCreated(string did, address owner);

    // Event emitted when a DID is updated
    event DIDUpdated(string did, address owner);

    // Mapping from DID to the owner address
    mapping(string => address) private _didOwners;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Create a new DID and associate it with the caller's address.
     * @param did The DID to create.
     */
    function createDID(string calldata did) external {
        require(!_exists(did), "DID: DID already exists");
        _didOwners[did] = msg.sender;
        emit DIDCreated(did, msg.sender);
    }

    /**
     * @dev Update the owner of an existing DID.
     * @param did The DID to update.
     * @param newOwner The new owner address.
     */
    function updateDID(string calldata did, address newOwner) external {
        require(_exists(did), "DID: DID does not exist");
        require(_didOwners[did] == msg.sender, "DID: Only the current owner can update");
        _didOwners[did] = newOwner;
        emit DIDUpdated(did, newOwner);
    }

    /**
     * @dev Retrieve the owner of a DID.
     * @param did The DID to query.
     * @return The address of the DID owner.
     */
    function getDIDOwner(string calldata did) external view returns (address) {
        require(_exists(did), "DID: DID does not exist");
        return _didOwners[did];
    }

    /**
     * @dev Check if a DID exists.
     * @param did The DID to check.
     * @return True if the DID exists, false otherwise.
     */
    function _exists(string calldata did) internal view returns (bool) {
        return _didOwners[did] != address(0);
    }

    /**
     * @dev Grant the admin role to a new account.
     * @param account The account to grant the admin role to.
     */
    function grantAdminRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, account);
    }

    /**
     * @dev Revoke the admin role from an account.
     * @param account The account to revoke the admin role from.
     */
    function revokeAdminRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, account);
    }

    /**
     * @dev Check if an account has the admin role.
     * @param account The account to check.
     * @return True if the account has the admin role, false otherwise.
     */
    function hasAdminRole(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }
}
