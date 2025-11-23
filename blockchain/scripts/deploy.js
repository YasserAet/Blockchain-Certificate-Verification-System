const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const networkName = hre.network.name;
  console.log(`Deploying Credential Chain contracts to ${networkName}...\n`);

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  // Get account balance (ethers v6 syntax)
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH\n`);

  // Deploy CertificateRegistry
  console.log("1. Deploying CertificateRegistry...");
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const certificateRegistry = await CertificateRegistry.deploy();
  await certificateRegistry.waitForDeployment();
  const certRegAddress = await certificateRegistry.getAddress();
  console.log(`   CertificateRegistry deployed to: ${certRegAddress}\n`);

  // Deploy FraudDetectionStore
  console.log("2. Deploying FraudDetectionStore...");
  const FraudDetectionStore = await hre.ethers.getContractFactory("FraudDetectionStore");
  const fraudDetectionStore = await FraudDetectionStore.deploy();
  await fraudDetectionStore.waitForDeployment();
  const fraudAddress = await fraudDetectionStore.getAddress();
  console.log(`   FraudDetectionStore deployed to: ${fraudAddress}\n`);

  // Deploy SkillValidator
  console.log("3. Deploying SkillValidator...");
  const SkillValidator = await hre.ethers.getContractFactory("SkillValidator");
  const skillValidator = await SkillValidator.deploy();
  await skillValidator.waitForDeployment();
  const skillAddress = await skillValidator.getAddress();
  console.log(`   SkillValidator deployed to: ${skillAddress}\n`);

  // Save deployment addresses to file
  const deploymentConfig = {
    network: networkName,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      certificateRegistry: certRegAddress,
      fraudDetectionStore: fraudAddress,
      skillValidator: skillAddress,
    },
  };

  const configPath = path.join(__dirname, `../deployments-${networkName}.json`);
  fs.writeFileSync(configPath, JSON.stringify(deploymentConfig, null, 2));
  console.log(`✓ Deployment config saved to: ${configPath}\n`);

  // Display next steps
  console.log("=".repeat(60));
  console.log("DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\nAdd these addresses to your .env files:\n");
  console.log("Frontend (.env.local):");
  console.log(`NEXT_PUBLIC_CERTIFICATE_REGISTRY_ADDRESS=${certRegAddress}`);
  console.log(`NEXT_PUBLIC_FRAUD_DETECTION_STORE_ADDRESS=${fraudAddress}`);
  console.log(`NEXT_PUBLIC_SKILL_VALIDATOR_ADDRESS=${skillAddress}`);
  console.log(`NEXT_PUBLIC_BLOCKCHAIN_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY`);
  console.log("\nBackend (.env):");
  console.log(`BLOCKCHAIN_CERTIFICATE_REGISTRY=${certRegAddress}`);
  console.log(`BLOCKCHAIN_FRAUD_STORE=${fraudAddress}`);
  console.log(`BLOCKCHAIN_SKILL_VALIDATOR=${skillAddress}`);
  console.log("\nNext: Verify contracts on Etherscan for better visibility");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
