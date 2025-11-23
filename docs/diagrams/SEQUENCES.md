# Sequence Diagrams - Certificate Verification System

## 1. Certificate Upload & AI Processing Flow

```
Student          Frontend        Backend API      ML Service      Database      Blockchain
  │                 │                │                │              │                │
  │──Select File──>│                │                │              │                │
  │                 │──POST/upload──>│                │              │                │
  │                 │                │──Store Blob───>│              │                │
  │                 │                │                │              │                │
  │                 │                │──POST/process─>│              │                │
  │                 │                │                │──OCR         │                │
  │                 │                │                │  Extract     │                │
  │                 │                │                │  Classify    │                │
  │                 │                │                │  FraudCheck  │                │
  │                 │                │<──Results─────────────────────│                │
  │                 │                │                │              │                │
  │                 │                │──Save Results───────────────>│                │
  │                 │                │                │              │                │
  │                 │<──Upload OK────│                │              │                │
  │<─Pending Review─│                │                │              │                │
  │                 │                │                │              │                │
  
  [Institution reviews and approves]
  
Institution      Frontend        Backend API      ML Service      Database      Blockchain
  │                 │                │                │              │                │
  │──Review Cert──>│                │                │              │                │
  │                 │──GET/cert/123─>│                │              │                │
  │                 │                │──Query──────────────────────>│                │
  │                 │                │<──Cert+AI Data──────────────>│                │
  │                 │<──Display Data─│                │              │                │
  │<─View OCR+Fraud─│                │                │              │                │
  │                 │                │                │              │                │
  │──Approve──────>│                │                │              │                │
  │                 │──POST/approve─>│                │              │                │
  │                 │                │──Compute Hash────────────────│                │
  │                 │                │                │              │                │
  │                 │                │──issueCertificate()──────────────────────────>│
  │                 │                │                │              │<─TxHash────────│
  │                 │                │──Save TxHash─────────────────>│                │
  │                 │                │──Update Status───────────────>│                │
  │                 │                │                │              │                │
  │                 │<──Success─────>│                │              │                │
  │<─Cert Issued───>│                │                │              │                │
```

**Key Steps:**
1. Student uploads certificate (PDF/image)
2. Backend stores encrypted blob
3. ML service processes: OCR → Extract → Classify → Fraud detect
4. Results saved to database (pending)
5. Institution reviews AI extraction
6. Institution approves → Blockchain transaction
7. Certificate hash recorded on-chain
8. Student notified

---

## 2. Certificate Verification Flow (Employer)

```
Employer         Frontend        Backend API      Database      Blockchain
  │                 │                │                │                │
  │──Enter Hash───>│                │                │                │
  │    or Scan QR   │                │                │                │
  │                 │                │                │                │
  │                 │──GET/verify───>│                │                │
  │                 │    /:hash      │                │                │
  │                 │                │                │                │
  │                 │                │──Query Blockchain────────────>│
  │                 │                │                │<──Certificate─│
  │                 │                │                │   Data        │
  │                 │                │                │                │
  │                 │                │──Get AI Scores─────────────>   │
  │                 │                │<──Fraud Score,───────────────  │
  │                 │                │   OCR Confidence               │
  │                 │                │                                │
  │                 │<──Verification Results────────────              │
  │                 │   {                                             │
  │                 │     valid: true,                                │
  │                 │     issuer: "MIT",                              │
  │                 │     student: "0x...",                           │
  │                 │     aiConfidence: 0.96,                         │
  │                 │     fraudScore: 0.02                            │
  │                 │   }                                             │
  │<─Display Status─│                                                 │
  │  ✓ VALID                                                          │
  │  Confidence: 96%                                                  │
  │  Fraud Risk: Low                                                  │
```

**Key Steps:**
1. Employer enters certificate hash or scans QR code
2. Backend queries blockchain for certificate record
3. Backend retrieves AI validation scores from database
4. Combined results returned to frontend
5. Employer sees: Valid/Invalid + AI confidence + Fraud score

---

## 3. User Authentication Flow

```
User             Frontend        Backend API      Database
  │                 │                │                │
  │──Enter Email───>│                │                │
  │   & Password    │                │                │
  │                 │                │                │
  │                 │──POST/login───>│                │
  │                 │    {email,pwd} │                │
  │                 │                │                │
  │                 │                │──Query User────>│
  │                 │                │<──User Data────│
  │                 │                │                │
  │                 │                │──Verify bcrypt──│
  │                 │                │   Hash          │
  │                 │                │                │
  │                 │                │──Generate JWT───│
  │                 │                │                │
  │                 │<──{token, user}│                │
  │                 │                │                │
  │<─Store Token────│                │                │
  │  in localStorage│                │                │
  │                 │                │                │
  │──Access Page──>│                │                │
  │                 │──API Call─────>│                │
  │                 │  + Auth Header │                │
  │                 │                │──Verify JWT────│
  │                 │                │──Check Role────│
  │                 │                │                │
  │                 │<──Protected────│                │
  │                 │   Data         │                │
  │<─Render Page────│                │                │
```

**Key Steps:**
1. User enters credentials
2. Backend verifies password (bcrypt)
3. Generate JWT token (24h expiry)
4. Frontend stores token
5. Subsequent requests include Authorization header
6. Backend validates JWT and role permissions

---

## 4. Fraud Detection Detailed Flow

```
Backend          ML Service       Fraud Models     Database
  │                 │                │                │
  │──POST/detect───>│                │                │
  │  {image_b64}    │                │                │
  │                 │                │                │
  │                 │──Preprocess────│                │
  │                 │  (Denoise,     │                │
  │                 │   Deskew)      │                │
  │                 │                │                │
  │                 │──Visual CNN───>│                │
  │                 │                │──Analyze Pixels│
  │                 │                │  Resampling    │
  │                 │                │  Artifacts     │
  │                 │<──Forgery Score│                │
  │                 │   0.15         │                │
  │                 │                │                │
  │                 │──Signature────>│                │
  │                 │  Verify        │──Compare       │
  │                 │                │  Signatures    │
  │                 │<──Match Score──│                │
  │                 │   0.92         │                │
  │                 │                │                │
  │                 │──Template─────>│                │
  │                 │  Match         │──Check Layout  │
  │                 │                │  vs Known      │
  │                 │<──Similarity───│                │
  │                 │   0.89         │                │
  │                 │                │                │
  │                 │──Anomaly──────>│                │
  │                 │  Detection     │──Autoencoder   │
  │                 │                │  Reconstruction│
  │                 │<──Anomaly Score│                │
  │                 │   0.08         │                │
  │                 │                │                │
  │                 │──Aggregate─────│                │
  │                 │  Scores        │                │
  │                 │  Final = 0.03  │                │
  │                 │                │                │
  │<──Fraud Result──│                │                │
  │  {                                                │
  │    isFraud: false,                                │
  │    confidence: 0.97,                              │
  │    fraudScore: 0.03,                              │
  │    details: {                                     │
  │      visual: 0.15,                                │
  │      signature: 0.08,                             │
  │      template: 0.11,                              │
  │      anomaly: 0.08                                │
  │    }                                              │
  │  }                                                │
  │                                                   │
  │──Save Result──────────────────────────────────>  │
```

**Models Used:**
- Visual Forensics CNN: Detects pixel-level tampering
- Signature Verification: Siamese network comparison
- Template Matching: Embedding similarity
- Anomaly Detection: Autoencoder reconstruction error

---

## 5. Blockchain Transaction Flow

```
Backend          Web3/Ethers      Blockchain       Database
  │                 │                │                │
  │──Issue Cert────>│                │                │
  │  {hash,student, │                │                │
  │   issuer}       │                │                │
  │                 │                │                │
  │                 │──Build TX─────>│                │
  │                 │  issueCert()   │                │
  │                 │                │──Validate      │
  │                 │                │  Issuer        │
  │                 │                │──Check Exists  │
  │                 │                │                │
  │                 │                │──Execute       │
  │                 │                │  Contract      │
  │                 │                │──Emit Event    │
  │                 │                │                │
  │                 │<──TxHash───────│                │
  │                 │   0xabc...     │                │
  │                 │                │                │
  │<─TxHash─────────│                │                │
  │                 │                │                │
  │──Save TX───────────────────────────────────────>│
  │  {txHash,                                        │
  │   certId,                                        │
  │   status: pending}                               │
  │                 │                │                │
  │  [Wait for confirmation]         │                │
  │                 │                │                │
  │──Poll Status───>│                │                │
  │                 │──Get Receipt──>│                │
  │                 │                │──Block Mined   │
  │                 │<──Confirmed────│                │
  │                 │   Block: 12345 │                │
  │<─Confirmed─────>│                │                │
  │                 │                │                │
  │──Update Status─────────────────────────────────>│
  │  {status: confirmed,                             │
  │   blockNumber: 12345}                            │
```

**Key Steps:**
1. Backend prepares transaction data
2. Web3/ethers.js builds transaction
3. Blockchain validates issuer (whitelist)
4. Smart contract executes `issueCertificate()`
5. Transaction hash returned immediately
6. Backend polls for confirmation
7. Once mined, update database with block number

---

## 6. Skill Extraction & Matching Flow

```
Backend          ML Service       NLP Models       Database
  │                 │                │                │
  │──Extract Skills>│                │                │
  │  {certText}     │                │                │
  │                 │                │                │
  │                 │──Tokenize─────>│                │
  │                 │  Text          │──XLM-RoBERTa   │
  │                 │                │  NER           │
  │                 │                │                │
  │                 │<──Entities─────│                │
  │                 │  ["Python",    │                │
  │                 │   "Machine     │                │
  │                 │    Learning",  │                │
  │                 │   "TensorFlow"]│                │
  │                 │                │                │
  │                 │──Map to────────>│                │
  │                 │  Taxonomy      │──Query O*NET   │
  │                 │                │  ESCO          │
  │                 │                │                │
  │                 │<──Normalized───│                │
  │                 │  Skills        │                │
  │                 │  [{             │                │
  │                 │    name: "Python│                │
  │                 │     Programming"│                │
  │                 │    onetId: "123"│                │
  │                 │    level: "adv"│                │
  │                 │  }]            │                │
  │                 │                │                │
  │<─Skills List────│                │                │
  │                 │                │                │
  │──Save Skills──────────────────────────────────>│
  │  to student_skills table                        │
```

**NLP Pipeline:**
1. Text preprocessing (lowercase, remove special chars)
2. Named Entity Recognition (skill extraction)
3. Taxonomy mapping (O*NET/ESCO)
4. Proficiency level inference
5. Store in database

---

## 7. Institution Bulk Upload Flow

```
Institution      Frontend        Backend API      ML Service      Database
  │                 │                │                │                │
  │──Upload CSV────>│                │                │                │
  │  + PDFs         │                │                │                │
  │                 │                │                │                │
  │                 │──POST/bulk────>│                │                │
  │                 │  upload        │                │                │
  │                 │                │──Parse CSV─────│                │
  │                 │                │                │                │
  │                 │                │──For each cert:│                │
  │                 │                │                │                │
  │                 │                │──Process PDF──>│                │
  │                 │                │                │──OCR           │
  │                 │                │                │  Extract       │
  │                 │                │                │  Fraud Check   │
  │                 │                │<──Results──────│                │
  │                 │                │                │                │
  │                 │                │──Store Temp────>│                │
  │                 │                │                │                │
  │                 │<──Progress─────│                │                │
  │                 │   50% done     │                │                │
  │<─Show Progress──│                │                │                │
  │                 │                │                │                │
  │                 │<──All Processed│                │                │
  │<─Review Results─│                │                │                │
  │  [List of certs │                │                │                │
  │   with AI scores]│               │                │                │
  │                 │                │                │                │
  │──Approve All───>│                │                │                │
  │                 │──Batch Issue──>│                │                │
  │                 │                │                │                │
  │                 │                │──For each:     │                │
  │                 │                │  Blockchain TX─>│                │
  │                 │                │                │                │
  │                 │<──Success─────>│                │                │
  │<─Bulk Issued────│                │                │                │
```

**Bulk Processing:**
1. Upload CSV with student data + PDF files
2. Backend queues each certificate
3. ML service processes in parallel/batch
4. Results stored temporarily
5. Institution reviews aggregated results
6. Batch blockchain transactions
7. All certificates issued

---

## 8. Real-time Fraud Alert Flow

```
ML Service       Backend          Institution      Frontend
  │                 │                │                │
  │──Fraud Detected>│                │                │
  │  {certId,       │                │                │
  │   score: 0.85}  │                │                │
  │                 │                │                │
  │                 │──Create Alert─>│                │
  │                 │                │                │
  │                 │──Send Email───>│                │
  │                 │  Notification  │                │
  │                 │                │                │
  │                 │                │<─Login─────────│
  │                 │                │                │
  │                 │<──GET/alerts───│                │
  │                 │                │                │
  │                 │──Query DB─────>│                │
  │                 │<──Alert List───│                │
  │                 │                │                │
  │                 │───Alerts──────>│                │
  │                 │                │                │
  │                 │                │──View Details─>│
  │                 │                │<──Cert+AI Data─│
  │                 │                │                │
  │                 │                │──Manual Review─│
  │                 │                │                │
  │                 │                │──Approve/Reject│
  │                 │                │                │
  │                 │<──Decision─────│                │
  │                 │  REJECT        │                │
  │                 │                │                │
  │                 │──Update Status─>│               │
  │                 │  Flagged       │                │
```

**Alert Triggers:**
- Fraud score > 0.7 (high risk)
- OCR confidence < 0.5 (poor quality)
- Signature mismatch detected
- Template doesn't match known issuer

---

## Timing Estimates

| Flow | Average Duration | Notes |
|------|-----------------|-------|
| Upload + AI Process | 10-30 seconds | Depends on PDF size |
| Verification Query | <1 second | Blockchain read |
| Fraud Detection | 5-15 seconds | Multiple models |
| Blockchain TX | 15-180 seconds | Depends on network |
| Bulk Upload (100) | 20-40 minutes | Parallel processing |
| Authentication | <500ms | JWT validation |

---

## Error Handling Sequences

### Certificate Upload Failure
```
Student → Frontend → Backend → ML Service [ERROR]
                    ↓
            Backend catches error
                    ↓
            Log error to database
                    ↓
            Return user-friendly message
                    ↓
Frontend displays: "Processing failed, please try again"
```

### Blockchain Transaction Failure
```
Backend → Blockchain [GAS ERROR]
    ↓
Retry with higher gas
    ↓
Still fails → Fallback to L2 (Polygon)
    ↓
Success → Update database
```

---

**All sequences support:**
- ✅ Async/await error handling
- ✅ Transaction rollback on failure
- ✅ Retry logic with exponential backoff
- ✅ Comprehensive logging for debugging
