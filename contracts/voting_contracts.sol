// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VotingContracts
 * @dev Contract for managing proposals and voting.
 */
contract VotingContracts is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _proposalIdCounter;

    // Proposal structure
    struct Proposal {
        uint256 id;
        string description;
        uint256 voteCount;
        bool executed;
    }

    // Mapping from proposal ID to Proposal
    mapping(uint256 => Proposal) public proposals;

    // Mapping from address to voted proposal IDs
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    // Event emitted when a new proposal is created
    event ProposalCreated(uint256 indexed proposalId, string description);

    // Event emitted when a vote is cast
    event VoteCast(uint256 indexed proposalId, address indexed voter);

    // Event emitted when a proposal is executed
    event ProposalExecuted(uint256 indexed proposalId);

    /**
     * @dev Creates a new proposal.
     * @param description Description of the proposal.
     */
    function createProposal(string calldata description) external onlyOwner {
        uint256 proposalId = _proposalIdCounter.current();
        _proposalIdCounter.increment();

        proposals[proposalId] = Proposal({
            id: proposalId,
            description: description,
            voteCount: 0,
            executed: false
        });

        emit ProposalCreated(proposalId, description);
    }

    /**
     * @dev Casts a vote for a proposal.
     * @param proposalId The ID of the proposal to vote for.
     */
    function vote(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(!hasVoted[msg.sender][proposalId], "You have already voted for this proposal");

        proposal.voteCount += 1;
        hasVoted[msg.sender][proposalId] = true;

        emit VoteCast(proposalId, msg.sender);
    }

    /**
     * @dev Executes a proposal if it has enough votes.
     * @param proposalId The ID of the proposal to execute.
     */
    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(proposal.voteCount > 0, "Proposal has no votes");

        proposal.executed = true;

        // Execute proposal logic here

        emit ProposalExecuted(proposalId);
    }
}
