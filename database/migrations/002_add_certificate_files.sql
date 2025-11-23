-- Add certificate file storage table for encrypted uploads

CREATE TABLE IF NOT EXISTS certificate_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  file_size BIGINT,
  encrypted_path TEXT NOT NULL,
  encryption_iv VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificate_files_certificate_id ON certificate_files(certificate_id);
