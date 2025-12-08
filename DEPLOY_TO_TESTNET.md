# Deploying to Public Networks (Sepolia Testnet)

## Prerequisites

1. **Get an Alchemy API Key** (Free):
   - Go to https://www.alchemy.com/
   - Create account and get API key for Sepolia

2. **Get Test ETH**:
   - Visit https://sepoliafaucet.com/
   - Enter your wallet address
   - Get free Sepolia ETH (~0.1 ETH needed)

3. **Create a Deployment Wallet**:
   ```bash
   # Generate a new wallet (or use existing)
   # Save the private key securely - you'll need it
   ```

## Deployment Steps

### 1. Configure Environment

Create `blockchain/.env`:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
SEPOLIA_PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY
```

⚠️ **Never commit your private key to git!**

### 2. Deploy Contracts to Sepolia

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia
```

You'll see output like:
```
🚀 Starting deployment...
📝 Deploying contracts with account: 0x1234...
✅ CertificateRegistry deployed to: 0xABCD...
✅ FraudDetectionStore deployed to: 0xEFGH...
✅ SkillValidator deployed to: 0xIJKL...
```

### 3. Update Backend Configuration

Copy the deployed addresses to `backend/.env` and `docker-compose.yml`:
```env
BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
BLOCKCHAIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
CERTIFICATE_REGISTRY_ADDRESS=0xABCD...  # From deployment
FRAUD_DETECTION_STORE_ADDRESS=0xEFGH...
SKILL_VALIDATOR_ADDRESS=0xIJKL...
```

### 4. Verify Contracts on Etherscan (Optional)

```bash
npx hardhat verify --network sepolia CERTIFICATE_REGISTRY_ADDRESS
npx hardhat verify --network sepolia FRAUD_DETECTION_STORE_ADDRESS
npx hardhat verify --network sepolia SKILL_VALIDATOR_ADDRESS
```

### 5. View on Etherscan

After deploying, you can view your contracts and transactions:

**Sepolia Etherscan**: https://sepolia.etherscan.io/

- Search for your contract address
- View all transactions
- See certificate issuance events
- Anyone in the world can verify certificates!

## Example URLs

After deployment, you'll be able to share links like:

- **Contract**: https://sepolia.etherscan.io/address/0xYOUR_CONTRACT_ADDRESS
- **Transaction**: https://sepolia.etherscan.io/tx/0xYOUR_TX_HASH
- **Certificate Issuance Event**: Filter contract events by `CertificateIssued`

## Cost Estimate

- Deployment: ~$1-3 USD in gas fees (using testnet: FREE)
- Per certificate issuance: ~$0.50-2 USD (testnet: FREE)
- Certificate verification: FREE (read-only)

## Alternative Networks

### Polygon Mumbai (Cheaper, Faster)
- Testnet faucet: https://faucet.polygon.technology/
- Explorer: https://mumbai.polygonscan.com/
- Lower gas fees than Ethereum
- Faster confirmation times

### Ethereum Mainnet (Production)
- Real ETH required (~$10-50 per deployment)
- Use for production after testing
- Explorer: https://etherscan.io/

## Production Considerations

1. **Gas Optimization**: 
   - Batch certificate issuance
   - Use layer 2 solutions (Polygon, Arbitrum)

2. **Security**:
   - Use hardware wallet for private keys
   - Multi-sig for institution authorization
   - Regular security audits

3. **Monitoring**:
   - Set up alerts for contract events
   - Monitor gas prices for optimal issuance times

4. **Backup**:
   - Keep contract addresses secure
   - Backup all transaction hashes
   - Document deployment process

## Viewing Your Certificates Online

Once deployed to Sepolia, share these with employers:

1. **Certificate Page**: Your frontend (localhost:3000)
2. **Blockchain Proof**: https://sepolia.etherscan.io/tx/TX_HASH
3. **Contract Verification**: Call `verifyCertificate()` on Etherscan

Employers can independently verify without trusting your database!
