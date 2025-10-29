import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ScoreRegistry contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const ScoreRegistry = await ethers.getContractFactory("ScoreRegistry");
  const scoreRegistry = await ScoreRegistry.deploy();

  await scoreRegistry.waitForDeployment();

  const address = await scoreRegistry.getAddress();
  console.log("ScoreRegistry deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    contract: "ScoreRegistry",
    address: address,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    timestamp: new Date().toISOString()
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
