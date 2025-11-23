Implement certificate classification using MobileNet
from fastapi import APIRouter, File, UploadFile, HTTPException
from src.services.classification_service import get_classification_service
import time

router = APIRouter()

@router.post("/certificate")
async def classify_certificate(file: UploadFile = File(...)):
    """
    Classify certificate type using CNN
    
    Returns certificate category and confidence
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        start_time = time.time()
        
        # Read file
        file_content = await file.read()
        
        # Get classification service
        service = get_classification_service()
        
        # Classify
        classification = service.classify(file_content)
        
        processing_time = (time.time() - start_time) * 1000
        
        # Prepare response
        all_predictions = classification.get('all_predictions', {})
        sorted_predictions = sorted(all_predictions.items(), key=lambda x: x[1], reverse=True)
        alternatives = [
            {"type": pred[0], "confidence": round(pred[1], 4)}
            for pred in sorted_predictions[1:3]
        ]
        
        result = {
            "filename": file.filename,
            "classification": {
                "type": classification.get('certificate_type', 'unknown'),
                "confidence": round(classification.get('confidence', 0.0), 4)
            },
            "alternatives": alternatives,
            "model_version": "v2.0",
            "processing_time_ms": round(processing_time, 2),
            "model_loaded": classification.get('model_loaded', False)
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")
