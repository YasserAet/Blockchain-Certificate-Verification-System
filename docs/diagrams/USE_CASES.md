# Use Case Diagrams - Blockchain Certificate Verification System

## 1. Student/Learner Use Cases

```
┌─────────────────────────────────────────────────────────────┐
│                         STUDENT                              │
└─────────────────────────────────────────────────────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
┌─────────────┐      ┌─────────────────┐    ┌──────────────┐
│ Register    │      │ Upload Physical │    │ View         │
│ Account     │      │ Certificate     │    │ Certificates │
└─────────────┘      └─────────────────┘    └──────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌───────────────┐   ┌──────────────────┐
            │ AI Scans &    │   │ Share Certificate│
            │ Extracts Data │   │ with Employer    │
            └───────────────┘   └──────────────────┘
                    │
                    ▼
            ┌───────────────────┐
            │ View AI Validation│
            │ Score & Results   │
            └───────────────────┘
```

### Student Use Cases (Detailed)

**UC-S1: Register Account**
- Actor: New Student
- Precondition: None
- Flow: Enter email, password, name → Verify email → Create profile
- Postcondition: Account created, can login

**UC-S2: Upload Physical Certificate**
- Actor: Student
- Precondition: Logged in, has certificate image/PDF
- Flow: 
  1. Click "Upload Certificate"
  2. Select file (PDF/JPG/PNG)
  3. System encrypts and stores file
  4. AI service processes document (OCR, extraction, fraud check)
  5. Results displayed with confidence scores
- Postcondition: Certificate uploaded, pending institution verification

**UC-S3: View Certificates**
- Actor: Student
- Precondition: Logged in
- Flow: Navigate to "My Certificates" → View list → Click to see details
- Postcondition: Certificate details displayed

**UC-S4: Share Certificate**
- Actor: Student
- Precondition: Has verified certificate
- Flow: Select certificate → Generate share link/QR → Send to employer
- Postcondition: Shareable link created

**UC-S5: View AI Validation Results**
- Actor: Student
- Precondition: Certificate processed by AI
- Flow: View OCR confidence, fraud score, extracted fields
- Postcondition: Student sees AI analysis

---

## 2. Institution Use Cases

```
┌─────────────────────────────────────────────────────────────┐
│                      INSTITUTION                             │
└─────────────────────────────────────────────────────────────┘
                              │
       ┌──────────────────────┼────────────────────┐
       │                      │                    │
       ▼                      ▼                    ▼
┌─────────────┐      ┌─────────────────┐   ┌───────────────┐
│ Register &  │      │ Issue Digital   │   │ Review Fraud  │
│ Get Verified│      │ Certificate     │   │ Alerts        │
└─────────────┘      └─────────────────┘   └───────────────┘
                              │                    │
                              ▼                    ▼
                    ┌──────────────────┐   ┌───────────────┐
                    │ Bulk Upload      │   │ Verify Student│
                    │ Certificates     │   │ Uploads       │
                    └──────────────────┘   └───────────────┘
                              │                    │
                              ▼                    ▼
                    ┌──────────────────┐   ┌───────────────┐
                    │ AI Processes     │   │ Approve/Reject│
                    │ & Validates      │   │ Certificate   │
                    └──────────────────┘   └───────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Record on        │
                    │ Blockchain       │
                    └──────────────────┘
```

### Institution Use Cases (Detailed)

**UC-I1: Register and Get Verified**
- Actor: Institution Admin
- Precondition: None
- Flow: 
  1. Register with institution details
  2. Submit verification documents
  3. Admin reviews and approves
  4. Blockchain address whitelisted
- Postcondition: Institution can issue certificates

**UC-I2: Issue Digital Certificate**
- Actor: Institution
- Precondition: Verified institution, student completed course
- Flow:
  1. Enter student details and course info
  2. Generate certificate PDF
  3. System computes hash
  4. Submit to blockchain (issueCertificate)
  5. Student notified
- Postcondition: Certificate on blockchain

**UC-I3: Bulk Upload Certificates**
- Actor: Institution
- Precondition: Verified institution
- Flow:
  1. Upload CSV with student details
  2. Upload certificate PDFs
  3. AI processes each certificate
  4. Review extraction results
  5. Approve batch issuance
- Postcondition: Multiple certificates issued

**UC-I4: Review Fraud Alerts**
- Actor: Institution
- Precondition: Fraud detected by AI
- Flow:
  1. View fraud alert dashboard
  2. See suspicious certificates
  3. Review AI fraud score and reasons
  4. Investigate manually
  5. Approve or reject certificate
- Postcondition: Fraud resolved

**UC-I5: Verify Student Uploads**
- Actor: Institution
- Precondition: Student uploaded certificate claiming from this institution
- Flow:
  1. Receive notification
  2. View uploaded certificate and AI extraction
  3. Verify authenticity
  4. Approve or reject
- Postcondition: Certificate verified or flagged

---

## 3. Employer/Recruiter Use Cases

```
┌─────────────────────────────────────────────────────────────┐
│                    EMPLOYER/RECRUITER                        │
└─────────────────────────────────────────────────────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
┌─────────────┐      ┌─────────────────┐    ┌──────────────┐
│ Register    │      │ Verify          │    │ View AI      │
│ Account     │      │ Certificate     │    │ Confidence   │
└─────────────┘      └─────────────────┘    └──────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌───────────────┐   ┌──────────────────┐
            │ Scan QR Code  │   │ Enter Certificate│
            │ from Candidate│   │ Hash/ID          │
            └───────────────┘   └──────────────────┘
                    │
                    ▼
            ┌───────────────────┐
            │ Check Blockchain  │
            │ & Get Results     │
            └───────────────────┘
                    │
                    ▼
            ┌───────────────────┐
            │ View Fraud Score  │
            │ & Verification    │
            └───────────────────┘
```

### Employer Use Cases (Detailed)

**UC-E1: Register Account**
- Actor: Employer
- Precondition: None
- Flow: Register with company details → Verify email
- Postcondition: Can verify certificates

**UC-E2: Verify Certificate (Hash)**
- Actor: Employer
- Precondition: Candidate provides certificate hash
- Flow:
  1. Enter certificate hash
  2. System queries blockchain
  3. Display: Valid/Invalid, Issuer, Date, Student
  4. Show AI fraud confidence score
- Postcondition: Certificate authenticity confirmed

**UC-E3: Verify Certificate (QR Code)**
- Actor: Employer
- Precondition: Candidate shows QR code
- Flow:
  1. Scan QR code with mobile
  2. Redirects to verification page
  3. Blockchain lookup
  4. Display results
- Postcondition: Instant verification

**UC-E4: View AI Confidence Scores**
- Actor: Employer
- Precondition: Certificate verified
- Flow:
  1. After verification, view AI metrics
  2. See OCR confidence, fraud score, authenticity rating
  3. Review extracted skills
- Postcondition: Employer has full context

**UC-E5: Search Candidate Skills**
- Actor: Employer
- Precondition: Logged in
- Flow:
  1. Enter skill keywords
  2. System searches verified certificates
  3. AI matches skills to requirements
  4. Display ranked candidates
- Postcondition: Skill-matched candidates listed

---

## 4. System Administrator Use Cases

```
┌─────────────────────────────────────────────────────────────┐
│                   SYSTEM ADMINISTRATOR                       │
└─────────────────────────────────────────────────────────────┘
                              │
       ┌──────────────────────┼─────────────────────────┐
       │                      │                         │
       ▼                      ▼                         ▼
┌─────────────┐      ┌─────────────────┐       ┌──────────────┐
│ Manage Users│      │ Verify          │       │ Monitor AI   │
│ & Roles     │      │ Institutions    │       │ Models       │
└─────────────┘      └─────────────────┘       └──────────────┘
       │                      │                         │
       ▼                      ▼                         ▼
┌─────────────┐      ┌─────────────────┐       ┌──────────────┐
│ View Audit  │      │ Manage Blockchain│      │ Retrain ML   │
│ Logs        │      │ Transactions    │       │ Models       │
└─────────────┘      └─────────────────┘       └──────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Review System    │
                    │ Health & Metrics │
                    └──────────────────┘
```

### Administrator Use Cases (Detailed)

**UC-A1: Manage Users**
- Actor: Admin
- Precondition: Admin login
- Flow: View users → Edit roles → Suspend/activate accounts
- Postcondition: User permissions updated

**UC-A2: Verify Institutions**
- Actor: Admin
- Precondition: Institution applied for verification
- Flow:
  1. Review institution details
  2. Check documents
  3. Approve/reject
  4. Add issuer to blockchain whitelist
- Postcondition: Institution verified

**UC-A3: Monitor AI Model Performance**
- Actor: Admin
- Precondition: AI models deployed
- Flow:
  1. View model accuracy metrics
  2. Check fraud detection false positive rate
  3. Review OCR confidence trends
  4. Identify model drift
- Postcondition: Model health assessed

**UC-A4: Retrain ML Models**
- Actor: Admin
- Precondition: New training data available or model performance degrades
- Flow:
  1. Collect new labeled data
  2. Trigger retraining pipeline
  3. Validate new model
  4. Deploy to production
- Postcondition: Improved models live

**UC-A5: View Audit Logs**
- Actor: Admin
- Precondition: Admin login
- Flow: Filter logs by user/action/date → Export reports
- Postcondition: Compliance audit complete

**UC-A6: Monitor Blockchain Transactions**
- Actor: Admin
- Precondition: Blockchain integrated
- Flow:
  1. View transaction history
  2. Check gas usage
  3. Monitor failed transactions
  4. Resolve blockchain errors
- Postcondition: Blockchain health monitored

---

## 5. AI/ML System Use Cases

```
┌─────────────────────────────────────────────────────────────┐
│                   AI/ML PROCESSING SYSTEM                    │
└─────────────────────────────────────────────────────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
┌─────────────┐      ┌─────────────────┐    ┌──────────────┐
│ Receive     │      │ Preprocess      │    │ Run OCR      │
│ Certificate │      │ Image           │    │ Extraction   │
│ Upload      │      │ (Deskew, Denoise)│   └──────────────┘
└─────────────┘      └─────────────────┘           │
       │                      │                     ▼
       └──────────────────────┼──────────┌──────────────────┐
                              │          │ Extract Fields   │
                              │          │ (Name, Date, etc)│
                              │          └──────────────────┘
                              ▼
                    ┌──────────────────┐
                    │ Classify         │
                    │ Certificate Type │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Run Fraud        │
                    │ Detection Models │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌───────────────┐   ┌──────────────────┐
            │ Visual Forgery│   │ Signature        │
            │ Detection     │   │ Verification     │
            └───────────────┘   └──────────────────┘
                    │
                    ▼
            ┌───────────────────┐
            │ Generate Fraud    │
            │ Score & Report    │
            └───────────────────┘
                    │
                    ▼
            ┌───────────────────┐
            │ Extract Skills    │
            │ (NLP)             │
            └───────────────────┘
                    │
                    ▼
            ┌───────────────────┐
            │ Return Results    │
            │ to Backend        │
            └───────────────────┘
```

### AI System Use Cases (Detailed)

**UC-AI1: Process Certificate Upload**
- Trigger: New certificate uploaded
- Flow:
  1. Receive image from backend
  2. Convert PDF to images if needed
  3. Preprocess (deskew, enhance, denoise)
  4. Run OCR pipeline
  5. Extract structured fields
  6. Classify certificate type
  7. Run fraud detection
  8. Extract skills with NLP
  9. Return results to backend
- Output: JSON with all extracted data and scores

**UC-AI2: Fraud Detection**
- Trigger: Certificate processed
- Flow:
  1. Visual forensics CNN analysis
  2. Signature verification
  3. Template matching
  4. Anomaly detection
  5. Compute fraud score
- Output: Fraud confidence (0-1) and detected issues

**UC-AI3: Skill Extraction**
- Trigger: Certificate text extracted
- Flow:
  1. Run NER model on OCR text
  2. Extract skill entities
  3. Map to O*NET/ESCO taxonomy
  4. Assign proficiency level
- Output: List of normalized skills

---

## Cross-Cutting Use Cases

### UC-CC1: AI-Enhanced Certificate Issuance Flow
```
Student Uploads → AI Extracts → Institution Reviews → 
AI Validates → Blockchain Records → Student Receives Verified Certificate
```

### UC-CC2: Real-time Verification Flow
```
Employer Scans QR → Backend Queries Blockchain → 
Retrieves AI Scores → Displays Results
```

### UC-CC3: Fraud Alert Flow
```
AI Detects High Fraud Score → Flags Certificate → 
Notifies Institution → Human Review → Approve/Reject
```

---

## Use Case Summary Table

| Actor | Total Use Cases | AI-Enhanced | Blockchain-Integrated |
|-------|----------------|-------------|----------------------|
| Student | 5 | 3 | 2 |
| Institution | 5 | 4 | 3 |
| Employer | 5 | 3 | 5 |
| Admin | 6 | 2 | 2 |
| AI System | 3 | 3 | 0 |
| **TOTAL** | **24** | **15** | **12** |

## Next Steps
- Implement UC-S2 (Upload) and UC-AI1 (Process) first (core flow)
- Add UC-I4 (Fraud Alerts) for security
- Build UC-E2 (Verify) for employer value
