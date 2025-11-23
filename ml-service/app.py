Add model initialization on startup and comprehensive health checks
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from src.routes import ocr_routes, fraud_detection_routes, classification_routes, skills_routes
from src.services.model_loader import get_model_loader

load_dotenv()

app = FastAPI(
    title="Credential Chain ML Service",
    description="AI/ML microservice for certificate processing",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model loader on startup
@app.on_event("startup")
async def startup_event():
    """Initialize ML models on service startup"""
    print("[Startup] Initializing ML models...")
    loader = get_model_loader()
    metrics = loader.get_metrics()
    print(f"[Startup] Models loaded successfully")
    print(f"[Startup] Fraud Detection Model Metrics:")
    print(f"  - Accuracy: {metrics.get('accuracy', 0.0):.4f}")
    print(f"  - F1 Score: {metrics.get('f1_score', 0.0):.4f}")
    print(f"  - ROC-AUC: {metrics.get('roc_auc', 0.0):.4f}")

# Include routes
app.include_router(ocr_routes.router, prefix="/ocr", tags=["OCR"])
app.include_router(fraud_detection_routes.router, prefix="/fraud", tags=["Fraud Detection"])
app.include_router(classification_routes.router, prefix="/classify", tags=["Classification"])
app.include_router(skills_routes.router, prefix="/skills", tags=["Skills Extraction"])

@app.get("/health")
async def health_check():
    """Comprehensive health check endpoint"""
    loader = get_model_loader()
    metrics = loader.get_metrics()
    
    return {
        "status": "ok",
        "service": "Credential Chain ML Service",
        "version": "2.0.0",
        "models": {
            "fraud_detection": {
                "loaded": loader.fraud_detection_model is not None,
                "metrics": metrics
            },
            "ner_pipeline": {
                "loaded": loader.ner_pipeline is not None
            }
        }
    }

@app.get("/")
async def root():
    """Root endpoint with API documentation"""
    return {
        "message": "Credential Chain ML Service v2.0",
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "ocr": "/ocr/process",
            "fraud_detection": "/fraud/detect",
            "classification": "/classify/certificate",
            "skills": "/skills/extract",
            "skill_taxonomy": "/skills/taxonomy"
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
