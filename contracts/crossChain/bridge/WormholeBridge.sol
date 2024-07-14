// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@wormhole-foundation/eth-sdk/contracts/bridge/IWormhole.sol";
import "@wormhole-foundation/eth-sdk/contracts/bridge/WormholeBridge.sol";

/**
 * @title WormholeBridge
 * @dev A contract to handle token bridging using the Wormhole protocol.
 */
contract WormholeBridge is AccessControl, Pausable {
    using SafeMath for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IWormhole public wormhole;
    address public wormholeTokenBridge;

    event TokensBridged(address indexed token, address indexed from, uint256 amount, uint16 destinationChainId, address destinationAddress);

    constructor(address _wormhole, address _wormholeTokenBridge) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);

        wormhole = IWormhole(_wormhole);
        wormholeTokenBridge = _wormholeTokenBridge;
    }

    function bridgeTokens(address token, uint256 amount, uint16 destinationChainId, address destinationAddress) external whenNotPaused {
        require(IERC20(token).balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Transfer tokens from the sender to this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // Prepare Wormhole message
        WormholeBridge.Message memory message = WormholeBridge.Message({
            token: token,
            amount: amount,
            destinationChainId: destinationChainId,
            destinationAddress: destinationAddress
        });

        // Send message to Wormhole
        wormholeTokenBridge.sendMessage(message);

        emit TokensBridged(token, msg.sender, amount, destinationChainId, destinationAddress);
    }

    function receiveTokens(address token, uint256 amount, address recipient) external onlyRole(ADMIN_ROLE) {
        // Mint or release tokens to the recipient
        IERC20(token).transfer(recipient, amount);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
