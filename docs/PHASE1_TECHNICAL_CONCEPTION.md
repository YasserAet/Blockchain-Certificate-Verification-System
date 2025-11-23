# PHASE 1: TECHNICAL CONCEPTION - APPROVED ✅

## Blockchain Skills Certification System
**Project Lead:** YasserAet  
**Date:** November 14, 2025  
**Status:** Phase 1 Complete - Awaiting Approval for Phase 2

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [AI/ML Integration (MANDATORY)](#aiml-integration-mandatory)
6. [Dataset Recommendations (MANDATORY)](#dataset-recommendations-mandatory)
7. [Database Design](#database-design)
8. [Smart Contract Design](#smart-contract-design)
9. [Security & Privacy](#security--privacy)
10. [Diagrams & Documentation](#diagrams--documentation)
11. [Next Steps - Phase 2](#next-steps---phase-2)

---

## Project Overview

### Objectives
Create a **decentralized, AI-powered, tamper-proof platform** for certifying and verifying professional skills using blockchain technology with mandatory ML/DL integration for document processing and fraud detection.

### Core Value Propositions
- ✅ **Authenticity**: Blockchain-backed immutable certificates
- 🤖 **AI-Powered**: Automatic document scanning, OCR, and fraud detection
- 🔒 **Security**: End-to-end encryption + cryptographic hashing
- ⚡ **Instant Verification**: Real-time blockchain queries
- 🌍 **Decentralized**: No single point of failure
- 💰 **Cost-Effective**: Polygon L2 for low gas fees

### Key Metrics
- **Expected Users**: 1,000s
- **Daily Certificates**: 20-50 uploads/day
- **Geographic Reach**: International
- **Target Certificates**: Academic + Professional training

---

## System Requirements

### User Roles (5 Total)

#### 1. Students/Learners
- Register and create profiles
- **Upload physical certificates** for AI scanning
- Receive blockchain-based certifications
- Share verifiable credentials with QR codes
- View AI validation scores

#### 2. Educational Institutions
- Issue digital certificates
- **Upload bulk certificates** for AI processing
- **Review AI fraud detection alerts**
- Record certifications on blockchain
- Manage course catalogs

#### 3. Employers/Recruiters
- Verify candidate credentials instantly
- **View AI confidence scores** for authenticity
- Access ML-powered skill matching
- Validate certificates without intermediaries

#### 4. Verifiers (Third-party)
- Independent certificate validation
- Blockchain record access
- AI fraud score visibility

#### 5. System Administrators
- Manage platform operations
- **Monitor AI/ML model performance**
- **Retrain and update ML models**
- Review fraud detection alerts
- Oversee user permissions

---

## Technology Stack

### ✅ Final Stack (Free & Open-Source)

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Blockchain** | Ethereum (Sepolia testnet) + Polygon PoS (production) | EVM-compatible, low gas fees on L2 |
| **Smart Contracts** | Solidity ^0.8.0 + OpenZeppelin | Industry standard, audited libraries |
| **Backend** | Node.js 20 + Express + TypeScript | Scalable, large ecosystem |
| **Frontend** | Next.js 15 + React 19 + TailwindCSS | SSR, performance, modern UI |
| **Database** | PostgreSQL 15+ | JSONB support, reliable, ACID |
| **Blob Storage** | MinIO (dev) / S3 (prod) | S3-compatible, encrypted at rest |
| **ML Framework** | PyTorch 2.1+ | Best for document understanding models |
| **ML Library** | Hugging Face Transformers | Pre-trained models, community |
| **OCR** | Tesseract / PaddleOCR | Multi-language, free, accurate |
| **Document AI** | LayoutLMv3, Donut (Hugging Face) | State-of-the-art layout understanding |
| **NLP** | XLM-RoBERTa (multilingual) | Skill extraction, entity recognition |
| **Fraud Detection** | PyTorch CNN + scikit-learn | Visual forensics, anomaly detection |
| **API (ML)** | FastAPI (Python) | High performance, async, easy deployment |
| **Deployment** | Docker + Docker Compose | Containerization, reproducibility |
| **Dev Blockchain** | Hardhat + Ganache | Local testing, fast iteration |
| **Web3 Library** | ethers.js v6 | Modern, well-maintained |
| **Auth** | JWT + bcrypt | Secure, stateless |

### Infrastructure Costs
- **Development**: $0 (all local + free tiers)
- **Production**: ~$50-100/month (cloud hosting, RPC provider, storage)
- **Training**: Google Colab free GPU credits

---

## System Architecture

**6-Layer Architecture:**

```
Layer 1: Presentation (Next.js Frontend)
Layer 2: Application (Node.js Backend API)
Layer 3: AI/ML Processing (FastAPI Python Service)
Layer 4: Data (PostgreSQL + S3/MinIO)
Layer 5: Blockchain (Ethereum/Polygon)
Layer 6: External Services (Email, IPFS, RPC)
```

### Component Interaction Flow
```
Student Upload → Frontend → Backend → Encrypted Storage
                                  ↓
                            ML Service (OCR, Extract, Fraud Check)
                                  ↓
                          Database (Store Results)
                                  ↓
              Institution Reviews → Approves
                                  ↓
                     Blockchain TX (issueCertificate)
                                  ↓
                       Certificate Hash On-Chain
```

**📄 Full Architecture Diagram:** [docs/diagrams/ARCHITECTURE.md](./diagrams/ARCHITECTURE.md)

---

## AI/ML Integration (MANDATORY)

### 🤖 AI/ML Use Cases

#### 1. Document/PDF Scanning & Processing (CORE FEATURE)
**Purpose:** Automatically extract data from uploaded certificate images

**Pipeline:**
1. **PDF → Images**: Convert PDF to raster images (pdf2image)
2. **Preprocessing**: Deskew, denoise, contrast enhancement (OpenCV)
3. **OCR**: Text extraction with Tesseract/PaddleOCR
4. **Classification**: Identify certificate type (academic/professional)
5. **Field Extraction**: Extract name, institution, date, course, grades
6. **QR/Barcode Detection**: Decode verification codes (pyzbar)
7. **Signature Detection**: Locate signatures and seals (YOLOv5)

**Output:**
```json
{
  "ocr_text": "...",
  "ocr_confidence": 0.94,
  "fields": {
    "recipient_name": "John Doe",
    "institution": "MIT",
    "issue_date": "2024-06-15",
    "certificate_title": "AI Fundamentals"
  },
  "signatures_detected": true,
  "qr_codes": ["https://verify.mit.edu/cert/abc123"]
}
```

**Models:** LayoutLMv3 (Hugging Face), TrOCR, PaddleOCR

---

#### 2. Fraud Detection (MANDATORY)
**Purpose:** Detect tampered/forged certificates using ML

**Multi-Model Approach:**
- **Visual Forensics CNN**: Detect pixel-level tampering, resampling artifacts
- **Signature Verification**: Siamese network for signature matching
- **Template Matching**: Embedding similarity vs known issuer templates
- **Anomaly Detection**: Autoencoder reconstruction error

**Output:**
```json
{
  "is_fraud": false,
  "fraud_confidence": 0.03,
  "fraud_score": 0.97,
  "details": {
    "visual_tampering": 0.12,
    "signature_mismatch": 0.05,
    "template_anomaly": 0.08,
    "reconstruction_error": 0.09
  },
  "requires_review": false
}
```

**Models:** EfficientNet-B0 (visual), Siamese ResNet (signatures), Autoencoder

---

#### 3. Skill Extraction & Validation (NLP)
**Purpose:** Extract skills from certificate text and map to taxonomy

**Pipeline:**
1. **NER**: Named Entity Recognition for skills (XLM-RoBERTa)
2. **Taxonomy Mapping**: Map to O*NET/ESCO standardized skills
3. **Proficiency Inference**: Determine skill level from context

**Output:**
```json
{
  "skills": [
    {
      "name": "Python Programming",
      "onet_id": "2.B.4.a",
      "proficiency": "advanced",
      "confidence": 0.91
    },
    {
      "name": "Machine Learning",
      "esco_id": "skill_123",
      "proficiency": "intermediate",
      "confidence": 0.88
    }
  ]
}
```

**Models:** XLM-RoBERTa-base, Sentence-BERT

---

#### 4. Intelligent Matching (Future)
**Purpose:** Match candidate skills to job requirements

**Approach:** Semantic embedding similarity using Sentence Transformers

---

### ML Model Deployment

**Training:** Google Colab (free GPU) for fine-tuning  
**Inference:** CPU-optimized models (ONNX quantization)  
**Serving:** FastAPI endpoints  
**Versioning:** Model registry in database

---

## Dataset Recommendations (MANDATORY)

### ✅ Specific Kaggle Datasets

#### Certificate Images
1. **Certificate Dataset**  
   - Link: https://www.kaggle.com/datasets/techsash/certificate-dataset
   - Size: 1000+ certificates
   - Use: Classification, extraction training

2. **Educational Certificates**  
   - Link: https://www.kaggle.com/datasets/umerfarooq28/educational-certificates
   - Use: Template learning

3. **Document Classification Dataset**  
   - Link: https://www.kaggle.com/datasets/patrickaudriaz/document-classification-dataset
   - Size: 5000+ documents
   - Use: Document type classifier

#### OCR Training
4. **ICDAR 2019 Robust Reading**  
   - Link: https://rrc.cvc.uab.es/
   - Use: OCR benchmarking

5. **SynthText Dataset**  
   - GitHub: https://github.com/ankush-me/SynthText
   - Size: 800K synthetic images
   - Use: Text detection training

#### Fraud Detection
6. **CASIA Image Tampering Dataset**  
   - Link: http://forensics.idealtest.org/
   - Size: 12,000+ images
   - Use: Forgery detection training

7. **Columbia Image Splicing**  
   - Link: https://www.ee.columbia.edu/ln/dvmm/downloads/authsplcuncmp/
   - Use: Splicing detection

#### Skills Taxonomy
8. **O*NET Skills Database**  
   - Link: https://www.onetcenter.org/database.html
   - Format: Free CSV download
   - Use: Skill normalization

9. **ESCO Skills Taxonomy**  
   - Link: https://ec.europa.eu/esco/portal/download
   - Size: 13,000+ skills
   - Use: Multi-language skill mapping

10. **LinkedIn Jobs Dataset (Kaggle)**  
    - Link: https://www.kaggle.com/datasets/asaniczka/1-3m-linkedin-jobs-and-skills-2024
    - Size: 1.3M job postings
    - Use: Job-skill matching

### Synthetic Data Strategy
Since real certificate datasets are limited:
- Generate 10,000 synthetic certificates using Faker + PIL
- Create 2,000 tampered versions (altered dates, copy-paste signatures)
- Use DocCreator for layout generation

**📄 Complete Dataset Guide:** [docs/DATASETS.md](./DATASETS.md)

---

## Database Design

### PostgreSQL Schema (14 Tables)

**Core Tables:**
- `users` (authentication)
- `students`, `institutions`, `employers` (role-specific data)
- `certificates` (certificate metadata)
- `extracted_data` (AI OCR results)

**AI/ML Tables:**
- `validation_scores` (AI model confidence scores)
- `fraud_detection_results` (ML fraud analysis)
- `fraud_alerts` (high-risk alerts for institutions)
- `skills`, `student_skills` (NLP extracted skills)

**Blockchain Tables:**
- `blockchain_transactions` (TX logs)
- `verifications` (employer verification requests)

**Audit:**
- `audit_logs` (compliance trail)

**Key Features:**
- UUID primary keys
- JSONB for flexible metadata
- GIN indexes for JSONB queries
- Foreign key constraints with cascades
- Check constraints for data integrity

**📄 Full ERD:** [docs/diagrams/DATABASE_ERD.md](./diagrams/DATABASE_ERD.md)

---

## Smart Contract Design

### CertificateRegistry.sol (Solidity)

**Key Functions:**
```solidity
function issueCertificate(
    bytes32 _certificateHash,
    address _student,
    string memory _certificateType
) external onlyVerifiedIssuer

function verifyCertificate(bytes32 _certificateHash) 
    external view returns (bool)

function revokeCertificate(bytes32 _certificateHash) 
    external onlyIssuer
```

**Access Control:**
- Only whitelisted institutions can issue
- Admin manages issuer whitelist
- Students cannot modify certificates

**Events:**
```solidity
event CertificateIssued(
    bytes32 indexed certificateHash,
    address indexed issuer,
    address indexed student,
    uint256 timestamp
);
```

**Gas Optimization:**
- Minimal on-chain storage (hash + metadata)
- Large data stored off-chain (IPFS/database)
- Use Polygon L2 for production (1000x cheaper than Ethereum mainnet)

**📁 Contract Code:** [blockchain/contracts/CertificateRegistry.sol](../blockchain/contracts/CertificateRegistry.sol)

---

## Security & Privacy

### Security Layers
1. **HTTPS/TLS**: All traffic encrypted
2. **JWT Auth**: 24h token expiry
3. **RBAC**: Role-based access control
4. **Data Encryption**: AES-256 for blobs, bcrypt for passwords
5. **Smart Contract Security**: OpenZeppelin libraries, access control
6. **Rate Limiting**: 100 req/min per IP
7. **Input Validation**: Zod schemas
8. **Audit Logging**: All actions logged

### Privacy Compliance
- **GDPR**: Right to be forgotten (off-chain data deletion)
- **Minimal On-Chain PII**: Only hashes stored on blockchain
- **Consent Required**: Before publishing certificate on-chain
- **Encrypted Storage**: All uploaded documents encrypted at rest

---

## Diagrams & Documentation

### 📂 Complete Documentation Structure

```
docs/
├── DATASETS.md                    ← Kaggle datasets + synthetic data plan
├── diagrams/
│   ├── ARCHITECTURE.md            ← 6-layer system architecture
│   ├── USE_CASES.md               ← All 5 user roles + workflows
│   ├── SEQUENCES.md               ← 8 sequence diagrams (upload, verify, fraud, etc.)
│   └── DATABASE_ERD.md            ← Entity relationship diagram
├── PHASE1_TECHNICAL_CONCEPTION.md ← This file
└── CODE_VERIFICATION.md           ← Existing code alignment analysis
```

---

## Next Steps - Phase 2

### ⚠️ WAITING FOR YOUR APPROVAL

**Before proceeding to Phase 2, I need your confirmation:**

1. ✅ **Approve Phase 1 Documentation**  
   - Architecture design acceptable?
   - AI/ML integration plan sufficient?
   - Dataset recommendations clear?

2. 📋 **Clarifications Needed:**
   - **Polygon for production?** (Yes/No) - Recommended for low gas fees
   - **Google Colab for training?** (Yes/No) - Free GPU credits
   - **Synthetic certificate generation acceptable?** (Yes/No) - Needed due to limited real data

3. 🚀 **Once Approved, Phase 2 Will Include:**
   - Environment setup guide (Docker, Node, Python, PostgreSQL)
   - Frontend template selection (3-5 options for your choice)
   - Development workflow setup
   - Local blockchain configuration

---

## Phase 1 Deliverables Checklist

- ✅ System Architecture Diagram (6 layers)
- ✅ AI/ML/DL Architecture (document processing, fraud detection, skill extraction)
- ✅ Dataset Recommendations (10+ specific Kaggle/public datasets)
- ✅ Use Case Diagrams (5 user roles, 24 use cases)
- ✅ Sequence Diagrams (8 flows)
- ✅ Database Schema (14 tables with ERD)
- ✅ Smart Contract Design (Solidity)
- ✅ Technology Stack Proposal (all open-source)
- ✅ Security & Privacy Analysis
- ✅ Complete Documentation (single README + diagrams)

---

## Summary

**✨ Phase 1 is COMPLETE and ready for your review.**

**Key Achievements:**
- 🎯 All mandatory requirements included (AI/ML, datasets, document scanning)
- 🤖 AI-powered document processing pipeline designed
- 📊 10+ specific dataset sources identified
- 🏗️ Complete architecture with 6 layers
- 🔒 Security-first design
- 💰 Cost-optimized (free/open-source stack)
- 📈 Scalable to 1000s of users

**Awaiting Your Approval to Proceed to Phase 2! 🚀**

---

**Project Lead:** YasserAet  
**Date:** November 14, 2025  
**Version:** 1.0  
**Status:** ⏸️ Pending Approval
