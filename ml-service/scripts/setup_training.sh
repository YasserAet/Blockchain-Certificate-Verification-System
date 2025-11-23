#!/bin/bash
# Setup script for ML model training

echo "Setting up ML training environment..."

# Create required directories
mkdir -p training_data/certificates
mkdir -p models
mkdir -p logs

echo "✓ Directories created"

# Install/upgrade Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✓ Dependencies installed"

# Download pre-trained models (optional, will be downloaded on first use)
echo "Models will be downloaded on first use from Hugging Face"

echo ""
echo "Setup complete! Run training with:"
echo "  python scripts/generate_synthetic_certificates.py"
echo "  python scripts/train_fraud_detection.py"
