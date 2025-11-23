import { ethers } from 'ethers'
import { queryDatabase } from './database'

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545'
const CONTRACT_ADDRESS = process.env.CERTIFICATE_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000'

// Ensure private key has 0x prefix
const rawPrivateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '0000000000000000000000000000000000000000000000000000000000000000'
const PRIVATE_KEY = rawPrivateKey.startsWith('0x') ? rawPrivateKey : `0x${rawPrivateKey}`

// Contract ABI for CertificateRegistry
const CONTRACT_ABI = [
  'function issueCertificate(string memory certificateHash, address issuer, string memory certificateType) public returns (bytes32)',
  'function verifyCertificate(string memory certificateHash) public view returns (bool)',
  'function getCertificateData(string memory certificateHash) public view returns (address, uint256, string memory)',
  'event CertificateIssued(string indexed certificateHash, address indexed issuer, uint256 timestamp)',
  'event CertificateVerified(string indexed certificateHash, address indexed verifier, uint256 timestamp)',
]

let provider: ethers.JsonRpcProvider
let signer: ethers.Wallet
let contract: ethers.Contract

export async function initializeBlockchain() {
  try {
    provider = new ethers.JsonRpcProvider(RPC_URL)
    signer = new ethers.Wallet(PRIVATE_KEY, provider)
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    // Verify connection
    const network = await provider.getNetwork()
    console.log(`[Blockchain] Connected to network: ${network.name} (chainId: ${network.chainId})`)
    console.log(`[Blockchain] Signer address: ${signer.address}`)

    return true
  } catch (error) {
    console.error('[Blockchain] Initialization failed:', error)
    return false
  }
}

export async function issueCertificateOnBlockchain(
  certificateHash: string,
  issuerAddress: string,
  certificateType: string
): Promise<string> {
  try {
    console.log(`[Blockchain] Issuing certificate: ${certificateHash}`)

    // Call smart contract to issue certificate
    const tx = await contract.issueCertificate(certificateHash, issuerAddress, certificateType)
    
    console.log(`[Blockchain] Transaction sent: ${tx.hash}`)
    
    // Wait for confirmation (1 block)
    const receipt = await tx.wait(1)
    
    console.log(`[Blockchain] Certificate issued in block: ${receipt.blockNumber}`)

    // Store transaction in database
    await queryDatabase(
      `INSERT INTO blockchain_transactions (tx_hash, contract_address, gas_used, block_number)
       VALUES ($1, $2, $3, $4)`,
      [tx.hash, CONTRACT_ADDRESS, receipt.gasUsed.toString(), receipt.blockNumber]
    )

    return tx.hash
  } catch (error: any) {
    console.error('[Blockchain] Issue certificate failed:', error)
    throw new Error(`Failed to issue certificate on blockchain: ${error.message}`)
  }
}

export async function verifyCertificateOnBlockchain(certificateHash: string): Promise<boolean> {
  try {
    console.log(`[Blockchain] Verifying certificate: ${certificateHash}`)
    
    const isVerified = await contract.verifyCertificate(certificateHash)
    
    console.log(`[Blockchain] Certificate verified: ${isVerified}`)
    
    return isVerified
  } catch (error: any) {
    console.error('[Blockchain] Verify certificate failed:', error)
    return false
  }
}

export async function getCertificateDataFromBlockchain(certificateHash: string): Promise<any> {
  try {
    console.log(`[Blockchain] Fetching certificate data: ${certificateHash}`)
    
    const data = await contract.getCertificateData(certificateHash)
    
    return {
      issuer: data[0],
      timestamp: Number(data[1]),
      certificateType: data[2],
    }
  } catch (error: any) {
    console.error('[Blockchain] Get certificate data failed:', error)
    return null
  }
}

export function getSignerAddress(): string {
  return signer?.address || ''
}

export function isBlockchainConnected(): boolean {
  return !!contract && !!provider
}
