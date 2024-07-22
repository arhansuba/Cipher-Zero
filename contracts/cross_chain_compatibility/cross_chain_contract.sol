// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrossChainContract is Ownable {
    using SafeMath for uint256;

    // Event declarations
    event CrossChainTransferInitiated(address indexed sender, address indexed recipient, uint256 amount, string destinationChain);
    event CrossChainTransferCompleted(address indexed recipient, uint256 amount, string sourceChain);

    // State variables
    IERC20 public token;
    mapping(address => uint256) public crossChainBalances;

    // Constructor to initialize the contract with the token address
    constructor(address _token) {
        token = IERC20(_token);
    }

    // Function to initiate a cross-chain transfer
    function initiateTransfer(address recipient, uint256 amount, string calldata destinationChain) external {
        require(amount > 0, "Amount must be greater than zero");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");

        token.transferFrom(msg.sender, address(this), amount);
        crossChainBalances[recipient] = crossChainBalances[recipient].add(amount);

        emit CrossChainTransferInitiated(msg.sender, recipient, amount, destinationChain);
    }

    // Function to complete a cross-chain transfer
    function completeTransfer(address recipient, uint256 amount, string calldata sourceChain) external onlyOwner {
        require(crossChainBalances[recipient] >= amount, "Insufficient cross-chain balance");

        crossChainBalances[recipient] = crossChainBalances[recipient].sub(amount);
        token.transfer(recipient, amount);

        emit CrossChainTransferCompleted(recipient, amount, sourceChain);
    }

    // Function to check cross-chain balance
    function getCrossChainBalance(address user) external view returns (uint256) {
        return crossChainBalances[user];
    }
}
