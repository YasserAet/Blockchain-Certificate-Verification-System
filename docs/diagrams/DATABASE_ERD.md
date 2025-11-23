# Database Entity Relationship Diagram (ERD)

## Entity Relationship Overview

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│    users     │1       1│   institutions   │1       ∞│ certificates │
│              │─────────│                  │─────────│              │
│ id (PK)      │         │ id (PK)          │  issues │ id (PK)      │
│ email        │         │ user_id (FK)     │         │ student_id   │
│ password_hash│         │ institution_name │         │ issuer_id    │
│ role         │         │ blockchain_addr  │         │ cert_hash    │
└──────┬───────┘         └──────────────────┘         └──────┬───────┘
       │1                                                     │1
       │                                                      │
       │∞                                                     │∞
┌──────┴───────┐         ┌──────────────────┐         ┌──────┴───────┐
│   students   │         │    employers     │         │extracted_data│
│              │         │                  │         │              │
│ id (PK)      │         │ id (PK)          │         │ id (PK)      │
│ user_id (FK) │         │ user_id (FK)     │         │ cert_id (FK) │
│ dob          │         │ company_name     │         │ ocr_text     │
│ phone        │         │ industry         │         │ confidence   │
└──────┬───────┘         └──────┬───────────┘         └──────────────┘
       │∞                       │∞
       │                        │
       │                        │
       │1                       │1                     ┌──────────────┐
┌──────┴───────────┐     ┌──────┴───────────┐    ┌───│validation_   │
│ student_skills   │     │  verifications   │    │∞  │   scores     │
│                  │     │                  │    │   │              │
│ id (PK)          │     │ id (PK)          │────┘   │ id (PK)      │
│ student_id (FK)  │     │ certificate_id   │        │ cert_id (FK) │
│ skill_id (FK)    │     │ verifier_id (FK) │        │ confidence   │
│ proficiency      │     │ status           │        │ model_version│
└──────────────────┘     └──────────────────┘        └──────────────┘
       │∞
       │
       │1                                             ┌──────────────┐
┌──────┴───────┐                                 ┌───│  fraud_      │
│    skills    │                                 │∞  │ detection_   │
│              │                                 │   │  results     │
│ id (PK)      │                                 │   │              │
│ skill_name   │                                 │   │ id (PK)      │
│ taxonomy     │          ┌──────────────┐       │   │ cert_id (FK) │
│ (onet/esco)  │     ┌────│ fraud_alerts │───────┘   │ is_fraud     │
└──────────────┘     │∞   │              │           │ fraud_score  │
                     │    │ id (PK)      │           │ fraud_type   │
                     │    │ fraud_det_id │           └──────────────┘
                     │    │ institution  │
                     │    │ status       │
                     │    └──────────────┘
                     │
                     │1
              ┌──────┴──────────┐
              │ blockchain_     │
              │ transactions    │
              │                 │
              │ id (PK)         │
              │ tx_hash         │
              │ cert_id (FK)    │
              │ block_number    │
              └─────────────────┘
```

## Detailed Table Schemas

### Core Tables

#### 1. users
Primary authentication and user management table.

```sql
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255) UNIQUE NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  full_name         VARCHAR(255) NOT NULL,
  role              VARCHAR(50) NOT NULL 
                    CHECK (role IN ('student', 'institution', 'employer', 'admin')),
  is_active         BOOLEAN DEFAULT true,
  email_verified    BOOLEAN DEFAULT false,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at        TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Relationships:**
- 1:1 with students, institutions, employers

---

#### 2. students
Student-specific profile data.

```sql
CREATE TABLE students (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth      DATE,
  phone_number       VARCHAR(20),
  profile_picture_url TEXT,
  bio                TEXT,
  portfolio_url      TEXT,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_user_id ON students(user_id);
```

**Relationships:**
- 1:1 with users
- 1:∞ with certificates (as recipient)
- 1:∞ with student_skills

---

#### 3. institutions
Educational institutions and training providers.

```sql
CREATE TABLE institutions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  institution_name   VARCHAR(255) NOT NULL,
  verification_level VARCHAR(50) DEFAULT 'pending' 
                     CHECK (verification_level IN ('pending', 'verified', 'trusted')),
  blockchain_address VARCHAR(42),
  public_key         TEXT,
  website_url        TEXT,
  phone_number       VARCHAR(20),
  verified_at        TIMESTAMP,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_institutions_user_id ON institutions(user_id);
CREATE INDEX idx_institutions_blockchain_address ON institutions(blockchain_address);
```

**Relationships:**
- 1:1 with users
- 1:∞ with certificates (as issuer)
- 1:∞ with fraud_alerts

---

#### 4. employers
Employers and recruiters who verify certificates.

```sql
CREATE TABLE employers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name      VARCHAR(255) NOT NULL,
  industry          VARCHAR(100),
  company_size      VARCHAR(50),
  website_url       TEXT,
  phone_number      VARCHAR(20),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employers_user_id ON employers(user_id);
```

**Relationships:**
- 1:1 with users
- 1:∞ with verifications

---

### Certificate Tables

#### 5. certificates
Core certificate records (off-chain metadata).

```sql
CREATE TABLE certificates (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_hash        VARCHAR(255) UNIQUE NOT NULL,
  blockchain_tx_id        VARCHAR(255) UNIQUE,
  student_id              UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  issuer_id               UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  certificate_type        VARCHAR(50) NOT NULL 
                          CHECK (certificate_type IN 
                            ('academic', 'professional', 'training', 'skill_badge')),
  certificate_title       VARCHAR(255) NOT NULL,
  issue_date              DATE NOT NULL,
  expiry_date             DATE,
  original_image_encrypted BYTEA,
  original_image_url      TEXT,
  status                  VARCHAR(50) DEFAULT 'pending' 
                          CHECK (status IN ('pending', 'verified', 'flagged', 'revoked')),
  qr_code                 TEXT,
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_issuer_id ON certificates(issuer_id);
CREATE INDEX idx_certificates_hash ON certificates(certificate_hash);
CREATE INDEX idx_certificates_tx_id ON certificates(blockchain_tx_id);
CREATE INDEX idx_certificates_status ON certificates(status);
```

**Relationships:**
- ∞:1 with students
- ∞:1 with institutions
- 1:1 with extracted_data
- 1:∞ with validation_scores
- 1:∞ with fraud_detection_results
- 1:∞ with blockchain_transactions

---

#### 6. extracted_data
AI-extracted fields from certificate documents.

```sql
CREATE TABLE extracted_data (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id      UUID NOT NULL UNIQUE REFERENCES certificates(id) ON DELETE CASCADE,
  recipient_name      VARCHAR(255),
  institution_name    VARCHAR(255),
  certificate_title   VARCHAR(255),
  course_details      JSONB,
  grades_scores       JSONB,
  certificate_id_ref  VARCHAR(255),
  signatures_detected BOOLEAN,
  qr_codes            JSONB,
  ocr_confidence      FLOAT,
  extraction_timestamp TIMESTAMP,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_extracted_data_certificate_id ON extracted_data(certificate_id);
```

**JSONB Fields:**
- `course_details`: `{"course_name": "AI Fundamentals", "duration": "12 weeks", "credits": 4}`
- `grades_scores`: `{"final_grade": "A", "gpa": 3.8, "percentile": 95}`
- `qr_codes`: `[{"type": "verification", "data": "https://verify.example.com/cert/123"}]`

---

### AI/ML Tables

#### 7. validation_scores
AI model validation scores for authenticity/quality.

```sql
CREATE TABLE validation_scores (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id    UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  confidence_score  FLOAT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  validation_type   VARCHAR(50) NOT NULL 
                    CHECK (validation_type IN ('authenticity', 'content', 'issuer')),
  model_version     VARCHAR(50),
  model_details     JSONB,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_validation_scores_certificate_id ON validation_scores(certificate_id);
```

**JSONB `model_details` example:**
```json
{
  "model": "layoutlmv3-base",
  "precision": 0.94,
  "recall": 0.92,
  "f1_score": 0.93
}
```

---

#### 8. fraud_detection_results
ML fraud detection outputs.

```sql
CREATE TABLE fraud_detection_results (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id      UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  is_fraud_detected   BOOLEAN NOT NULL DEFAULT false,
  fraud_confidence    FLOAT NOT NULL CHECK (fraud_confidence >= 0 AND fraud_confidence <= 1),
  fraud_type          VARCHAR(50),
  anomaly_details     TEXT,
  requires_review     BOOLEAN DEFAULT false,
  model_version       VARCHAR(50),
  model_architecture  JSONB,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fraud_detection_results_certificate_id ON fraud_detection_results(certificate_id);
CREATE INDEX idx_fraud_detection_results_fraud_confidence ON fraud_detection_results(fraud_confidence DESC);
```

**`fraud_type` values:** `'visual_tampering'`, `'signature_mismatch'`, `'template_anomaly'`, `'copy_paste'`

**JSONB `model_architecture` example:**
```json
{
  "visual_cnn": {"score": 0.12, "model": "efficientnet-b0"},
  "signature": {"score": 0.05, "model": "siamese-resnet"},
  "template": {"score": 0.18, "model": "embedding-cosine"},
  "anomaly": {"score": 0.09, "model": "autoencoder"}
}
```

---

#### 9. fraud_alerts
Alerts generated for high-risk fraud detection.

```sql
CREATE TABLE fraud_alerts (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fraud_detection_result_id UUID NOT NULL REFERENCES fraud_detection_results(id) ON DELETE CASCADE,
  institution_id           UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  status                   VARCHAR(50) DEFAULT 'pending_review' 
                           CHECK (status IN ('pending_review', 'acknowledged', 'resolved')),
  review_notes             TEXT,
  created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at              TIMESTAMP,
  updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fraud_alerts_institution_id ON fraud_alerts(institution_id);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);
```

---

### Skills & Taxonomy Tables

#### 10. skills
Standardized skill definitions (O*NET/ESCO taxonomy).

```sql
CREATE TABLE skills (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name   VARCHAR(255) UNIQUE NOT NULL,
  taxonomy     VARCHAR(50) DEFAULT 'custom' 
               CHECK (taxonomy IN ('onet', 'esco', 'custom')),
  description  TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_taxonomy ON skills(taxonomy);
```

---

#### 11. student_skills
Student-skill mappings extracted from certificates.

```sql
CREATE TABLE student_skills (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id                UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_id                  UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level         VARCHAR(50) 
                            CHECK (proficiency_level IN 
                              ('beginner', 'intermediate', 'advanced', 'expert')),
  verified_by_certificate_id UUID REFERENCES certificates(id) ON DELETE SET NULL,
  endorsements              INT DEFAULT 0,
  created_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, skill_id)
);

CREATE INDEX idx_student_skills_student_id ON student_skills(student_id);
CREATE INDEX idx_student_skills_skill_id ON student_skills(skill_id);
```

---

### Verification & Blockchain Tables

#### 12. verifications
Employer verification requests and results.

```sql
CREATE TABLE verifications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id        UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  verifier_id           UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  verification_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  blockchain_confirmed  BOOLEAN DEFAULT false,
  ai_fraud_score        FLOAT,
  verification_status   VARCHAR(50) NOT NULL 
                        CHECK (verification_status IN ('valid', 'invalid', 'inconclusive')),
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verifications_certificate_id ON verifications(certificate_id);
CREATE INDEX idx_verifications_verifier_id ON verifications(verifier_id);
```

---

#### 13. blockchain_transactions
Blockchain transaction logs.

```sql
CREATE TABLE blockchain_transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash           VARCHAR(255) UNIQUE NOT NULL,
  certificate_id    UUID REFERENCES certificates(id) ON DELETE CASCADE,
  contract_address  VARCHAR(42),
  gas_used          BIGINT,
  block_number      BIGINT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blockchain_transactions_tx_hash ON blockchain_transactions(tx_hash);
CREATE INDEX idx_blockchain_transactions_certificate_id ON blockchain_transactions(certificate_id);
```

---

#### 14. audit_logs
System-wide audit trail for compliance.

```sql
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id   UUID NOT NULL,
  action      VARCHAR(100) NOT NULL,
  actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  changes     JSONB,
  ip_address  VARCHAR(45),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

**JSONB `changes` example:**
```json
{
  "before": {"status": "pending"},
  "after": {"status": "verified"},
  "reason": "Institution approved certificate"
}
```

---

## Cardinality Summary

| Relationship | Cardinality | Description |
|--------------|-------------|-------------|
| users → students | 1:1 | One user can be one student |
| users → institutions | 1:1 | One user can be one institution |
| users → employers | 1:1 | One user can be one employer |
| students → certificates | 1:∞ | Student can have many certificates |
| institutions → certificates | 1:∞ | Institution can issue many certificates |
| certificates → extracted_data | 1:1 | Each certificate has one extraction result |
| certificates → validation_scores | 1:∞ | Multiple validation scores per certificate |
| certificates → fraud_detection_results | 1:∞ | Multiple fraud checks possible |
| fraud_detection_results → fraud_alerts | 1:∞ | One result can trigger multiple alerts |
| students → student_skills | 1:∞ | Student has many skills |
| skills → student_skills | 1:∞ | Skill can belong to many students |
| employers → verifications | 1:∞ | Employer can verify many certificates |
| certificates → blockchain_transactions | 1:∞ | Multiple TX per certificate (revoke, update) |

---

## Database Constraints & Rules

### Primary Keys
- All tables use `UUID` primary keys for security and scalability

### Foreign Keys
- `ON DELETE CASCADE`: Child records deleted when parent deleted (students, institutions, employers)
- `ON DELETE SET NULL`: Reference nullified but record preserved (verified_by_certificate_id)

### Check Constraints
- `role`: Limited to predefined values
- `certificate_type`: Academic, professional, training, skill_badge
- `status`: Pending, verified, flagged, revoked
- `confidence_score`: 0.0 to 1.0 range

### Unique Constraints
- `users.email`: No duplicate emails
- `certificates.certificate_hash`: Unique blockchain hash
- `student_skills (student_id, skill_id)`: No duplicate skill assignments

---

## Indexing Strategy

**High-Performance Queries:**
- Certificate lookup by hash: `idx_certificates_hash`
- Student certificates: `idx_certificates_student_id`
- Fraud detection filtering: `idx_fraud_detection_results_fraud_confidence DESC`
- Audit logs chronological: `idx_audit_logs_created_at DESC`

**JSONB Indexing (Optional):**
```sql
CREATE INDEX idx_extracted_data_course_details ON extracted_data USING GIN (course_details);
CREATE INDEX idx_validation_scores_model_details ON validation_scores USING GIN (model_details);
```

---

## Sample Queries

### Get all certificates for a student with AI scores
```sql
SELECT 
  c.*,
  ed.recipient_name,
  ed.ocr_confidence,
  AVG(vs.confidence_score) as avg_validation_score,
  MAX(fdr.fraud_confidence) as max_fraud_score
FROM certificates c
LEFT JOIN extracted_data ed ON c.id = ed.certificate_id
LEFT JOIN validation_scores vs ON c.id = vs.certificate_id
LEFT JOIN fraud_detection_results fdr ON c.id = fdr.certificate_id
WHERE c.student_id = 'student-uuid-here'
GROUP BY c.id, ed.recipient_name, ed.ocr_confidence;
```

### Find high-risk fraud alerts needing review
```sql
SELECT 
  fa.*,
  fdr.fraud_confidence,
  fdr.fraud_type,
  c.certificate_title,
  i.institution_name
FROM fraud_alerts fa
JOIN fraud_detection_results fdr ON fa.fraud_detection_result_id = fdr.id
JOIN certificates c ON fdr.certificate_id = c.id
JOIN institutions i ON fa.institution_id = i.id
WHERE fa.status = 'pending_review'
  AND fdr.fraud_confidence > 0.7
ORDER BY fdr.fraud_confidence DESC;
```

### Get student skills with proficiency levels
```sql
SELECT 
  s.skill_name,
  s.taxonomy,
  ss.proficiency_level,
  c.certificate_title
FROM student_skills ss
JOIN skills s ON ss.skill_id = s.id
LEFT JOIN certificates c ON ss.verified_by_certificate_id = c.id
WHERE ss.student_id = 'student-uuid-here'
ORDER BY ss.proficiency_level DESC;
```

---

## Migration Files Location

```
database/
├── migrations/
│   ├── 001_initial_schema.sql ← Core tables
│   ├── 002_add_certificate_files.sql ← File storage
│   └── 003_add_ml_tables.sql (future)
```

---

## Total Tables: 14

✅ All tables support AI/ML integration
✅ All tables include audit timestamps
✅ All tables use UUID primary keys
✅ Comprehensive indexing for performance
