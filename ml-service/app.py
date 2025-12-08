from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="BCVS ML Service",
    description="Machine Learning service for certificate fraud detection and OCR",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global models storage
models = {}

# Pydantic models
class FraudDetectionRequest(BaseModel):
    features: List[float]
    certificate_id: Optional[str] = None

class FraudDetectionResponse(BaseModel):
    certificate_id: Optional[str]
    fraud_score: float
    is_fraudulent: bool
    confidence: float
    model_version: str

class OCRRequest(BaseModel):
    features: List[float]

class OCRResponse(BaseModel):
    extracted_text: str
    confidence: float

class CourseRatingRequest(BaseModel):
    feature: float

class CourseRatingResponse(BaseModel):
    predicted_rating: float
    confidence: float

class HealthResponse(BaseModel):
    status: str
    models_loaded: int
    service: str
    version: str

class ModelInfo(BaseModel):
    name: str
    type: str
    loaded: bool

def load_models():
    """Load all ML models on startup"""
    models_dir = Path("models")
    
    try:
        # Fraud detection models
        models['fraud_classifier'] = joblib.load(models_dir / "fraud_classifier.pkl")
        models['fraud_scaler'] = joblib.load(models_dir / "fraud_scaler.pkl")
        logger.info("✅ Fraud detection models loaded")
        
        # OCR models
        models['ocr_classifier'] = joblib.load(models_dir / "ocr_classifier.pkl")
        models['ocr_scaler'] = joblib.load(models_dir / "ocr_scaler.pkl")
        models['ocr_label_encoder'] = joblib.load(models_dir / "ocr_label_encoder.pkl")
        logger.info("✅ OCR models loaded")
        
        # Course rating models
        models['coursera_regressor'] = joblib.load(models_dir / "coursera_regressor.pkl")
        models['coursera_scaler'] = joblib.load(models_dir / "coursera_scaler.pkl")
        logger.info("✅ Course rating models loaded")
        
        # Additional models
        models['classifier'] = joblib.load(models_dir / "classifier.pkl")
        models['regressor'] = joblib.load(models_dir / "regressor.pkl")
        logger.info("✅ Additional models loaded")
        
        logger.info(f"🎉 Total models loaded: {len(models)}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}")
        return False

@app.on_event("startup")
async def startup_event():
    """Load models when the application starts"""
    logger.info("🚀 Starting ML Service...")
    if load_models():
        logger.info("✅ ML Service ready!")
    else:
        logger.error("❌ Failed to load models")

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint"""
    return {
        "status": "ok",
        "models_loaded": len(models),
        "service": "BCVS ML Service",
        "version": "1.0.0"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy" if len(models) > 0 else "unhealthy",
        "models_loaded": len(models),
        "service": "BCVS ML Service",
        "version": "1.0.0"
    }

@app.get("/models/info")
async def get_models_info():
    """Get information about loaded models"""
    model_info = []
    
    model_types = {
        'fraud_classifier': 'classifier',
        'fraud_scaler': 'scaler',
        'ocr_classifier': 'classifier',
        'ocr_scaler': 'scaler',
        'ocr_label_encoder': 'encoder',
        'coursera_regressor': 'regressor',
        'coursera_scaler': 'scaler',
        'classifier': 'classifier',
        'regressor': 'regressor'
    }
    
    for name, model_type in model_types.items():
        model_info.append({
            "name": name,
            "type": model_type,
            "loaded": name in models
        })
    
    return {
        "total_models": len(models),
        "models": model_info
    }

@app.post("/fraud-detection", response_model=FraudDetectionResponse)
async def detect_fraud(request: FraudDetectionRequest):
    """
    Detect fraud in certificate
    
    Features should be a list of numerical values representing certificate characteristics
    """
    try:
        if 'fraud_classifier' not in models or 'fraud_scaler' not in models:
            raise HTTPException(status_code=500, detail="Fraud detection models not loaded")
        
        # Prepare features
        features_array = np.array(request.features).reshape(1, -1)
        
        # Scale features
        scaled_features = models['fraud_scaler'].transform(features_array)
        
        # Predict
        prediction = models['fraud_classifier'].predict(scaled_features)[0]
        probability = models['fraud_classifier'].predict_proba(scaled_features)[0]
        
        # Calculate fraud score (0-100)
        fraud_score = float(probability[1] * 100)  # Probability of fraud class
        is_fraudulent = fraud_score > 70.0  # Threshold at 70%
        
        return {
            "certificate_id": request.certificate_id,
            "fraud_score": round(fraud_score, 2),
            "is_fraudulent": is_fraudulent,
            "confidence": round(float(max(probability)) * 100, 2),
            "model_version": "1.0.0"
        }
        
    except Exception as e:
        logger.error(f"Fraud detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ocr", response_model=OCRResponse)
async def perform_ocr(request: OCRRequest):
    """
    Perform OCR on certificate image features
    
    Features should be processed image features
    """
    try:
        if 'ocr_classifier' not in models:
            raise HTTPException(status_code=500, detail="OCR models not loaded")
        
        # Prepare features
        features_array = np.array(request.features).reshape(1, -1)
        
        # Scale if scaler available
        if 'ocr_scaler' in models:
            features_array = models['ocr_scaler'].transform(features_array)
        
        # Predict
        prediction = models['ocr_classifier'].predict(features_array)[0]
        probability = models['ocr_classifier'].predict_proba(features_array)[0]
        
        # Decode if label encoder available
        if 'ocr_label_encoder' in models:
            extracted_text = str(models['ocr_label_encoder'].inverse_transform([prediction])[0])
        else:
            extracted_text = str(prediction)
        
        return {
            "extracted_text": extracted_text,
            "confidence": round(float(max(probability)) * 100, 2)
        }
        
    except Exception as e:
        logger.error(f"OCR error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-rating", response_model=CourseRatingResponse)
async def predict_course_rating(request: CourseRatingRequest):
    """
    Predict course rating based on features
    """
    try:
        if 'coursera_regressor' not in models:
            raise HTTPException(status_code=500, detail="Rating prediction model not loaded")
        
        # Prepare feature
        feature_array = np.array([[request.feature]])
        
        # Scale if available
        if 'coursera_scaler' in models:
            feature_array = models['coursera_scaler'].transform(feature_array)
        
        # Predict
        prediction = models['coursera_regressor'].predict(feature_array)[0]
        
        # Clamp rating between 0 and 5
        rating = max(0.0, min(5.0, float(prediction)))
        
        return {
            "predicted_rating": round(rating, 2),
            "confidence": 85.0  # Based on model RMSE of 0.159
        }
        
    except Exception as e:
        logger.error(f"Rating prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/classify")
async def classify_certificate(features: List[float]):
    """General classification endpoint"""
    try:
        if 'classifier' not in models:
            raise HTTPException(status_code=500, detail="Classifier not loaded")
        
        features_array = np.array(features).reshape(1, -1)
        prediction = models['classifier'].predict(features_array)[0]
        probability = models['classifier'].predict_proba(features_array)[0]
        
        return {
            "prediction": int(prediction),
            "probability": round(float(max(probability)) * 100, 2)
        }
        
    except Exception as e:
        logger.error(f"Classification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
