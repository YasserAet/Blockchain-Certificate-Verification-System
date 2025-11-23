# System Architecture - Blockchain Certificate Verification

## High-Level Architecture (6-Layer Design)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │   Student    │  │  Institution  │  │   Employer   │  │    Admin     ││
│  │   Portal     │  │  Dashboard    │  │   Portal     │  │  Dashboard   ││
│  │  (Next.js)   │  │  (Next.js)    │  │  (Next.js)   │  │  (Next.js)   ││
│  └──────┬───────┘  └──────┬────────┘  └──────┬───────┘  └──────┬───────┘│
│         │                  │                   │                  │       │
│         └──────────────────┴───────────────────┴──────────────────┘       │
│                                     │                                     │
│                              HTTPS/REST API                               │
└─────────────────────────────────────┼─────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼─────────────────────────────────────┐
│                        APPLICATION LAYER                                  │
│                     ┌────────────────┴────────────────┐                   │
│                     │   Backend API (Node.js/Express)  │                   │
│                     │                                  │                   │
│                     │  ┌────────────────────────────┐  │                   │
│                     │  │  API Gateway & Router       │  │                   │
│                     │  │  - /auth                    │  │                   │
│                     │  │  - /certificates            │  │                   │
│                     │  │  - /verification            │  │                   │
│                     │  │  - /ml                      │  │                   │
│                     │  └────────────────────────────┘  │                   │
│                     │                                  │                   │
│                     │  ┌────────────────────────────┐  │                   │
│                     │  │  Middleware                 │  │                   │
│                     │  │  - JWT Auth                 │  │                   │
│                     │  │  - Role-Based Access        │  │                   │
│                     │  │  - Rate Limiting            │  │                   │
│                     │  │  - Error Handler            │  │                   │
│                     │  └────────────────────────────┘  │                   │
│                     │                                  │                   │
│                     │  ┌────────────────────────────┐  │                   │
│                     │  │  Business Logic Services    │  │                   │
│                     │  │  - User Service             │  │                   │
│                     │  │  - Certificate Service      │  │                   │
│                     │  │  - Blockchain Service       │  │                   │
│                     │  │  - Storage Service          │  │                   │
│                     │  │  - ML Service Client        │  │                   │
│                     │  └────────────────────────────┘  │                   │
│                     └──────┬────────────────┬──────────┘                   │
│                            │                │                              │
└────────────────────────────┼────────────────┼──────────────────────────────┘
                             │                │
        ┌────────────────────┘                └────────────────────┐
        │                                                           │
┌───────┴───────────────────────────┐    ┌────────────────────────┴─────────┐
│      AI/ML PROCESSING LAYER       │    │    BLOCKCHAIN LAYER              │
│                                   │    │                                  │
│  ┌─────────────────────────────┐  │    │  ┌────────────────────────────┐  │
│  │  ML Service (FastAPI/Python) │  │    │  │  Smart Contracts (Solidity)│  │
│  │                              │  │    │  │                            │  │
│  │  ┌────────────────────────┐  │  │    │  │  ┌──────────────────────┐  │  │
│  │  │ Document Processing    │  │  │    │  │  │ CertificateRegistry  │  │  │
│  │  │ - PDF → Images         │  │  │    │  │  │  - issueCertificate()│  │  │
│  │  │ - Image Preprocessing  │  │  │    │  │  │  - verifyCertificate│  │  │
│  │  │ - OCR (Tesseract)      │  │  │    │  │  │  - revokeCertificate│  │  │
│  │  └────────────────────────┘  │  │    │  │  └──────────────────────┘  │  │
│  │                              │  │    │  │                            │  │
│  │  ┌────────────────────────┐  │  │    │  │  ┌──────────────────────┐  │  │
│  │  │ Text Extraction        │  │  │    │  │  │ FraudDetectionStore  │  │  │
│  │  │ - LayoutLMv3           │  │  │    │  │  │  - storeFraudResult()│  │  │
│  │  │ - Field Detection      │  │  │    │  │  │  - getFraudScore()   │  │  │
│  │  │ - QR/Barcode Reader    │  │  │    │  │  └──────────────────────┘  │  │
│  │  └────────────────────────┘  │  │    │  │                            │  │
│  │                              │  │    │  │  ┌──────────────────────┐  │  │
│  │  ┌────────────────────────┐  │  │    │  │  │ SkillValidator       │  │  │
│  │  │ Classification         │  │  │    │  │  │  - validateSkills()  │  │  │
│  │  │ - Cert Type Classifier │  │  │    │  │  │  - getSkillsForCert()│  │  │
│  │  │ - Issuer Recognition   │  │  │    │  │  └──────────────────────┘  │  │
│  │  └────────────────────────┘  │  │    │  │                            │  │
│  │                              │  │    │  │ Deployment:                │  │
│  │  ┌────────────────────────┐  │  │    │  │ - Ethereum Sepolia (Test) │  │
│  │  │ Fraud Detection        │  │  │    │  │ - Polygon PoS (Production)│  │
│  │  │ - Visual Forensics CNN │  │  │    │  │ - Hardhat (Local Dev)     │  │
│  │  │ - Signature Verify     │  │  │    │  └────────────────────────────┘  │
│  │  │ - Template Matching    │  │  │    └──────────────────────────────────┘
│  │  │ - Anomaly Detection    │  │  │
│  │  └────────────────────────┘  │  │
│  │                              │  │
│  │  ┌────────────────────────┐  │  │
│  │  │ Skill Extraction (NLP) │  │  │
│  │  │ - XLM-RoBERTa NER      │  │  │
│  │  │ - Taxonomy Mapping     │  │  │
│  │  │ - Proficiency Scoring  │  │  │
│  │  └────────────────────────┘  │  │
│  │                              │  │
│  │  Models:                     │  │
│  │  - PyTorch + Transformers    │  │
│  │  - scikit-learn              │  │
│  │  - OpenCV, PIL               │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                     │
│                                                                         │
│  ┌──────────────────────┐        ┌─────────────────────────────────┐   │
│  │  PostgreSQL Database │        │  Blob/Object Storage            │   │
│  │                      │        │  (Encrypted Files)              │   │
│  │  Tables:             │        │                                 │   │
│  │  - users             │        │  - Certificate Images (encrypted)│  │
│  │  - institutions      │        │  - Uploaded PDFs (encrypted)    │   │
│  │  - certificates      │        │  - Processed Images             │   │
│  │  - extracted_data    │        │  - QR Codes                     │   │
│  │  - validation_scores │        │                                 │   │
│  │  - fraud_detection   │        │  Storage:                       │   │
│  │  - fraud_alerts      │        │  - Local: ./uploads (Dev)       │   │
│  │  - skills            │        │  - Production: S3/MinIO         │   │
│  │  - student_skills    │        │  - IPFS (Optional)              │   │
│  │  - verifications     │        └─────────────────────────────────┘   │
│  │  - blockchain_tx     │                                               │
│  │  - audit_logs        │                                               │
│  │                      │                                               │
│  │  Features:           │                                               │
│  │  - JSONB for metadata│                                               │
│  │  - Full-text search  │                                               │
│  │  - Indexes on hashes │                                               │
│  │  - Connection pooling│                                               │
│  └──────────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES LAYER                            │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐   │
│  │ Email Service   │  │ IPFS Nodes      │  │ Blockchain RPC       │   │
│  │ (SMTP/SendGrid) │  │ (Decentralized  │  │ (Infura/Alchemy)     │   │
│  │ - Notifications │  │  Storage)       │  │ - Sepolia Testnet    │   │
│  │ - Alerts        │  │                 │  │ - Polygon Mainnet    │   │
│  └─────────────────┘  └─────────────────┘  └──────────────────────────┘   │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐   │
│  │ Analytics       │  │ Monitoring      │  │ Logging              │   │
│  │ (Optional)      │  │ (Health Checks) │  │ (Winston/Morgan)     │   │
│  └─────────────────┘  └─────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

```
┌─────────┐
│ Student │
└────┬────┘
     │ 1. Upload Certificate
     ▼
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │ 2. POST /api/certificates/upload
       ▼
┌──────────────────┐
│  Backend API     │◄──────┐
└──────┬───────────┘       │
       │ 3. Store Blob     │ 7. Save Results
       ▼                   │
┌──────────────────┐       │
│ PostgreSQL + S3  │       │
└──────────────────┘       │
       │                   │
       │ 4. Enqueue Job    │
       ▼                   │
┌──────────────────┐       │
│  ML Service      │───────┘
│  (Python)        │
└──────┬───────────┘
       │ 5. Process: OCR → Extract → Fraud Check
       │
       │ 6. Institution Reviews
       ▼
┌──────────────────┐
│  Blockchain      │
│  (Ethereum/      │
│   Polygon)       │
└──────────────────┘
       │ 8. Certificate Hash Recorded
       ▼
    [VERIFIED]
```

## Technology Stack Details

### Frontend (Presentation Layer)
- **Framework**: Next.js 15 (React 19)
- **Styling**: TailwindCSS v4
- **Components**: Radix UI + shadcn/ui
- **State**: React Hooks + Context API
- **Web3**: ethers.js v6
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel (serverless, auto-scale)

### Backend (Application Layer)
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Language**: TypeScript
- **Auth**: JWT + bcrypt
- **Validation**: Zod
- **HTTP Client**: Axios
- **Blockchain**: ethers.js
- **Deployment**: Docker containers

### AI/ML Service (Processing Layer)
- **Framework**: FastAPI (Python 3.11+)
- **ML Frameworks**:
  - PyTorch 2.1+
  - Transformers (Hugging Face)
  - scikit-learn
- **OCR**: Tesseract / PaddleOCR
- **Document Processing**: pdf2image, OpenCV, PIL
- **NLP**: XLM-RoBERTa, Sentence-BERT
- **Model Serving**: FastAPI endpoints
- **Deployment**: Docker + GPU optional

### Blockchain Layer
- **Platform**: Ethereum (EVM-compatible)
- **Test Network**: Sepolia
- **Production**: Polygon PoS (low gas fees)
- **Smart Contracts**: Solidity ^0.8.0
- **Development**: Hardhat
- **Libraries**: OpenZeppelin
- **RPC Providers**: Infura / Alchemy

### Database Layer
- **Primary DB**: PostgreSQL 15+
- **Features**: JSONB, Full-text search, Connection pooling
- **Blob Storage**: S3-compatible (MinIO for dev, AWS S3 for prod)
- **Optional**: IPFS for decentralized storage

### External Services
- **Email**: SMTP / SendGrid (notifications)
- **Monitoring**: Health check endpoints
- **Logging**: Winston + Morgan
- **Analytics**: Optional (Google Analytics)

## Security Architecture

```
┌────────────────────────────────────────────────┐
│              SECURITY LAYERS                    │
├────────────────────────────────────────────────┤
│  1. HTTPS/TLS Encryption (All traffic)         │
├────────────────────────────────────────────────┤
│  2. JWT Authentication (24h expiry)            │
├────────────────────────────────────────────────┤
│  3. Role-Based Access Control (RBAC)           │
│     - Student, Institution, Employer, Admin    │
├────────────────────────────────────────────────┤
│  4. Data Encryption at Rest (AES-256)          │
│     - Certificate images encrypted             │
│     - Passwords: bcrypt (salt rounds: 12)      │
├────────────────────────────────────────────────┤
│  5. Blockchain Security                        │
│     - Smart contract access control            │
│     - Issuer whitelist                         │
│     - Multi-sig for admin (future)             │
├────────────────────────────────────────────────┤
│  6. Input Validation & Sanitization            │
│     - Zod schemas on frontend & backend        │
│     - SQL injection prevention (parameterized) │
│     - XSS protection (CSP headers)             │
├────────────────────────────────────────────────┤
│  7. Rate Limiting                              │
│     - API: 100 req/min per IP                  │
│     - Upload: 10 files/hour per user           │
├────────────────────────────────────────────────┤
│  8. Audit Logging                              │
│     - All critical actions logged              │
│     - User activity tracking                   │
│     - Blockchain transaction history           │
└────────────────────────────────────────────────┘
```

## Scalability & Performance

### Horizontal Scaling Strategy
```
┌──────────────────┐
│  Load Balancer   │
└────────┬─────────┘
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Backend │ │Backend │ │Backend │ │Backend │
│ Node 1 │ │ Node 2 │ │ Node 3 │ │ Node N │
└────────┘ └────────┘ └────────┘ └────────┘
    │         │        │        │
    └─────────┴────────┴────────┘
              ▼
    ┌──────────────────┐
    │ PostgreSQL       │
    │ + Read Replicas  │
    └──────────────────┘
```

### Caching Strategy
- **Redis** (optional): Session storage, API response caching
- **CDN**: Static assets (frontend)
- **Database**: Query result caching

### Async Processing
- **Message Queue**: Redis/RQ or RabbitMQ
- **Workers**: Celery for ML processing
- **Background Jobs**: Certificate processing, bulk uploads

### Performance Targets
- **API Response**: <200ms (90th percentile)
- **ML Processing**: 10-30 seconds per certificate
- **Blockchain Verification**: <1 second (read)
- **Blockchain Issuance**: 15-180 seconds (depends on network)
- **Concurrent Users**: 1000+ supported
- **Daily Throughput**: 20-50 certificate uploads

## Deployment Architecture

### Development Environment
```
Docker Compose:
  - PostgreSQL container
  - Backend API container
  - ML Service container
  - Frontend (npm run dev)
  - Local Hardhat blockchain
```

### Production Environment
```
Cloud Architecture:
  - Frontend: Vercel (serverless)
  - Backend: AWS ECS / Docker Swarm
  - ML Service: AWS ECS with GPU (optional)
  - Database: AWS RDS PostgreSQL
  - Storage: AWS S3
  - Blockchain: Polygon PoS (via Infura RPC)
  - Monitoring: CloudWatch / Prometheus
```

## Data Flow Summary

1. **Upload**: Student → Frontend → Backend → Encrypted Storage
2. **Process**: Backend → ML Service (OCR, Extract, Fraud) → Results stored
3. **Review**: Institution → Frontend → Backend → Approve/Reject
4. **Issue**: Backend → Blockchain (issueCertificate) → On-chain record
5. **Verify**: Employer → Frontend → Backend → Blockchain query → Result

## API Gateway Routes

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/signup` | POST | - | User registration |
| `/api/auth/login` | POST | - | Authentication |
| `/api/certificates/upload` | POST | JWT | Upload certificate |
| `/api/certificates/:id` | GET | JWT | Get certificate details |
| `/api/certificates/verify/:hash` | GET | JWT | Verify certificate |
| `/api/ml/process` | POST | Internal | Trigger ML processing |
| `/api/admin/institutions` | GET | Admin | Manage institutions |
| `/api/admin/users` | GET | Admin | User management |

## Next Architecture Enhancements (Future)
- [ ] GraphQL API (replace REST)
- [ ] WebSocket for real-time updates
- [ ] Microservices architecture (split services)
- [ ] Kubernetes orchestration
- [ ] Multi-region deployment
- [ ] Event-driven architecture (Kafka/EventBridge)
