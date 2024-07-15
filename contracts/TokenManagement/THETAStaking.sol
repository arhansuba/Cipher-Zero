// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract THETAStaking is Ownable {
    constructor(IERC20 _thetaToken, IERC20 _tfuelToken, uint256 _rewardPerBlock) Ownable() {
        thetaToken = _thetaToken;
        tfuelToken = _tfuelToken;
        rewardPerBlock = _rewardPerBlock;
    }
    constructor(IERC20 _thetaToken, IERC20 _tfuelToken, uint256 _rewardPerBlock) Ownable() {
        thetaToken = _thetaToken;
        tfuelToken = _tfuelToken;
        rewardPerBlock = _rewardPerBlock;
    }

    IERC20 public thetaToken;
    IERC20 public tfuelToken;

    struct Stake {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastStakeTime;
    }

    mapping(address => Stake) public stakes;
    uint256 public rewardPerBlock;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(IERC20 _thetaToken, IERC20 _tfuelToken, uint256 _rewardPerBlock) {
        thetaToken = _thetaToken;
        tfuelToken = _tfuelToken;
        rewardPerBlock = _rewardPerBlock;
    }

    function stake(uint256 _amount) public {
        require(_amount > 0, "Cannot stake 0");

        Stake storage userStake = stakes[msg.sender];

        if (userStake.amount > 0) {
            uint256 pendingReward = (userStake.amount * rewardPerBlock) - userStake.rewardDebt;
            tfuelToken.transfer(msg.sender, pendingReward);
            emit RewardPaid(msg.sender, pendingReward);
        }

        thetaToken.transferFrom(msg.sender, address(this), _amount);
        userStake.amount += _amount;
        userStake.rewardDebt = userStake.amount * rewardPerBlock;
        userStake.lastStakeTime = block.timestamp;

        totalStaked += _amount;

        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= _amount, "Insufficient stake");

        uint256 pendingReward = (userStake.amount * rewardPerBlock) - userStake.rewardDebt;
        tfuelToken.transfer(msg.sender, pendingReward);

        thetaToken.transfer(msg.sender, _amount);
        userStake.amount -= _amount;
        userStake.rewardDebt = userStake.amount * rewardPerBlock;

        totalStaked -= _amount;

        emit Withdrawn(msg.sender, _amount);
        emit RewardPaid(msg.sender, pendingReward);
    }

    function pendingReward(address _user) external view returns (uint256) {
        Stake storage userStake = stakes[_user];
        return (userStake.amount * rewardPerBlock) - userStake.rewardDebt;
    }

    function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        rewardPerBlock = _rewardPerBlock;
    }
}
