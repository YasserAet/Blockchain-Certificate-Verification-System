#!/bin/bash

set -e

echo ""
echo "=============================================="
echo "Credential Chain - Complete Deployment Script"
echo "=============================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."
command -v node > /dev/null || { echo "Node.js required"; exit 1; }
command -v python > /dev/null || { echo "Python required"; exit 1; }
command -v docker > /dev/null && echo "✓ Docker found" || echo "⚠ Docker not found (optional)"

echo "✓ All prerequisites met"
echo ""

# Phase 1: Setup
echo "PHASE 1: Environment Setup"
echo "---"

# Blockchain setup
echo "1. Setting up blockchain..."
cd blockchain
npm install > /dev/null 2>&1
cp .env.example .env
echo "   ✓ Blockchain environment ready"
cd ..

# Backend setup
echo "2. Setting up backend..."
cd backend
npm install > /dev/null 2>&1
cp .env.example .env
echo "   ✓ Backend environment ready"
cd ..

# Frontend setup
echo "3. Setting up frontend..."
cd frontend
npm install > /dev/null 2>&1
cp .env.example .env.local
echo "   ✓ Frontend environment ready"
cd ..

# ML service setup
echo "4. Setting up ML service..."
cd ml-service
python -m venv venv > /dev/null 2>&1
source venv/bin/activate > /dev/null 2>&1
pip install -q -r requirements.txt
echo "   ✓ ML service environment ready"
cd ..

echo ""
echo "PHASE 1 COMPLETE"
echo ""
echo "Next steps:"
echo "1. Configure blockchain/.env with Infura API key and private key"
echo "2. Deploy contracts: cd blockchain && npm run deploy:sepolia"
echo "3. Train ML models: cd ml-service && python scripts/generate_synthetic_certificates.py && python scripts/train_fraud_detection.py"
echo "4. Update .env files with deployed contract addresses"
echo "5. Start services: bash start_services.sh"
