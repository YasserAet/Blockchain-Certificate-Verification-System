import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Hardhat default account #0

export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;

// Contract addresses
export const CONTRACT_ADDRESSES = {
  certificateRegistry: process.env.CERTIFICATE_REGISTRY_ADDRESS || '',
  fraudDetectionStore: process.env.FRAUD_DETECTION_STORE_ADDRESS || '',
  skillValidator: process.env.SKILL_VALIDATOR_ADDRESS || '',
};

// Contract ABIs - matching deployed contracts
export const CERTIFICATE_REGISTRY_ABI = [
  'function issueCertificate(string memory certificateId, address student, string memory dataHash, uint256 expiryDate) external',
  'function verifyCertificate(string memory certificateId) external view returns (bool isValid, address student, address institution, string memory dataHash, uint256 issueDate, uint256 expiryDate, bool isRevoked)',
  'function revokeCertificate(string memory certificateId) external',
  'function authorizeInstitution(address institution) external',
  'function authorizedInstitutions(address institution) external view returns (bool)',
  'event CertificateIssued(string indexed certificateId, address indexed student, address indexed institution, uint256 issueDate)',
  'event CertificateRevoked(string indexed certificateId, address indexed revokedBy, uint256 revokeDate)'
];

export const FRAUD_DETECTION_ABI = [
  'function storeFraudScore(bytes32 certificateHash, uint256 score) external returns (bool)',
  'function getFraudScore(bytes32 certificateHash) external view returns (uint256)',
  'function isFlagged(bytes32 certificateHash) external view returns (bool)',
  'event FraudScoreStored(bytes32 indexed certificateHash, uint256 score, uint256 timestamp)',
  'event CertificateFlagged(bytes32 indexed certificateHash, uint256 score, uint256 timestamp)'
];

export const SKILL_VALIDATOR_ABI = [
  'function validateSkill(bytes32 skillHash, address student, string memory evidence) external returns (bool)',
  'function endorseSkill(bytes32 skillHash, address student) external returns (bool)',
  'function getSkillEndorsements(bytes32 skillHash, address student) external view returns (uint256)',
  'event SkillValidated(bytes32 indexed skillHash, address indexed student, uint256 timestamp)',
  'event SkillEndorsed(bytes32 indexed skillHash, address indexed student, address indexed endorser, uint256 timestamp)'
];

export const getCertificateRegistryContract = () => {
  if (!wallet) {
    console.warn('⚠️ Blockchain wallet not configured, smart contract calls will fail');
    return null;
  }
  return new ethers.Contract(
    CONTRACT_ADDRESSES.certificateRegistry,
    CERTIFICATE_REGISTRY_ABI,
    wallet
  );
};

export const getFraudDetectionContract = () => {
  if (!wallet) {
    console.warn('⚠️ Blockchain wallet not configured, smart contract calls will fail');
    return null;
  }
  return new ethers.Contract(
    CONTRACT_ADDRESSES.fraudDetectionStore,
    FRAUD_DETECTION_ABI,
    wallet
  );
};

export const getSkillValidatorContract = () => {
  if (!wallet) {
    console.warn('⚠️ Blockchain wallet not configured, smart contract calls will fail');
    return null;
  }
  return new ethers.Contract(
    CONTRACT_ADDRESSES.skillValidator,
    SKILL_VALIDATOR_ABI,
    wallet
  );
};

export const checkBlockchainConnection = async () => {
  try {
    const network = await provider.getNetwork();
    console.log(`✅ Connected to blockchain network: ${network.name} (chainId: ${network.chainId})`);
    return true;
  } catch (error) {
    console.error('❌ Blockchain connection failed:', error);
    return false;
  }
};

// Export simplified getters for controllers
export const getCertificateRegistry = () => getCertificateRegistryContract();
export const getWallet = () => wallet;
