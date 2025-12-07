<#
Run the full ML training pipeline on Windows (PowerShell).
Usage examples:
  # From repository root:
  .\ml-service\run_training_pipeline.ps1

  # With custom models output directory:
  .\ml-service\run_training_pipeline.ps1 -ModelsOutDir "C:\temp\ml_models"

Params:
  -ModelsOutDir: directory where trained models/artifacts will be copied (defaults to ml-service\models)
  -SkipInstall: skip pip install step (useful if env already set up)
  -SkipPrep: skip data preparation steps (OCR prepare / feature extraction)
#>

[CmdletBinding()]
param(
    [string]$ModelsOutDir = "$PSScriptRoot\models",
    [switch]$SkipInstall,
    [switch]$SkipPrep
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Create logs dir
$logsDir = Join-Path $PSScriptRoot 'logs'
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }
$timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
$logFile = Join-Path $logsDir "run_training_pipeline_$timestamp.log"
Start-Transcript -Path $logFile -Force

try {
    Write-Host "Starting ML training pipeline..." -ForegroundColor Cyan

    # Move to script dir (ml-service)
    Push-Location $PSScriptRoot

    # Virtual environment setup
    if (-not (Test-Path '.venv') -and -not (Test-Path 'venv')) {
        Write-Host "Creating virtual environment (.venv)..." -ForegroundColor Yellow
        python -m venv .venv
    }

    # Activate venv if present
    $activatePath = Join-Path $PSScriptRoot '.venv\Scripts\Activate.ps1'
    if (Test-Path $activatePath) {
        Write-Host "Activating virtual environment..." -ForegroundColor Yellow
        . $activatePath
    } else {
        Write-Host "No .venv activation script found; continuing with system Python." -ForegroundColor Yellow
    }

    # Install dependencies
    if (-not $SkipInstall) {
        if (Test-Path 'requirements.txt') {
            Write-Host "Installing Python dependencies from requirements.txt..." -ForegroundColor Yellow
            pip install --upgrade pip
            pip install -r requirements.txt
        } else {
            Write-Host "requirements.txt not found in ml-service; skipping pip install." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Skipping pip install (per -SkipInstall)." -ForegroundColor Yellow
    }

    # Ensure output models dir exists
    if (-not (Test-Path $ModelsOutDir)) {
        Write-Host "Creating models output directory: $ModelsOutDir" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $ModelsOutDir | Out-Null
    }

    # Data preparation
    if (-not $SkipPrep) {
        Write-Host "Running OCR data preparation..." -ForegroundColor Cyan
        python .\scripts\prepare_ocr_data.py

        Write-Host "Running feature extraction..." -ForegroundColor Cyan
        python .\scripts\extract_dataset_features.py

        # Optionally generate synthetic data if script exists
        if (Test-Path .\scripts\generate_synthetic_certificates.py) {
            Write-Host "Generating synthetic certificates (if configured)..." -ForegroundColor Cyan
            python .\scripts\generate_synthetic_certificates.py
        }
    } else {
        Write-Host "Skipping data preparation (per -SkipPrep)." -ForegroundColor Yellow
    }

    # Training
    Write-Host "Running master training script (train_models.py)..." -ForegroundColor Cyan
    python .\scripts\train_models.py

    # Optional: run fraud-specific training if the script exists
    if (Test-Path .\scripts\train_fraud_detection.py) {
        Write-Host "Running fraud detection training (train_fraud_detection.py)..." -ForegroundColor Cyan
        try {
            python .\scripts\train_fraud_detection.py
        } catch {
            Write-Host "Warning: train_fraud_detection.py failed: $_" -ForegroundColor Yellow
        }
    }

    # Run demo
    Write-Host "Running demo to validate models..." -ForegroundColor Cyan
    python .\demo.py

    # Copy generated models to ModelsOutDir
    Write-Host "Copying model artifacts to: $ModelsOutDir" -ForegroundColor Cyan
    $srcModels = Join-Path $PSScriptRoot 'models'
    if (Test-Path $srcModels) {
        Get-ChildItem -Path $srcModels -File | ForEach-Object {
            Copy-Item -Path $_.FullName -Destination $ModelsOutDir -Force
        }
        Write-Host "Models copied." -ForegroundColor Green
    } else {
        Write-Host "No models directory found at $srcModels" -ForegroundColor Yellow
    }

    Write-Host "ML training pipeline completed successfully." -ForegroundColor Green
}
catch {
    Write-Error "Pipeline failed: $_"
    Exit 1
}
finally {
    Stop-Transcript | Out-Null
    if ($PSBoundParameters.ContainsKey('SkipInstall') -or $PSBoundParameters.ContainsKey('SkipPrep')) {
        # nothing
    }
    Pop-Location
}
