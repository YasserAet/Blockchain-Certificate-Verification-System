#!/bin/bash

# ML Service Environment Setup Script
# This script sets up the Python virtual environment for the ML service

set -e  # Exit on error

echo "========================================"
echo "ML Service Environment Setup"
echo "========================================"
echo ""

# Check Python version
echo "Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
REQUIRED_VERSION="3.11"

if [ -z "$PYTHON_VERSION" ]; then
    echo "❌ Error: Python 3 is not installed"
    echo "Please install Python 3.11 or higher"
    exit 1
fi

echo "✓ Found Python $PYTHON_VERSION"

# Check if version is at least 3.11
if ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 11) else 1)"; then
    echo "❌ Error: Python 3.11 or higher is required"
    echo "Current version: $PYTHON_VERSION"
    exit 1
fi

echo "✓ Python version is compatible"
echo ""

# Create virtual environment
echo "Creating virtual environment..."
if [ -d "venv" ]; then
    echo "⚠️  Virtual environment already exists"
    read -p "Do you want to recreate it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf venv
        python3 -m venv venv
        echo "✓ Virtual environment recreated"
    else
        echo "Using existing virtual environment"
    fi
else
    python3 -m venv venv
    echo "✓ Virtual environment created"
fi
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip setuptools wheel
echo "✓ pip upgraded"
echo ""

# Install PyTorch (CPU version for compatibility)
echo "Installing PyTorch..."
echo "Note: Installing CPU version. For GPU support, run the appropriate command for your system."
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
echo "✓ PyTorch installed"
echo ""

# Install requirements
echo "Installing Python packages from requirements.txt..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    echo "✓ Requirements installed"
else
    echo "❌ Error: requirements.txt not found"
    exit 1
fi
echo ""

# Check GPU availability
echo "Checking GPU availability..."
GPU_AVAILABLE=$(python3 -c "import torch; print('Yes' if torch.cuda.is_available() else 'No')" 2>/dev/null || echo "No")
if [ "$GPU_AVAILABLE" = "Yes" ]; then
    echo "✓ GPU is available (CUDA)"
    python3 -c "import torch; print(f'  CUDA Version: {torch.version.cuda}'); print(f'  GPU: {torch.cuda.get_device_name(0)}')"
    echo ""
    echo "To use GPU, update your .env file:"
    echo "  DEVICE=cuda"
else
    echo "ℹ️  No GPU detected (using CPU)"
    echo ""
    echo "Make sure your .env file has:"
    echo "  DEVICE=cpu"
fi
echo ""

# Download required models
echo "Downloading pre-trained models..."
python3 -c "
from transformers import AutoTokenizer, AutoModel
import os

models = [
    'xlm-roberta-base',
    'microsoft/layoutlmv3-base',
]

os.makedirs('model_cache', exist_ok=True)
os.environ['TRANSFORMERS_CACHE'] = './model_cache'

for model_name in models:
    print(f'Downloading {model_name}...')
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModel.from_pretrained(model_name)
        print(f'✓ {model_name} downloaded')
    except Exception as e:
        print(f'⚠️  Failed to download {model_name}: {e}')
"
echo ""

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p models datasets temp logs model_cache huggingface_cache
echo "✓ Directories created"
echo ""

# Verify installation
echo "Verifying installation..."
python3 -c "
import sys
import importlib

required_packages = [
    'fastapi',
    'uvicorn',
    'torch',
    'transformers',
    'PIL',
    'cv2',
    'numpy',
    'pytesseract',
]

all_ok = True
for package in required_packages:
    module_name = package
    if package == 'PIL':
        module_name = 'PIL'
    elif package == 'cv2':
        module_name = 'cv2'
    
    try:
        importlib.import_module(module_name)
        print(f'✓ {package}')
    except ImportError:
        print(f'❌ {package} not installed')
        all_ok = False

if all_ok:
    print('\n✓ All required packages are installed')
else:
    print('\n❌ Some packages are missing')
    sys.exit(1)
"
echo ""

# Print final instructions
echo "========================================"
echo "✓ ML Environment Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and configure your settings"
echo "2. Activate the virtual environment:"
echo "   source venv/bin/activate"
echo "3. Start the ML service:"
echo "   uvicorn app.main:app --reload"
echo ""
echo "For GPU support (if you have NVIDIA GPU):"
echo "1. Install CUDA toolkit: https://developer.nvidia.com/cuda-downloads"
echo "2. Reinstall PyTorch with CUDA:"
echo "   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118"
echo "3. Update .env: DEVICE=cuda"
echo ""
