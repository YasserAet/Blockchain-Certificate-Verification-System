const hre = require("hardhat");

async function main() {
  const certificateId = process.argv[2] || "16";
  
  console.log(`\n🔍 Querying certificate ID: ${certificateId} from blockchain...\n`);

  // Get contract instance
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = CertificateRegistry.attach(contractAddress);

  try {
    // Verify certificate
    const result = await registry.verifyCertificate(certificateId);
    
    console.log("📜 Certificate Details from Blockchain:");
    console.log("=====================================");
    console.log("✅ Is Valid:", result.isValid);
    console.log("👤 Student Address:", result.student);
    console.log("🏛️  Institution Address:", result.institution);
    console.log("🔐 Data Hash:", result.dataHash);
    console.log("📅 Issue Date:", new Date(Number(result.issueDate) * 1000).toLocaleString());
    console.log("⏰ Expiry Date:", result.expiryDate > 0 ? new Date(Number(result.expiryDate) * 1000).toLocaleString() : "No expiry");
    console.log("❌ Is Revoked:", result.isRevoked);
    console.log("=====================================\n");

    // Get certificate struct directly
    const cert = await registry.certificates(certificateId);
    console.log("📋 Raw Certificate Data:");
    console.log("Certificate ID:", cert.certificateId);
    console.log("Exists:", cert.exists);
    
  } catch (error) {
    console.error("❌ Error querying certificate:", error.message);
    if (error.message.includes("Certificate does not exist")) {
      console.log("\n💡 This certificate ID might not exist on the blockchain yet.");
      console.log("   Make sure you uploaded the certificate through the institution dashboard.");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
