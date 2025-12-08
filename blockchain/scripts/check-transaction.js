const hre = require("hardhat");

async function main() {
  const txHash = process.argv[2] || "0x8ca4aaff7509a3495313647fc3953b37d458a5101ac6725ce7c5eaa4e2e1517c";
  
  console.log(`\n🔍 Checking transaction: ${txHash}\n`);

  const provider = new hre.ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/S3Sz5tGlnEkwUGxNpXVpq");
  
  // Get transaction
  const tx = await provider.getTransaction(txHash);
  console.log("📤 Transaction Details:");
  console.log("From:", tx.from);
  console.log("To (Contract):", tx.to);
  console.log("Block Number:", tx.blockNumber);
  console.log("Gas Used:", tx.gasLimit.toString());
  
  // Get transaction receipt
  const receipt = await provider.getTransactionReceipt(txHash);
  console.log("\n📥 Transaction Receipt:");
  console.log("Status:", receipt.status === 1 ? "✅ Success" : "❌ Failed");
  console.log("Block Number:", receipt.blockNumber);
  console.log("Gas Used:", receipt.gasUsed.toString());
  
  // Decode logs
  const contractAddress = "0x1AaC13CF6F17d0c1c61c9edE0FbC2317E920549F";
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = CertificateRegistry.attach(contractAddress);
  
  console.log("\n📋 Event Logs:");
  for (const log of receipt.logs) {
    try {
      const parsed = registry.interface.parseLog(log);
      console.log("\nEvent:", parsed.name);
      console.log("Certificate ID:", parsed.args.certificateId);
      console.log("Student:", parsed.args.student);
      console.log("Institution:", parsed.args.institution);
      console.log("Issue Date:", new Date(Number(parsed.args.issueDate) * 1000).toLocaleString());
    } catch (e) {
      // Skip logs from other contracts
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
