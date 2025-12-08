-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'institution', 'employer', 'admin')),
  institution VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'revoked')),
  blockchain_tx_hash VARCHAR(255),
  ipfs_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blockchain_transactions table
CREATE TABLE IF NOT EXISTS blockchain_transactions (
  id SERIAL PRIMARY KEY,
  certificate_id INTEGER NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  tx_hash VARCHAR(255) NOT NULL,
  operation VARCHAR(50) NOT NULL CHECK (operation IN ('issue', 'verify', 'revoke')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_number INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create verification_logs table
CREATE TABLE IF NOT EXISTS verification_logs (
  id SERIAL PRIMARY KEY,
  certificate_id INTEGER NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  verifier_ip VARCHAR(50),
  verification_result BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_certificates_institution ON certificates(institution_id);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_blockchain_tx_hash ON blockchain_transactions(tx_hash);

-- Insert admin user (password: Admin@123)
INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES 
('Admin User', 'admin@bcvs.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5gyV5TKn4kCnS', 'admin', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample institution
INSERT INTO users (name, email, password, role, institution, created_at, updated_at) VALUES 
('MIT University', 'mit@university.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5gyV5TKn4kCnS', 'institution', 'Massachusetts Institute of Technology', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample student
INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES 
('John Doe', 'john@student.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5gyV5TKn4kCnS', 'student', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
