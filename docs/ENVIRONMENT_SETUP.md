# Phase 2: Environment Setup - Quick Start Guide

This guide will help you set up the complete development environment for the Blockchain Certificate Verification System.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 20 LTS** - [Download](https://nodejs.org/)
- **Python 3.11+** - [Download](https://www.python.org/)
- **Docker Desktop** - [Download](https://www.docker.com/)
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL 15+** (or use Docker)
- **Tesseract OCR** - [Download](https://github.com/UB-Mannheim/tesseract/wiki)

---

## 🚀 Quick Start (Docker - Recommended)

### 1. Clone and Configure

```bash
# Clone the repository (if not already)
git clone <your-repo-url>
cd Blockchain-Certificate-Verification-System

# Copy environment files
cp .env.example .env.local
cp backend/.env.example backend/.env
cp ml-service/.env.example ml-service/.env
cp blockchain/.env.example blockchain/.env
```

### 2. Configure Environment Variables

Edit each `.env` file with your actual values:

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

#### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://credential_user:credential_password@localhost:5432/credential_chain
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
BLOCKCHAIN_PRIVATE_KEY=your_private_key_without_0x
```

#### ML Service (`ml-service/.env`)
```env
DEVICE=cpu
TESSERACT_CMD=/usr/bin/tesseract
# Windows: C:\\Program Files\\Tesseract-OCR\\tesseract.exe
```

#### Blockchain (`blockchain/.env`)
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. Start All Services with Docker

```bash
# Start all services
docker-compose up -d

# Or start with development tools (Adminer for database)
docker-compose --profile dev-tools up -d

# Or start with IPFS support
docker-compose --profile with-ipfs up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **ML Service**: http://localhost:8000
- **Hardhat Network**: http://localhost:8545
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Adminer** (if dev-tools profile): http://localhost:8081
- **IPFS** (if with-ipfs profile): http://localhost:5001

---

## 🛠️ Manual Setup (Without Docker)

### Step 1: Database Setup

```bash
# Install PostgreSQL 15+
# Create database
psql -U postgres
CREATE DATABASE credential_chain;
CREATE USER credential_user WITH PASSWORD 'credential_password';
GRANT ALL PRIVILEGES ON DATABASE credential_chain TO credential_user;
\q

# Run migrations
psql -U credential_user -d credential_chain -f database/migrations/001_initial_schema.sql
```

### Step 2: ML Service Setup

```bash
cd ml-service

# Windows
.\setup_ml_env.ps1

# Linux/Mac
chmod +x setup_ml_env.sh
./setup_ml_env.sh

# Or manually
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start ML service
uvicorn app.main:app --reload
```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Build TypeScript
npm run build

# Run migrations (if needed)
npm run migrate

# Start backend
npm run dev
```

### Step 4: Blockchain Setup

```bash
cd blockchain

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start local Hardhat network
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Copy contract addresses to backend/.env
```

### Step 5: Frontend Setup

```bash
# From project root
npm install

# Copy environment file
cp .env.example .env.local

# Start frontend
npm run dev
```

---

## 📝 Configuration Files Created

### ✅ Environment Files
- [x] `.env.example` - Frontend environment template
- [x] `backend/.env.example` - Backend environment template
- [x] `ml-service/.env.example` - ML service environment template
- [x] `blockchain/.env.example` - Blockchain environment template

### ✅ Docker Configuration
- [x] `docker-compose.yml` - Main Docker Compose file
- [x] `docker-compose.dev.yml` - Development Docker Compose
- [x] `Dockerfile` - Frontend Docker image
- [x] `backend/Dockerfile` - Backend Docker image
- [x] `ml-service/Dockerfile` - ML service Docker image
- [x] `blockchain/Dockerfile.hardhat` - Hardhat network Docker image

### ✅ Blockchain Configuration
- [x] `blockchain/hardhat.config.js` - Updated with all networks

### ✅ ML Environment Scripts
- [x] `ml-service/setup_ml_env.sh` - Linux/Mac setup script
- [x] `ml-service/setup_ml_env.ps1` - Windows setup script

### ✅ Documentation
- [x] `docs/FRONTEND_TEMPLATES.md` - Frontend template research
- [x] `docs/ENVIRONMENT_SETUP.md` - This file

---

## 🔑 Getting API Keys

### Infura (Blockchain RPC)
1. Go to https://infura.io/
2. Create free account
3. Create new project
4. Copy Project ID
5. Use: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

### Etherscan (Contract Verification)
1. Go to https://etherscan.io/
2. Create account
3. Go to API Keys section
4. Create new API key
5. Copy to `blockchain/.env`

### MetaMask (Private Key)
1. Install MetaMask browser extension
2. Create/import wallet
3. Go to Account Details → Export Private Key
4. **⚠️ NEVER commit this to Git!**
5. Remove `0x` prefix before using

---

## 🧪 Testing the Setup

### Test Database Connection
```bash
docker-compose exec postgres psql -U credential_user -d credential_chain -c "SELECT version();"
```

### Test Backend API
```bash
curl http://localhost:3001/health
```

### Test ML Service
```bash
curl http://localhost:8000/health
```

### Test Hardhat Network
```bash
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Test Frontend
Open http://localhost:3000 in browser

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port (Windows)
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <process_id> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### ML Service Model Download Failed
```bash
# Set HuggingFace cache
export HF_HOME=./ml-service/huggingface_cache

# Download manually
python -c "from transformers import AutoModel; AutoModel.from_pretrained('xlm-roberta-base')"
```

### Blockchain Deployment Failed
```bash
# Check Hardhat network is running
curl http://localhost:8545

# Check private key in blockchain/.env
# Check RPC URL is correct
```

---

## 📦 Docker Commands Cheat Sheet

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend npm run migrate

# Rebuild a service
docker-compose up -d --build backend

# Remove all volumes (⚠️ deletes data)
docker-compose down -v
```

---

## 🎯 Next Steps

After environment setup is complete:

1. ✅ **Verify all services are running**
2. ⏭️ **Phase 3**: Download and prepare ML datasets
3. ⏭️ **Phase 4**: Train ML models (fraud detection, classification, NER)
4. ⏭️ **Phase 5**: Implement full UI for all dashboards
5. ⏭️ **Phase 6**: Integration testing and deployment

---

## 📞 Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Ensure all ports are available
4. Check Docker has enough resources (4GB+ RAM recommended)

---

**Status**: ✅ Phase 2 Environment Setup Complete
**Last Updated**: 2025
