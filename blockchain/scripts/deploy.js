const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy CertificateRegistry
  console.log("📜 Deploying CertificateRegistry...");
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const certificateRegistry = await CertificateRegistry.deploy();
  await certificateRegistry.waitForDeployment();
  const certRegAddress = await certificateRegistry.getAddress();
  console.log("✅ CertificateRegistry deployed to:", certRegAddress);

  // Deploy FraudDetectionStore
  console.log("\n📜 Deploying FraudDetectionStore...");
  const FraudDetectionStore = await hre.ethers.getContractFactory("FraudDetectionStore");
  const fraudDetectionStore = await FraudDetectionStore.deploy();
  await fraudDetectionStore.waitForDeployment();
  const fraudStoreAddress = await fraudDetectionStore.getAddress();
  console.log("✅ FraudDetectionStore deployed to:", fraudStoreAddress);

  // Deploy SkillValidator
  console.log("\n📜 Deploying SkillValidator...");
  const SkillValidator = await hre.ethers.getContractFactory("SkillValidator");
  const skillValidator = await SkillValidator.deploy();
  await skillValidator.waitForDeployment();
  const skillValidatorAddress = await skillValidator.getAddress();
  console.log("✅ SkillValidator deployed to:", skillValidatorAddress);

  // Authorize deployer as institution in CertificateRegistry
  console.log("\n🔐 Authorizing deployer as institution...");
  const authTx = await certificateRegistry.authorizeInstitution(deployer.address);
  await authTx.wait();
  console.log("✅ Deployer authorized as institution");

  // Authorize deployer as ML service in FraudDetectionStore
  console.log("\n🔐 Authorizing deployer as ML service...");
  const authServiceTx = await fraudDetectionStore.authorizeService(deployer.address);
  await authServiceTx.wait();
  console.log("✅ Deployer authorized as ML service");

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("  CertificateRegistry:", certRegAddress);
  console.log("  FraudDetectionStore:", fraudStoreAddress);
  console.log("  SkillValidator:     ", skillValidatorAddress);
  console.log("\n💡 Update your .env file with these addresses:");
  console.log(`  CERTIFICATE_REGISTRY_ADDRESS=${certRegAddress}`);
  console.log(`  FRAUD_DETECTION_STORE_ADDRESS=${fraudStoreAddress}`);
  console.log(`  SKILL_VALIDATOR_ADDRESS=${skillValidatorAddress}`);
  console.log("\n🔑 Deployer Address (Authorized):", deployer.address);
  console.log("=".repeat(60) + "\n");

  // Save addresses to file
  const fs = require('fs');
  const addresses = {
    CertificateRegistry: certRegAddress,
    FraudDetectionStore: fraudStoreAddress,
    SkillValidator: skillValidatorAddress,
    Deployer: deployer.address,
    Network: hre.network.name,
    ChainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    DeploymentTime: new Date().toISOString()
  };
  
  fs.writeFileSync(
    'deployed-addresses.json',
    JSON.stringify(addresses, null, 2)
  );
  console.log("💾 Addresses saved to deployed-addresses.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
