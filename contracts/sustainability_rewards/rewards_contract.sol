// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RewardsContract is Ownable {
    using SafeMath for uint256;

    // Token used for rewards
    IERC20 public rewardToken;

    // Mapping to track rewards for each account
    mapping(address => uint256) public rewards;

    // Event declarations
    event RewardsIssued(address indexed account, uint256 amount);
    event RewardsClaimed(address indexed account, uint256 amount);

    // Constructor to initialize the contract with the reward token
    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
    }

    // Function to issue rewards to an account
    function issueRewards(address account, uint256 amount) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than zero");
        require(rewardToken.balanceOf(address(this)) >= amount, "Insufficient token balance in contract");

        rewards[account] = rewards[account].add(amount);
        emit RewardsIssued(account, amount);
    }

    // Function to claim rewards
    function claimRewards() external {
        uint256 rewardAmount = rewards[msg.sender];
        require(rewardAmount > 0, "No rewards to claim");

        rewards[msg.sender] = 0;
        require(rewardToken.transfer(msg.sender, rewardAmount), "Token transfer failed");
        emit RewardsClaimed(msg.sender, rewardAmount);
    }

    // Function to withdraw tokens from the contract (only by the owner)
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(rewardToken.balanceOf(address(this)) >= amount, "Insufficient token balance in contract");

        require(rewardToken.transfer(owner(), amount), "Token transfer failed");
    }
}
