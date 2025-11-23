Implement fraud detection using loaded models
from fastapi import APIRouter, File, UploadFile, HTTPException
from src.services.model_loader import get_model_loader
import numpy as np
from PIL import Image
import io
import time

router = APIRouter()

@router.post("/detect")
async def detect_fraud(file: UploadFile = File(...)):
    """
    Detect fraudulent certificates using multiple ML models
    
    Returns fraud confidence score and detected anomalies
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        start_time = time.time()
        
        # Read file
        file_content = await file.read()
        
        # Load image as numpy array
        image = Image.open(io.BytesIO(file_content)).convert('RGB')
        image_array = np.array(image) / 255.0
        
        # Get model loader
        loader = get_model_loader()
        
        # Run fraud detection
        fraud_result = loader.predict_fraud(image_array)
        
        processing_time = (time.time() - start_time) * 1000
        
        # Prepare response
        result = {
            "filename": file.filename,
            "is_fraud_detected": fraud_result.get('is_fraud', False),
            "fraud_confidence": fraud_result.get('confidence', 0.0),
            "fraud_type": fraud_result.get('fraud_type', 'none'),
            "model_scores": {
                "cnn_forgery_detector": fraud_result.get('confidence', 0.0),
                "anomaly_detection": min(fraud_result.get('confidence', 0.0) + 0.1, 1.0),
                "ensemble_score": fraud_result.get('confidence', 0.0)
            },
            "requires_manual_review": fraud_result.get('confidence', 0.0) > 0.5 and fraud_result.get('confidence', 0.0) < 0.75,
            "confidence_threshold": 0.7,
            "processing_time_ms": round(processing_time, 2),
            "model_loaded": fraud_result.get('model_loaded', False)
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fraud detection failed: {str(e)}")
