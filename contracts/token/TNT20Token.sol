// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.26;


import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract TNT20 is ERC20, AccessControl, Pausable {
    using Math for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    event UpdateAdmin(address indexed newAdmin);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    address public admin;
    uint256 public mintingCap;

    constructor(
        string memory name,
        string memory symbol,
        address initDistrWallet,
        uint256 initMintAmount,
        address adminAddr,
        uint256 cap
    ) ERC20(name, symbol) {
        _mint(initDistrWallet, initMintAmount);
        admin = adminAddr;
        mintingCap = cap;
        _grantRole(DEFAULT_ADMIN_ROLE, adminAddr);
        _grantRole(MINTER_ROLE, adminAddr);
        _grantRole(BURNER_ROLE, adminAddr);
        emit UpdateAdmin(admin);
    }

    /**
     * @dev Allows admin to update the admin address.
     * @param newAdmin The new admin address.
     */
    function updateAdmin(address newAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        admin = newAdmin;
        _grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        emit UpdateAdmin(newAdmin);
    }

    /**
     * @dev Allows minter to mint new tokens up to the cap.
     * @param receiver The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address receiver, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(Math.add(totalSupply(), amount) <= mintingCap, "TNT20: Minting cap exceeded");
        _mint(receiver, amount);
        emit Mint(receiver, amount);
    }

    /**
     * @dev Allows burner to burn tokens from their own account.
     * @param amount The amount of tokens to burn.
     */
    function burn(uint256 amount) external onlyRole(BURNER_ROLE) whenNotPaused {
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    /**
     * @dev Pauses the contract, preventing minting and burning.
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpauses the contract, resuming normal operations.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Allows the admin to set a new minting cap.
     * @param cap The new minting cap.
     */
    function setMintingCap(uint256 cap) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mintingCap = cap;
    }
}
