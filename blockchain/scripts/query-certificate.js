const hre = require("hardhat");

async function main() {
  const certificateId = process.argv[2] || "17";
  
  console.log(`\n🔍 Querying certificate ID: ${certificateId} from blockchain...\n`);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = CertificateRegistry.attach(contractAddress);

  try {
    // Get certificate struct directly
    const cert = await registry.certificates(certificateId);
    
    console.log("📜 CERTIFICATE ON-CHAIN DATA");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("📋 Certificate ID:", cert.certificateId);
    console.log("✅ Exists:", cert.exists);
    console.log("👤 Student Address:", cert.student);
    console.log("🏛️  Institution Address:", cert.institution);
    console.log("🔐 Data Hash (SHA-256):", cert.dataHash);
    console.log("📅 Issue Timestamp:", new Date(Number(cert.issueDate) * 1000).toLocaleString());
    console.log("⏰ Expiry Timestamp:", cert.expiryDate > 0 ? new Date(Number(cert.expiryDate) * 1000).toLocaleString() : "No expiry");
    console.log("❌ Is Revoked:", cert.isRevoked);
    console.log("═══════════════════════════════════════════════════════════\n");

    if (!cert.exists) {
      console.log("⚠️  Warning: Certificate exists=false. It may not have been issued yet.\n");
    } else {
      console.log("✅ This certificate is permanently recorded on the blockchain!");
      console.log("💡 The data hash proves the certificate hasn't been tampered with.\n");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
