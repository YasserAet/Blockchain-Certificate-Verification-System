# Blockchain Skills Certification System

**AI-Powered Decentralized Certificate Verification Platform**

[![Status](https://img.shields.io/badge/Phase-1%20Complete-success)](docs/PHASE1_TECHNICAL_CONCEPTION.md)
[![Tech](https://img.shields.io/badge/Blockchain-Ethereum%20%7C%20Polygon-blue)](blockchain/)
[![AI](https://img.shields.io/badge/AI%2FML-PyTorch%20%7C%20Transformers-orange)](ml-service/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 Project Overview

A comprehensive blockchain-based platform for issuing, managing, and verifying professional skills certifications with **mandatory AI/ML integration** for:
- 📄 **Automated document scanning** and OCR
- 🤖 **Fraud detection** using deep learning
- 🔍 **Skill extraction** with NLP
- ✅ **Certificate verification** on blockchain

---

## 📚 Documentation Structure

### Phase 1: Technical Conception ✅ COMPLETE

| Document | Description | Link |
|----------|-------------|------|
| **📋 Phase 1 Main Doc** | Complete technical conception & requirements | [PHASE1_TECHNICAL_CONCEPTION.md](docs/PHASE1_TECHNICAL_CONCEPTION.md) |
| **🗂️ Datasets Guide** | 10+ Kaggle datasets & synthetic data plan | [DATASETS.md](docs/DATASETS.md) |
| **✅ Code Verification** | Existing codebase analysis (95% aligned) | [CODE_VERIFICATION.md](docs/CODE_VERIFICATION.md) |

### Diagrams (Phase 1)

| Diagram | Description | Link |
|---------|-------------|------|
| **🏗️ System Architecture** | 6-layer architecture with all components | [ARCHITECTURE.md](docs/diagrams/ARCHITECTURE.md) |
| **👥 Use Cases** | 5 user roles, 24 use cases with workflows | [USE_CASES.md](docs/diagrams/USE_CASES.md) |
| **🔄 Sequence Diagrams** | 8 interaction flows (upload, verify, fraud) | [SEQUENCES.md](docs/diagrams/SEQUENCES.md) |
| **🗄️ Database ERD** | 14 tables with complete schema | [DATABASE_ERD.md](docs/diagrams/DATABASE_ERD.md) |

### Phase 2: Setup & Development

| Document | Description | Link |
|----------|-------------|------|
| **⚙️ Setup Guide** | Environment setup & deployment | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| **📖 Phase 2C/2D Guide** | Development workflow | [PHASE_2C_2D_GUIDE.md](PHASE_2C_2D_GUIDE.md) |

---

## 🏛️ System Architecture (Quick Overview)

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend (Next.js 15 + React 19)               │
│  Student Portal | Institution Dashboard | Employer Portal   │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API
┌───────────────────────────▼─────────────────────────────────┐
│           Backend API (Node.js + Express + TypeScript)      │
│  Authentication | Certificate Management | Blockchain       │
└───┬───────────────────────┬───────────────────────┬─────────┘
    │                       │                       │
    ▼                       ▼                       ▼
┌──────────┐      ┌────────────────────┐    ┌──────────────┐
│PostgreSQL│      │ ML Service (Python)│    │  Blockchain  │
│ Database │      │ - OCR (Tesseract)  │    │  (Ethereum/  │
│          │      │ - Fraud Detection  │    │   Polygon)   │
│ 14 Tables│      │ - Skill Extraction │    │              │
└──────────┘      └────────────────────┘    └──────────────┘
```

**📖 Full Architecture:** [docs/diagrams/ARCHITECTURE.md](docs/diagrams/ARCHITECTURE.md)

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js + React | 15.5.6 / 19.2.0 |
| **Backend** | Node.js + Express + TypeScript | 20 LTS |
| **Blockchain** | Ethereum (Sepolia) / Polygon PoS | Solidity ^0.8.0 |
| **Database** | PostgreSQL | 15+ |
| **ML/AI** | Python + PyTorch + Transformers | 3.11+ / 2.1+ |
| **OCR** | Tesseract / PaddleOCR | Latest |
| **Web3** | ethers.js | 6.x |

**📖 Complete Stack Details:** [docs/PHASE1_TECHNICAL_CONCEPTION.md#technology-stack](docs/PHASE1_TECHNICAL_CONCEPTION.md#technology-stack)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose

### Installation

```powershell
# Clone repository
git clone <your-repo-url>
cd Blockchain-Certificate-Verification-System

# Install dependencies
npm install

# Setup database
psql -U postgres -d credential_chain -f database/migrations/001_initial_schema.sql

# Setup ML service
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Run all services
docker-compose up
```

**📖 Detailed Setup:** [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 🤖 AI/ML Features (Mandatory)

### 1. Document/PDF Scanning
- **OCR**: Tesseract/PaddleOCR for multi-language text extraction
- **Layout Understanding**: LayoutLMv3 for field detection
- **QR/Barcode**: Automatic verification code extraction

### 2. Fraud Detection
- **Visual Forensics**: CNN-based tampering detection
- **Signature Verification**: Siamese network matching
- **Anomaly Detection**: Autoencoder-based outlier detection
- **Template Matching**: Embedding similarity analysis

### 3. Skill Extraction (NLP)
- **Named Entity Recognition**: XLM-RoBERTa for skill extraction
- **Taxonomy Mapping**: O*NET/ESCO standardization
- **Proficiency Scoring**: ML-based level inference

**📖 AI/ML Details:** [docs/PHASE1_TECHNICAL_CONCEPTION.md#aiml-integration-mandatory](docs/PHASE1_TECHNICAL_CONCEPTION.md#aiml-integration-mandatory)

---

## 📊 Datasets (10+ Sources)

| Dataset | Source | Use Case |
|---------|--------|----------|
| Certificate Dataset | Kaggle | Training classification |
| CASIA Tampering | Public | Fraud detection |
| O*NET Skills | Government | Skill taxonomy |
| ESCO Taxonomy | EU | Multi-language skills |
| SynthText | GitHub | OCR training |

**📖 Complete Dataset List:** [docs/DATASETS.md](docs/DATASETS.md)

---

## 📁 Project Structure

```
Blockchain-Certificate-Verification-System/
├── app/                          # Next.js 15 frontend
│   ├── (auth)/                   # Login/Register
│   └── (dashboard)/              # Student/Institution/Employer/Admin
├── backend/                      # Node.js API
│   └── src/
│       ├── routes/               # API endpoints
│       ├── services/             # Business logic
│       └── middleware/           # Auth, logging, errors
├── blockchain/                   # Smart contracts
│   ├── contracts/                # Solidity files
│   └── scripts/                  # Deploy scripts
├── ml-service/                   # Python ML service
│   ├── src/
│   │   ├── services/             # OCR, fraud, skills
│   │   └── routes/               # FastAPI endpoints
│   └── scripts/                  # Training scripts
├── database/                     # PostgreSQL
│   └── migrations/               # SQL schema
├── docs/                         # Documentation
│   ├── PHASE1_TECHNICAL_CONCEPTION.md
│   ├── DATASETS.md
│   ├── CODE_VERIFICATION.md
│   └── diagrams/
│       ├── ARCHITECTURE.md
│       ├── USE_CASES.md
│       ├── SEQUENCES.md
│       └── DATABASE_ERD.md
├── components/                   # React components
├── public/                       # Static assets
└── README.md                     # This file
```

---

## 🎯 User Roles & Features

### 👨‍🎓 Students
- Upload physical certificates for AI scanning
- View AI validation scores
- Share verified credentials
- Maintain digital portfolio

### 🏫 Institutions
- Issue blockchain-backed certificates
- Bulk upload with AI processing
- Review fraud alerts
- Manage course catalogs

### 💼 Employers
- Instant certificate verification
- View AI confidence scores
- Access skill-matched candidates
- No intermediaries needed

### 👨‍💼 Administrators
- Manage platform users
- Monitor AI/ML models
- Retrain models
- Review fraud alerts

**📖 Detailed Use Cases:** [docs/diagrams/USE_CASES.md](docs/diagrams/USE_CASES.md)

---

## 🔐 Security Features

- 🔒 **End-to-End Encryption**: AES-256 for file storage
- 🔑 **JWT Authentication**: 24-hour token expiry
- 🛡️ **Role-Based Access Control**: 5 user roles
- 🔗 **Blockchain Immutability**: Tamper-proof records
- 🤖 **AI Fraud Detection**: Multi-model verification
- 📝 **Audit Logging**: Complete compliance trail

---

## 📈 Development Roadmap

- ✅ **Phase 1**: Technical Conception (COMPLETE)
  - Architecture design
  - AI/ML integration plan
  - Dataset identification
  - Code verification

- ⏳ **Phase 2**: Environment Setup (NEXT)
  - Docker configuration
  - Local blockchain
  - ML environment
  - Frontend template selection

- 🔜 **Phase 3**: Development
  - Core features implementation
  - ML model training
  - Smart contract deployment

- 🔜 **Phase 4**: Testing & Deployment
  - Unit/integration tests
  - Security audits
  - Production deployment

---

## 🤝 Contributing

This project is currently in **Phase 1 (Technical Conception)**. Development contributions will be accepted starting in Phase 3.

---

## 📞 Contact & Support

- **Project Lead**: YasserAet
- **Date Created**: November 14, 2025
- **Current Phase**: Phase 1 Complete ✅

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🌟 Key Highlights

- 🎯 **95% Code Alignment** with Phase 1 specs
- 🤖 **AI-First Design** with mandatory ML integration
- 💰 **Cost-Optimized**: Free/open-source stack
- 🌍 **International**: Multi-language support
- 🔒 **Security-First**: Multiple security layers
- 📊 **Data-Driven**: 10+ dataset sources
- ⚡ **Scalable**: Designed for 1000s of users

---

**🚀 Status: Phase 1 Complete - Ready for Phase 2 upon approval!**

For questions or to approve Phase 2, review [docs/PHASE1_TECHNICAL_CONCEPTION.md](docs/PHASE1_TECHNICAL_CONCEPTION.md)
