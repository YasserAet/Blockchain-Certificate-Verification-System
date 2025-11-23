Implement certificate classification using transfer learning
"""
Certificate Classification Service - Classify certificate type
Uses MobileNet v2 for lightweight classification
"""

import torch
import torch.nn as nn
import numpy as np
from PIL import Image
from torchvision import models, transforms
import io

class ClassificationService:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.classes = ['academic', 'professional', 'bootcamp', 'government']
        self.model = self._load_model()
        
        # Image preprocessing
        self.transforms = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def _load_model(self):
        """Load pretrained MobileNet v2 for classification"""
        try:
            model = models.mobilenet_v2(pretrained=True)
            # Modify final layer for 4 classes
            model.classifier[1] = nn.Linear(model.last_channel, len(self.classes))
            model.to(self.device)
            model.eval()
            print("[Classification] MobileNet v2 model loaded")
            return model
        except Exception as e:
            print(f"[Classification] Error loading model: {e}")
            return None
    
    def classify(self, image_data: bytes) -> dict:
        """Classify certificate type from image
        
        Args:
            image_data: Image as bytes
        
        Returns:
            dict with classification and confidence
        """
        try:
            # Load and preprocess image
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            image_tensor = self.transforms(image).unsqueeze(0).to(self.device)
            
            # Predict
            if self.model is None:
                # Return mock classification if model not available
                return {
                    "certificate_type": "professional",
                    "confidence": 0.75,
                    "all_predictions": {cls: 0.25 for cls in self.classes},
                    "model_loaded": False
                }
            
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.softmax(outputs, dim=1)[0]
                confidence, predicted = torch.max(probabilities, 0)
            
            predicted_class = self.classes[predicted.item()]
            confidence_score = float(confidence.item())
            
            # Get all predictions
            all_preds = {
                self.classes[i]: float(probabilities[i].item())
                for i in range(len(self.classes))
            }
            
            return {
                "certificate_type": predicted_class,
                "confidence": confidence_score,
                "all_predictions": all_preds,
                "model_loaded": True
            }
        except Exception as e:
            return {
                "error": str(type(e).__name__),
                "message": str(e),
                "certificate_type": "unknown",
                "confidence": 0.0,
                "model_loaded": False
            }

# Singleton instance
_classification_service = None

def get_classification_service():
    global _classification_service
    if _classification_service is None:
        _classification_service = ClassificationService()
    return _classification_service
