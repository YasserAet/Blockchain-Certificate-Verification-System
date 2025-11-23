#!/bin/bash
# Complete ML training pipeline

set -e

echo "Starting ML Training Pipeline..."
echo "========================================"

# Step 1: Generate synthetic certificates
echo ""
echo "Step 1: Generating synthetic certificate dataset..."
python ml-service/scripts/generate_synthetic_certificates.py

# Step 2: Train fraud detection model
echo ""
echo "Step 2: Training fraud detection model..."
python ml-service/scripts/train_fraud_detection.py

echo ""
echo "========================================"
echo "Training pipeline complete!"
echo ""
echo "Models saved to: ml-service/models/"
echo "Training data saved to: ml-service/training_data/"
echo ""
echo "Next steps:"
echo "1. Start ML service: python ml-service/app.py"
echo "2. Backend will automatically use trained models"
