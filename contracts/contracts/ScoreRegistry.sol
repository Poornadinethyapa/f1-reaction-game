// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ScoreRegistry
 * @dev Stores F1 Reaction Race scores on Base blockchain
 * @notice Gas-efficient score storage using latest-only pattern with event emissions
 */
contract ScoreRegistry is Ownable, ReentrancyGuard {
    struct Score {
        uint256 value;          // Score value (reaction time in milliseconds)
        uint256 timestamp;      // Block timestamp when score was submitted
        bytes32 metadataHash;   // Optional IPFS hash or metadata reference
    }

    /// @notice Latest score per user address
    mapping(address => Score) private _latestScore;

    /// @notice Total number of scores submitted across all users
    uint256 public totalSubmissions;

    /// @notice Maximum allowed score value (1,000,000 ms = ~16.6 minutes)
    uint256 public constant MAX_SCORE = 1_000_000;

    /// @notice Emitted when a user submits a new score
    event ScoreSubmitted(
        address indexed user,
        uint256 value,
        uint256 timestamp,
        bytes32 metadataHash
    );

    /// @notice Emitted when admin clears a user's score
    event AdminCleared(address indexed admin, address indexed user);

    /// @notice Emitted when contract is paused/unpaused
    event PauseStateChanged(bool isPaused);

    /// @notice Whether score submissions are paused
    bool public paused;

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Submit a new reaction time score
     * @param value The score value in milliseconds (must be <= MAX_SCORE)
     * @param metadataHash Optional metadata hash (use bytes32(0) if none)
     */
    function submitScore(uint256 value, bytes32 metadataHash) external nonReentrant {
        require(!paused, "ScoreRegistry: submissions paused");
        require(value <= MAX_SCORE, "ScoreRegistry: score out of range");

        _latestScore[msg.sender] = Score({
            value: value,
            timestamp: block.timestamp,
            metadataHash: metadataHash
        });

        totalSubmissions++;

        emit ScoreSubmitted(msg.sender, value, block.timestamp, metadataHash);
    }

    /**
     * @notice Get the latest score for a specific user
     * @param user The address to query
     * @return value The score value
     * @return timestamp When the score was submitted
     * @return metadataHash Associated metadata hash
     */
    function latestScoreOf(address user) 
        external 
        view 
        returns (
            uint256 value,
            uint256 timestamp,
            bytes32 metadataHash
        ) 
    {
        Score memory s = _latestScore[user];
        return (s.value, s.timestamp, s.metadataHash);
    }

    /**
     * @notice Get latest score for the caller
     * @return value The score value
     * @return timestamp When the score was submitted
     * @return metadataHash Associated metadata hash
     */
    function myLatestScore() 
        external 
        view 
        returns (
            uint256 value,
            uint256 timestamp,
            bytes32 metadataHash
        ) 
    {
        Score memory s = _latestScore[msg.sender];
        return (s.value, s.timestamp, s.metadataHash);
    }

    /**
     * @notice Admin function to clear a user's stored score
     * @param user The address whose score should be cleared
     */
    function adminClearScore(address user) external onlyOwner {
        delete _latestScore[user];
        emit AdminCleared(msg.sender, user);
    }

    /**
     * @notice Admin function to pause/unpause score submissions
     * @param _paused Whether to pause submissions
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PauseStateChanged(_paused);
    }
}
