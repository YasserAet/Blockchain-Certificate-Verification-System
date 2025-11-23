"""
Model Loader Service
Loads trained models and provides inference functions
"""

import os
import json
import torch
import numpy as np
from pathlib import Path
from PIL import Image
from torchvision import models
import torch.nn as nn
from transformers import pipeline

class ModelLoader:
    def __init__(self, models_dir: str = "models"):
        self.models_dir = Path(models_dir)
        self.models_dir.mkdir(parents=True, exist_ok=True)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load models
        self.fraud_detection_model = self._load_fraud_detection_model()
        self.ner_pipeline = self._load_ner_pipeline()
        self.metrics = self._load_metrics()
        
    def _load_fraud_detection_model(self):
        """Load trained fraud detection model"""
        model_path = self.models_dir / "fraud_detection_best.pth"
        
        if not model_path.exists():
            print(f"[Model] No trained fraud detection model found at {model_path}")
            print("[Model] Using dummy model for inference")
            return None
        
        try:
            model = models.resnet50(pretrained=False)
            num_features = model.fc.in_features
            model.fc = nn.Sequential(
                nn.Linear(num_features, 512),
                nn.ReLU(),
                nn.Dropout(0.5),
                nn.Linear(512, 1),
                nn.Sigmoid()
            )
            
            model.load_state_dict(torch.load(model_path, map_location=self.device))
            model.to(self.device)
            model.eval()
            
            print(f"[Model] Loaded fraud detection model from {model_path}")
            return model
        except Exception as e:
            print(f"[Model] Error loading fraud detection model: {e}")
            return None
    
    def _load_ner_pipeline(self):
        """Load NER pipeline for skill extraction"""
        try:
            pipeline_model = pipeline(
                "ner",
                model="dslim/distilbert-NER",
                device=0 if torch.cuda.is_available() else -1
            )
            print("[Model] Loaded NER pipeline for skill extraction")
            return pipeline_model
        except Exception as e:
            print(f"[Model] Error loading NER pipeline: {e}")
            return None
    
    def _load_metrics(self):
        """Load model performance metrics"""
        metrics_path = self.models_dir / "fraud_detection_metrics.json"
        
        if metrics_path.exists():
            with open(metrics_path, 'r') as f:
                return json.load(f)
        
        return {
            "accuracy": 0.0,
            "precision": 0.0,
            "recall": 0.0,
            "f1_score": 0.0,
            "roc_auc": 0.0
        }
    
    def predict_fraud(self, image_array: np.ndarray) -> dict:
        """Predict if certificate is fraudulent
        
        Args:
            image_array: Image as numpy array (H, W, 3)
        
        Returns:
            dict with fraud prediction and confidence
        """
        if self.fraud_detection_model is None:
            # Return mock prediction if model not loaded
            return {
                "is_fraud": False,
                "confidence": 0.85,
                "fraud_type": "none",
                "model_loaded": False
            }
        
        try:
            # Prepare image
            image = Image.fromarray((image_array * 255).astype(np.uint8))
            image = image.resize((224, 224))
            image_tensor = torch.from_numpy(np.array(image)).permute(2, 0, 1).float() / 255.0
            image_tensor = image_tensor.unsqueeze(0).to(self.device)
            
            # Predict
            with torch.no_grad():
                output = self.fraud_detection_model(image_tensor)
                confidence = float(output.item())
            
            is_fraud = confidence > 0.5
            
            return {
                "is_fraud": is_fraud,
                "confidence": confidence,
                "fraud_type": "possible_forgery" if is_fraud else "authentic",
                "model_loaded": True
            }
        except Exception as e:
            print(f"[Model] Error in fraud prediction: {e}")
            return {
                "is_fraud": False,
                "confidence": 0.0,
                "fraud_type": "error",
                "error": str(e),
                "model_loaded": False
            }
    
    def extract_skills(self, text: str) -> list:
        """Extract skills from certificate text using NER
        
        Args:
            text: Extracted certificate text
        
        Returns:
            list of extracted skills
        """
        if self.ner_pipeline is None:
            return []
        
        try:
            entities = self.ner_pipeline(text[:512])  # Limit to 512 chars
            skills = [entity['word'] for entity in entities if entity['entity_group'] in ['SKILL', 'MISC']]
            return list(set(skills))
        except Exception as e:
            print(f"[Model] Error extracting skills: {e}")
            return []
    
    def get_metrics(self) -> dict:
        """Get model performance metrics"""
        return self.metrics

# Singleton instance
_model_loader = None

def get_model_loader():
    global _model_loader
    if _model_loader is None:
        _model_loader = ModelLoader()
    return _model_loader
