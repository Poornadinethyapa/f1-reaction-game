import { expect } from "chai";
import { ethers } from "hardhat";
import { ScoreRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ScoreRegistry", function () {
  let scoreRegistry: ScoreRegistry;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const ScoreRegistryFactory = await ethers.getContractFactory("ScoreRegistry");
    scoreRegistry = await ScoreRegistryFactory.deploy();
    await scoreRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await scoreRegistry.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero total submissions", async function () {
      expect(await scoreRegistry.totalSubmissions()).to.equal(0);
    });

    it("Should not be paused initially", async function () {
      expect(await scoreRegistry.paused()).to.equal(false);
    });
  });

  describe("Score Submission", function () {
    it("Should allow users to submit valid scores", async function () {
      const scoreValue = 250; // 250ms reaction time
      const metadataHash = ethers.ZeroHash;

      const tx = await scoreRegistry.connect(user1).submitScore(scoreValue, metadataHash);
      const receipt = await tx.wait();
      
      await expect(tx)
        .to.emit(scoreRegistry, "ScoreSubmitted");
      
      // Verify the stored score
      const [value] = await scoreRegistry.latestScoreOf(user1.address);
      expect(value).to.equal(scoreValue);
    });

    it("Should reject scores above MAX_SCORE", async function () {
      const invalidScore = 1_000_001;
      
      await expect(
        scoreRegistry.connect(user1).submitScore(invalidScore, ethers.ZeroHash)
      ).to.be.revertedWith("ScoreRegistry: score out of range");
    });

    it("Should allow score at exactly MAX_SCORE", async function () {
      const maxScore = 1_000_000;
      
      await expect(
        scoreRegistry.connect(user1).submitScore(maxScore, ethers.ZeroHash)
      ).to.not.be.reverted;
    });

    it("Should update latest score for same user", async function () {
      await scoreRegistry.connect(user1).submitScore(300, ethers.ZeroHash);
      await scoreRegistry.connect(user1).submitScore(250, ethers.ZeroHash);

      const [value] = await scoreRegistry.latestScoreOf(user1.address);
      expect(value).to.equal(250);
    });

    it("Should increment totalSubmissions counter", async function () {
      await scoreRegistry.connect(user1).submitScore(200, ethers.ZeroHash);
      expect(await scoreRegistry.totalSubmissions()).to.equal(1);

      await scoreRegistry.connect(user2).submitScore(300, ethers.ZeroHash);
      expect(await scoreRegistry.totalSubmissions()).to.equal(2);

      await scoreRegistry.connect(user1).submitScore(150, ethers.ZeroHash);
      expect(await scoreRegistry.totalSubmissions()).to.equal(3);
    });

    it("Should store metadata hash correctly", async function () {
      const metadata = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));
      await scoreRegistry.connect(user1).submitScore(200, metadata);

      const [, , storedMetadata] = await scoreRegistry.latestScoreOf(user1.address);
      expect(storedMetadata).to.equal(metadata);
    });

    it("Should reject submissions when paused", async function () {
      await scoreRegistry.connect(owner).setPaused(true);
      
      await expect(
        scoreRegistry.connect(user1).submitScore(200, ethers.ZeroHash)
      ).to.be.revertedWith("ScoreRegistry: submissions paused");
    });
  });

  describe("View Functions", function () {
    it("Should return correct latest score", async function () {
      const scoreValue = 175;
      const metadata = ethers.ZeroHash;
      
      await scoreRegistry.connect(user1).submitScore(scoreValue, metadata);
      
      const [value, timestamp, hash] = await scoreRegistry.latestScoreOf(user1.address);
      expect(value).to.equal(scoreValue);
      expect(timestamp).to.be.greaterThan(0);
      expect(hash).to.equal(metadata);
    });

    it("Should return zero for users who haven't submitted", async function () {
      const [value, timestamp, hash] = await scoreRegistry.latestScoreOf(user2.address);
      expect(value).to.equal(0);
      expect(timestamp).to.equal(0);
      expect(hash).to.equal(ethers.ZeroHash);
    });

    it("Should return caller's score via myLatestScore", async function () {
      await scoreRegistry.connect(user1).submitScore(220, ethers.ZeroHash);
      
      const [value] = await scoreRegistry.connect(user1).myLatestScore();
      expect(value).to.equal(220);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to clear user score", async function () {
      await scoreRegistry.connect(user1).submitScore(200, ethers.ZeroHash);
      
      await expect(scoreRegistry.connect(owner).adminClearScore(user1.address))
        .to.emit(scoreRegistry, "AdminCleared")
        .withArgs(owner.address, user1.address);

      const [value] = await scoreRegistry.latestScoreOf(user1.address);
      expect(value).to.equal(0);
    });

    it("Should reject non-owner attempts to clear scores", async function () {
      await expect(
        scoreRegistry.connect(user1).adminClearScore(user2.address)
      ).to.be.revertedWithCustomError(scoreRegistry, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to pause/unpause", async function () {
      await expect(scoreRegistry.connect(owner).setPaused(true))
        .to.emit(scoreRegistry, "PauseStateChanged")
        .withArgs(true);
      
      expect(await scoreRegistry.paused()).to.equal(true);

      await scoreRegistry.connect(owner).setPaused(false);
      expect(await scoreRegistry.paused()).to.equal(false);
    });

    it("Should reject non-owner attempts to pause", async function () {
      await expect(
        scoreRegistry.connect(user1).setPaused(true)
      ).to.be.revertedWithCustomError(scoreRegistry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Multiple Users", function () {
    it("Should handle scores from different users independently", async function () {
      await scoreRegistry.connect(user1).submitScore(150, ethers.ZeroHash);
      await scoreRegistry.connect(user2).submitScore(200, ethers.ZeroHash);

      const [score1] = await scoreRegistry.latestScoreOf(user1.address);
      const [score2] = await scoreRegistry.latestScoreOf(user2.address);

      expect(score1).to.equal(150);
      expect(score2).to.equal(200);
    });
  });

  // Helper function to get block timestamp
  async function getBlockTimestamp(): Promise<number> {
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    return block!.timestamp;
  }
});
