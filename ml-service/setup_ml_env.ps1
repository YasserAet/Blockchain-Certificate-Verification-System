# ML Service Environment Setup Script (Windows)
# This script sets up the Python virtual environment for the ML service

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ML Service Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python version
Write-Host "Checking Python version..." -ForegroundColor Yellow
try {
    $pythonVersion = & python --version 2>&1 | Select-String -Pattern "Python (\d+\.\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
    
    if (-not $pythonVersion) {
        Write-Host "❌ Error: Python is not installed" -ForegroundColor Red
        Write-Host "Please install Python 3.11 or higher from https://www.python.org/" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ Found Python $pythonVersion" -ForegroundColor Green
    
    # Check if version is at least 3.11
    $version = [version]$pythonVersion
    $requiredVersion = [version]"3.11.0"
    
    if ($version -lt $requiredVersion) {
        Write-Host "❌ Error: Python 3.11 or higher is required" -ForegroundColor Red
        Write-Host "Current version: $pythonVersion" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ Python version is compatible" -ForegroundColor Green
} catch {
    Write-Host "❌ Error checking Python version: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "⚠️  Virtual environment already exists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to recreate it? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Remove-Item -Recurse -Force venv
        python -m venv venv
        Write-Host "✓ Virtual environment recreated" -ForegroundColor Green
    } else {
        Write-Host "Using existing virtual environment" -ForegroundColor Cyan
    }
} else {
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
}
Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
Write-Host "✓ Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip setuptools wheel
Write-Host "✓ pip upgraded" -ForegroundColor Green
Write-Host ""

# Install PyTorch (CPU version for compatibility)
Write-Host "Installing PyTorch..." -ForegroundColor Yellow
Write-Host "Note: Installing CPU version. For GPU support, see instructions at the end." -ForegroundColor Cyan
pip install torch torchvision torchaudio
Write-Host "✓ PyTorch installed" -ForegroundColor Green
Write-Host ""

# Install requirements
Write-Host "Installing Python packages from requirements.txt..." -ForegroundColor Yellow
if (Test-Path "requirements.txt") {
    pip install -r requirements.txt
    Write-Host "✓ Requirements installed" -ForegroundColor Green
} else {
    Write-Host "❌ Error: requirements.txt not found" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check GPU availability
Write-Host "Checking GPU availability..." -ForegroundColor Yellow
$gpuAvailable = python -c "import torch; print('Yes' if torch.cuda.is_available() else 'No')" 2>$null
if ($gpuAvailable -eq "Yes") {
    Write-Host "✓ GPU is available (CUDA)" -ForegroundColor Green
    python -c "import torch; print(f'  CUDA Version: {torch.version.cuda}'); print(f'  GPU: {torch.cuda.get_device_name(0)}')"
    Write-Host ""
    Write-Host "To use GPU, update your .env file:" -ForegroundColor Cyan
    Write-Host "  DEVICE=cuda" -ForegroundColor White
} else {
    Write-Host "ℹ️  No GPU detected (using CPU)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Make sure your .env file has:" -ForegroundColor Cyan
    Write-Host "  DEVICE=cpu" -ForegroundColor White
}
Write-Host ""

# Download required models
Write-Host "Downloading pre-trained models..." -ForegroundColor Yellow
python -c @"
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
"@
Write-Host ""

# Create necessary directories
Write-Host "Creating necessary directories..." -ForegroundColor Yellow
$dirs = @("models", "datasets", "temp", "logs", "model_cache", "huggingface_cache")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
}
Write-Host "✓ Directories created" -ForegroundColor Green
Write-Host ""

# Verify installation
Write-Host "Verifying installation..." -ForegroundColor Yellow
$verifyScript = @'
import sys
import importlib

required_packages = ['fastapi', 'uvicorn', 'torch', 'transformers', 'PIL', 'cv2', 'numpy', 'pytesseract']

all_ok = True
for package in required_packages:
    module_name = package
    if package == 'PIL':
        module_name = 'PIL'
    elif package == 'cv2':
        module_name = 'cv2'
    
    try:
        importlib.import_module(module_name)
        print(f'OK: {package}')
    except ImportError:
        print(f'MISSING: {package}')
        all_ok = False

if all_ok:
    print('All required packages are installed')
else:
    print('Some packages are missing')
    sys.exit(1)
'@

python -c $verifyScript
Write-Host ""

# Print final instructions
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ ML Environment Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy .env.example to .env and configure your settings" -ForegroundColor White
Write-Host "2. Activate the virtual environment:" -ForegroundColor White
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor Yellow
Write-Host "3. Start the ML service:" -ForegroundColor White
Write-Host "   uvicorn app.main:app --reload" -ForegroundColor Yellow
Write-Host ""
Write-Host "For GPU support (if you have NVIDIA GPU):" -ForegroundColor Cyan
Write-Host "1. Install CUDA toolkit: https://developer.nvidia.com/cuda-downloads" -ForegroundColor White
Write-Host "2. Reinstall PyTorch with CUDA:" -ForegroundColor White
Write-Host "   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118" -ForegroundColor Yellow
Write-Host "3. Update .env: DEVICE=cuda" -ForegroundColor White
Write-Host ""
Write-Host "Note: You may need to install Tesseract OCR separately:" -ForegroundColor Cyan
Write-Host "  Download from: https://github.com/UB-Mannheim/tesseract/wiki" -ForegroundColor White
Write-Host "  Then update .env with the path: TESSERACT_CMD=C:\\Program Files\\Tesseract-OCR\\tesseract.exe" -ForegroundColor Yellow
Write-Host ""
