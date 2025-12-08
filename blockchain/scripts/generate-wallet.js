const { ethers } = require('ethers');

// Generate a new wallet
const wallet = ethers.Wallet.createRandom();

console.log('\n🔐 NEW WALLET GENERATED');
console.log('════════════════════════════════════════════════════════');
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('════════════════════════════════════════════════════════');
console.log('\n⚠️  IMPORTANT:');
console.log('1. Save this private key securely - you will need it!');
console.log('2. NEVER share this private key with anyone');
console.log('3. NEVER commit it to git or public repositories');
console.log('\n📋 Next steps:');
console.log('1. Copy the address above');
console.log('2. Go to https://sepoliafaucet.com/');
console.log('3. Paste your address and get free Sepolia ETH');
console.log('4. Wait 1-2 minutes for ETH to arrive');
console.log('5. Use the private key in your .env file\n');
