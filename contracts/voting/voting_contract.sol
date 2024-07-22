// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract VotingContract is Ownable {
    using SafeMath for uint256;

    // Struct for a candidate
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Event declarations
    event CandidateAdded(uint256 id, string name);
    event Voted(uint256 candidateId, address voter);

    // State variables
    IERC20 public votingToken;
    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    uint256 public totalVotes;

    // Constructor to initialize the contract with the voting token
    constructor(address _votingToken) {
        votingToken = IERC20(_votingToken);
    }

    // Function to add a new candidate
    function addCandidate(string memory name) external onlyOwner {
        candidates.push(Candidate({
            name: name,
            voteCount: 0
        }));
        emit CandidateAdded(candidates.length.sub(1), name);
    }

    // Function to vote for a candidate
    function vote(uint256 candidateId) external {
        require(candidateId < candidates.length, "Invalid candidate ID");
        require(!hasVoted[msg.sender], "Already voted");

        uint256 voterBalance = votingToken.balanceOf(msg.sender);
        require(voterBalance > 0, "No voting power");

        candidates[candidateId].voteCount = candidates[candidateId].voteCount.add(voterBalance);
        totalVotes = totalVotes.add(voterBalance);
        hasVoted[msg.sender] = true;
        emit Voted(candidateId, msg.sender);
    }

    // Function to get the number of candidates
    function getNumberOfCandidates() external view returns (uint256) {
        return candidates.length;
    }

    // Function to get details of a candidate
    function getCandidate(uint256 candidateId) external view returns (string memory name, uint256 voteCount) {
        require(candidateId < candidates.length, "Invalid candidate ID");
        Candidate storage candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
