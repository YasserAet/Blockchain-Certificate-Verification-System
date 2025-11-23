# ML Quick Start Script
# Run this to get started with the 3 ML use cases

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 ML Service Quick Start" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Install required packages
Write-Host "📦 Step 1: Installing Python packages..." -ForegroundColor Yellow
Write-Host "   This may take 5-10 minutes on first run`n" -ForegroundColor Gray

$packages = @(
    "easyocr",
    "sentence-transformers",
    "transformers",
    "torch",
    "torchvision",
    "pandas",
    "pillow",
    "numpy"
)

foreach ($package in $packages) {
    Write-Host "   Installing $package..." -ForegroundColor Gray
    pip install $package --quiet
}

Write-Host "`n✅ Packages installed!`n" -ForegroundColor Green

# Step 2: Create test directory
Write-Host "📁 Step 2: Creating test directories..." -ForegroundColor Yellow
$testDir = "test_data"
if (!(Test-Path $testDir)) {
    New-Item -ItemType Directory -Path $testDir | Out-Null
    Write-Host "   Created: $testDir/" -ForegroundColor Gray
}

Write-Host "✅ Directories ready!`n" -ForegroundColor Green

# Step 3: Test each use case
Write-Host "🧪 Step 3: Testing ML models...`n" -ForegroundColor Yellow

# Test Use Case 2: Skill Extraction (fastest, no image needed)
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎯 USE CASE 2: Skill Extraction" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

$testText = "Certificate of Completion: Python for Data Science. This course covers Machine Learning, Deep Learning, Pandas, and NumPy."

Write-Host "📝 Test Text:" -ForegroundColor White
Write-Host "   `"$testText`"`n" -ForegroundColor Gray

Write-Host "🔄 Running skill extraction..." -ForegroundColor Yellow
python src/models/skill_extractor.py "$testText"

Write-Host "`n`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "✅ Skill Extraction: TESTED" -ForegroundColor Green
Write-Host "⏭️  OCR & Document Classification: Need sample images" -ForegroundColor Yellow

Write-Host "`n📋 NEXT STEPS:" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

Write-Host "1️⃣  Test OCR (Use Case 3):" -ForegroundColor Cyan
Write-Host "   • Find a certificate image (JPG/PNG)" -ForegroundColor White
Write-Host "   • Run: python src/models/ocr_extractor.py path/to/certificate.jpg`n" -ForegroundColor Gray

Write-Host "2️⃣  Test Document Classification (Use Case 1):" -ForegroundColor Cyan
Write-Host "   • Use same certificate image" -ForegroundColor White
Write-Host "   • Run: python src/models/document_classifier.py path/to/certificate.jpg`n" -ForegroundColor Gray

Write-Host "3️⃣  Download Coursera Dataset (Optional):" -ForegroundColor Cyan
Write-Host "   • Install Kaggle CLI: pip install kaggle" -ForegroundColor White
Write-Host "   • Get API key: https://www.kaggle.com/settings" -ForegroundColor White
Write-Host "   • Download: kaggle datasets download -d khusheekapoor/coursera-courses-dataset-2021`n" -ForegroundColor Gray

Write-Host "4️⃣  Start ML API Server:" -ForegroundColor Cyan
Write-Host "   • Run: python app.py" -ForegroundColor White
Write-Host "   • Access: http://localhost:8000/docs`n" -ForegroundColor Gray

Write-Host "`n💡 TIP: You can test with ANY certificate image you find online!" -ForegroundColor Yellow
Write-Host "   Just download it and use the commands above.`n" -ForegroundColor Gray

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Quick Start Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
