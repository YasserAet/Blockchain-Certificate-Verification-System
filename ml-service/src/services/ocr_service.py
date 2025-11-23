Implement Tesseract OCR service with image preprocessing
"""
OCR Service - Text extraction from certificate images
Uses Tesseract OCR for production-grade text recognition
"""

import pytesseract
from PIL import Image
import numpy as np
import io
from pathlib import Path

class OCRService:
    def __init__(self):
        self.supported_languages = ['eng', 'spa', 'fra', 'deu', 'zho', 'ara', 'jpn', 'kor']
    
    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """Preprocess image for better OCR accuracy
        
        Args:
            image: PIL Image object
        
        Returns:
            Preprocessed PIL Image
        """
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Enhance contrast
        from PIL import ImageEnhance
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)
        
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.1)
        
        return image
    
    def extract_text(self, image_data: bytes, lang: str = 'eng') -> dict:
        """Extract text from certificate image using Tesseract
        
        Args:
            image_data: Image as bytes
            lang: Language code for OCR (default: 'eng')
        
        Returns:
            dict with extracted text and confidence scores
        """
        try:
            # Load image
            image = Image.open(io.BytesIO(image_data))
            
            # Preprocess
            image = self.preprocess_image(image)
            
            # Run OCR
            text = pytesseract.image_to_string(image, lang=lang)
            
            # Get detailed results with confidence
            data = pytesseract.image_to_data(image, lang=lang, output_type='dict')
            
            # Calculate average confidence
            confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
            avg_confidence = np.mean(confidences) / 100.0 if confidences else 0.0
            
            # Extract structured data
            extracted = {
                "raw_text": text,
                "avg_confidence": float(avg_confidence),
                "language": lang,
                "words_detected": len([w for w in data['text'] if w.strip()]),
                "detailed_data": {
                    "words": data['text'],
                    "confidences": [int(c) / 100.0 for c in data['conf']],
                    "positions": {
                        "left": data['left'],
                        "top": data['top'],
                        "width": data['width'],
                        "height": data['height']
                    }
                }
            }
            
            return extracted
        except pytesseract.TesseractNotFoundError:
            return {
                "error": "Tesseract not installed",
                "message": "Install Tesseract-OCR and pytesseract",
                "raw_text": "",
                "avg_confidence": 0.0
            }
        except Exception as e:
            return {
                "error": str(type(e).__name__),
                "message": str(e),
                "raw_text": "",
                "avg_confidence": 0.0
            }
    
    def extract_fields(self, text: str) -> dict:
        """Extract specific certificate fields from text
        
        Args:
            text: Raw OCR text
        
        Returns:
            dict with extracted fields
        """
        lines = text.split('\n')
        
        fields = {
            "recipient_name": None,
            "institution": None,
            "certificate_title": None,
            "issue_date": None,
            "course_details": []
        }
        
        # Simple heuristics for field extraction
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            if 'certificate' in line_lower and 'of' in line_lower:
                if i + 1 < len(lines):
                    fields["certificate_title"] = lines[i + 1].strip()
            
            if 'university' in line_lower or 'school' in line_lower:
                fields["institution"] = line.strip()
            
            if any(month in line_lower for month in ['january', 'february', 'march', 'april', 'may', 'june',
                                                       'july', 'august', 'september', 'october', 'november', 'december']):
                fields["issue_date"] = line.strip()
        
        return fields

# Singleton instance
_ocr_service = None

def get_ocr_service():
    global _ocr_service
    if _ocr_service is None:
        _ocr_service = OCRService()
    return _ocr_service
