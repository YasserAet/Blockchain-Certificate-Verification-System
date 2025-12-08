# Blockchain Smart Contracts - BCVS

Solidity smart contracts for the Blockchain Certificate Verification System.

## 📜 Smart Contracts

### 1. CertificateRegistry.sol
Main contract for certificate lifecycle management.

**Features:**
- Issue certificates on blockchain
- Verify certificate authenticity
- Revoke certificates
- Institution authorization
- Student/Institution certificate tracking

**Key Functions:**
- `issueCertificate()` - Issue new certificate
- `verifyCertificate()` - Verify certificate validity
- `revokeCertificate()` - Revoke a certificate
- `authorizeInstitution()` - Authorize institution (owner only)

### 2. FraudDetectionStore.sol
Store fraud detection scores from ML models.

**Features:**
- Store fraud scores (0-100)
- Auto-flag suspicious certificates (score > 70)
- Track ML model versions
- Authorized ML service integration

**Key Functions:**
- `storeFraudScore()` - Store ML fraud analysis
- `getFraudScore()` - Retrieve fraud score
- `flagCertificate()` - Manual flagging
- `authorizeService()` - Authorize ML service

### 3. SkillValidator.sol
Validate and endorse skills from certificates.

**Features:**
- Validate skills from certificates
- Peer endorsements
- Skill tracking per student
- Endorsement comments

**Key Functions:**
- `validateSkill()` - Validate a skill
- `endorseSkill()` - Endorse someone's skill
- `getSkillEndorsements()` - Get all endorsements
- `getStudentSkills()` - Get student's skills

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Start blockchain node
docker-compose up blockchain -d

# Deploy contracts
docker exec -it bcvs-blockchain npx hardhat run scripts/deploy.js --network localhost

# Check logs
docker logs bcvs-blockchain
```

### Local Development

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local node
npx hardhat node

# Deploy (in another terminal)
npx hardhat run scripts/deploy.js --network localhost
```

## 📦 Dependencies

- Hardhat 2.19.4
- OpenZeppelin Contracts 5.0.1
- Solidity 0.8.20

## 🔧 Configuration

`hardhat.config.js`:
- Solidity version: 0.8.20
- Network: Hardhat local (chainId: 31337)
- Port: 8545

## 📝 Deployment

After deployment, contract addresses are saved to `deployed-addresses.json`:

```json
{
  "CertificateRegistry": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "FraudDetectionStore": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "SkillValidator": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "Deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
}
```

Update your backend `.env`:
```env
CERTIFICATE_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
FRAUD_DETECTION_STORE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
SKILL_VALIDATOR_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/CertificateRegistry.test.js

# Coverage
npx hardhat coverage
```

## 🔐 Security Features

- **Ownable**: Admin-only functions
- **ReentrancyGuard**: Prevent reentrancy attacks
- **Access Control**: Institution/service authorization
- **Input Validation**: Require checks on all inputs

## 📊 Gas Optimization

- Optimizer enabled (200 runs)
- Efficient storage patterns
- Minimal external calls

## 🌐 Network Support

- **Local**: Hardhat Network (development)
- **Testnet**: Ready for Sepolia/Goerli
- **Mainnet**: Production-ready

## 📄 License

MIT
