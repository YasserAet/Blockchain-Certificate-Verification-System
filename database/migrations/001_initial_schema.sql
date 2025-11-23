-- Credential Chain Database Schema
-- PostgreSQL migration script

-- ============================================
-- USER MANAGEMENT
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'institution', 'employer', 'admin')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- STUDENTS
-- ============================================

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  phone_number VARCHAR(20),
  profile_picture_url TEXT,
  bio TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_user_id ON students(user_id);

-- ============================================
-- INSTITUTIONS
-- ============================================

CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  institution_name VARCHAR(255) NOT NULL,
  verification_level VARCHAR(50) DEFAULT 'pending' CHECK (verification_level IN ('pending', 'verified', 'trusted')),
  blockchain_address VARCHAR(42),
  public_key TEXT,
  website_url TEXT,
  phone_number VARCHAR(20),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_institutions_user_id ON institutions(user_id);
CREATE INDEX idx_institutions_blockchain_address ON institutions(blockchain_address);

-- ============================================
-- EMPLOYERS
-- ============================================

CREATE TABLE employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  company_size VARCHAR(50),
  website_url TEXT,
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employers_user_id ON employers(user_id);

-- ============================================
-- CERTIFICATES
-- ============================================

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_hash VARCHAR(255) UNIQUE NOT NULL,
  blockchain_tx_id VARCHAR(255) UNIQUE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  issuer_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  certificate_type VARCHAR(50) NOT NULL CHECK (certificate_type IN ('academic', 'professional', 'training', 'skill_badge')),
  certificate_title VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  original_image_encrypted BYTEA,
  original_image_url TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'flagged', 'revoked')),
  qr_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_issuer_id ON certificates(issuer_id);
CREATE INDEX idx_certificates_hash ON certificates(certificate_hash);
CREATE INDEX idx_certificates_tx_id ON certificates(blockchain_tx_id);
CREATE INDEX idx_certificates_status ON certificates(status);

-- ============================================
-- EXTRACTED CERTIFICATE DATA
-- ============================================

CREATE TABLE extracted_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL UNIQUE REFERENCES certificates(id) ON DELETE CASCADE,
  recipient_name VARCHAR(255),
  institution_name VARCHAR(255),
  certificate_title VARCHAR(255),
  course_details JSONB,
  grades_scores JSONB,
  certificate_id_ref VARCHAR(255),
  signatures_detected BOOLEAN,
  qr_codes JSONB,
  ocr_confidence FLOAT,
  extraction_timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_extracted_data_certificate_id ON extracted_data(certificate_id);

-- ============================================
-- VALIDATION SCORES
-- ============================================

CREATE TABLE validation_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  confidence_score FLOAT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  validation_type VARCHAR(50) NOT NULL CHECK (validation_type IN ('authenticity', 'content', 'issuer')),
  model_version VARCHAR(50),
  model_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_validation_scores_certificate_id ON validation_scores(certificate_id);

-- ============================================
-- FRAUD DETECTION RESULTS
-- ============================================

CREATE TABLE fraud_detection_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  is_fraud_detected BOOLEAN NOT NULL DEFAULT false,
  fraud_confidence FLOAT NOT NULL CHECK (fraud_confidence >= 0 AND fraud_confidence <= 1),
  fraud_type VARCHAR(50),
  anomaly_details TEXT,
  requires_review BOOLEAN DEFAULT false,
  model_version VARCHAR(50),
  model_architecture JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fraud_detection_results_certificate_id ON fraud_detection_results(certificate_id);
CREATE INDEX idx_fraud_detection_results_fraud_confidence ON fraud_detection_results(fraud_confidence DESC);

-- ============================================
-- FRAUD ALERTS
-- ============================================

CREATE TABLE fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fraud_detection_result_id UUID NOT NULL REFERENCES fraud_detection_results(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'acknowledged', 'resolved')),
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fraud_alerts_institution_id ON fraud_alerts(institution_id);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);

-- ============================================
-- SKILLS
-- ============================================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name VARCHAR(255) UNIQUE NOT NULL,
  taxonomy VARCHAR(50) DEFAULT 'custom' CHECK (taxonomy IN ('onet', 'esco', 'custom')),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_taxonomy ON skills(taxonomy);

-- ============================================
-- STUDENT SKILLS
-- ============================================

CREATE TABLE student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level VARCHAR(50) CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  verified_by_certificate_id UUID REFERENCES certificates(id) ON DELETE SET NULL,
  endorsements INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, skill_id)
);

CREATE INDEX idx_student_skills_student_id ON student_skills(student_id);
CREATE INDEX idx_student_skills_skill_id ON student_skills(skill_id);

-- ============================================
-- VERIFICATIONS
-- ============================================

CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  verifier_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  verification_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  blockchain_confirmed BOOLEAN DEFAULT false,
  ai_fraud_score FLOAT,
  verification_status VARCHAR(50) NOT NULL CHECK (verification_status IN ('valid', 'invalid', 'inconclusive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verifications_certificate_id ON verifications(certificate_id);
CREATE INDEX idx_verifications_verifier_id ON verifications(verifier_id);

-- ============================================
-- BLOCKCHAIN TRANSACTIONS
-- ============================================

CREATE TABLE blockchain_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  certificate_id UUID REFERENCES certificates(id) ON DELETE CASCADE,
  contract_address VARCHAR(42),
  gas_used BIGINT,
  block_number BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blockchain_transactions_tx_hash ON blockchain_transactions(tx_hash);
CREATE INDEX idx_blockchain_transactions_certificate_id ON blockchain_transactions(certificate_id);

-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
