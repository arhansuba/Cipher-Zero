// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract EcoFriendlyContract is Ownable {
    using SafeMath for uint256;

    // Event declarations
    event EcoFriendlyAction(address indexed account, string action, uint256 timestamp);

    // Structure to hold details about eco-friendly actions
    struct EcoAction {
        string action;
        uint256 timestamp;
    }

    // Mapping to track eco-friendly actions by account
    mapping(address => EcoAction[]) public ecoActions;

    // Function to record an eco-friendly action
    function recordEcoAction(string memory action) external {
        require(bytes(action).length > 0, "Action description cannot be empty");

        EcoAction memory newAction = EcoAction({
            action: action,
            timestamp: block.timestamp
        });

        ecoActions[msg.sender].push(newAction);
        emit EcoFriendlyAction(msg.sender, action, block.timestamp);
    }

    // Function to retrieve eco-friendly actions for an account
    function getEcoActions(address account) external view returns (EcoAction[] memory) {
        return ecoActions[account];
    }
}
