"""
Document Classifier - Use Case 1
Classifies documents as certificate/non-certificate using pre-trained models
NO TRAINING REQUIRED - works out of the box!
"""

from transformers import pipeline, AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
from typing import Dict
from pathlib import Path

class DocumentClassifier:
    def __init__(self, use_custom_model: bool = False):
        """
        Initialize document classifier with pre-trained model.
        
        Args:
            use_custom_model: If True, uses a model specifically for documents.
                            If False, uses general image classifier (faster).
        """
        print("🔄 Loading pre-trained image classification model...")
        
        if use_custom_model:
            # Use document-specific model (better accuracy)
            model_name = "microsoft/dit-base-finetuned-rvlcdip"  # Document Image Transformer
            print(f"   Model: {model_name} (Document-specific)")
        else:
            # Use general image classifier (faster, good enough)
            model_name = "microsoft/resnet-50"
            print(f"   Model: {model_name} (General purpose)")
        
        try:
            self.classifier = pipeline(
                "image-classification",
                model=model_name,
                device=0 if torch.cuda.is_available() else -1  # GPU if available
            )
            print("✅ Model loaded successfully!")
        except Exception as e:
            print(f"⚠️  Error loading {model_name}: {e}")
            print("🔄 Falling back to basic ResNet model...")
            self.classifier = pipeline("image-classification", model="microsoft/resnet-50")
    
    def classify_image(self, image_path: str, threshold: float = 0.6) -> Dict:
        """
        Classify if an image is a certificate or not.
        
        Args:
            image_path: Path to image file
            threshold: Confidence threshold (0-1)
            
        Returns:
            Dictionary with classification result and confidence
        """
        if not Path(image_path).exists():
            return {
                'error': f"File not found: {image_path}",
                'is_certificate': False,
                'confidence': 0.0
            }
        
        print(f"📄 Analyzing image: {image_path}")
        
        try:
            # Load image
            image = Image.open(image_path).convert('RGB')
            
            # Run classification
            results = self.classifier(image, top_k=5)
            
            # Analyze results to determine if it's a certificate
            is_certificate, confidence = self._analyze_results(results)
            
            return {
                'is_certificate': is_certificate,
                'confidence': round(confidence, 3),
                'passed_threshold': confidence >= threshold,
                'top_predictions': results,
                'verdict': self._get_verdict(is_certificate, confidence)
            }
            
        except Exception as e:
            print(f"❌ Error processing image: {e}")
            return {
                'error': str(e),
                'is_certificate': False,
                'confidence': 0.0
            }
    
    def _analyze_results(self, results: list) -> tuple:
        """
        Analyze classification results to determine if image is a certificate.
        
        Args:
            results: List of predictions from model
            
        Returns:
            Tuple of (is_certificate: bool, confidence: float)
        """
        # Keywords that indicate a certificate/document
        certificate_keywords = [
            'certificate', 'diploma', 'document', 'paper', 'form',
            'letter', 'text', 'page', 'book', 'sheet', 'menu',
            'receipt', 'invoice', 'ticket'
        ]
        
        # Check top predictions
        for prediction in results:
            label = prediction['label'].lower()
            score = prediction['score']
            
            # Check if label contains certificate-related keywords
            if any(keyword in label for keyword in certificate_keywords):
                return True, score
        
        # If no certificate keywords found, check if it looks like a document
        top_label = results[0]['label'].lower()
        top_score = results[0]['score']
        
        # Common non-certificate categories
        non_certificate_keywords = [
            'person', 'people', 'face', 'animal', 'car', 'building',
            'food', 'nature', 'sky', 'water', 'landscape'
        ]
        
        if any(keyword in top_label for keyword in non_certificate_keywords):
            return False, 1.0 - top_score  # Inverse confidence
        
        # Uncertain - return top score
        return False, top_score * 0.5  # Lower confidence for uncertainty
    
    def _get_verdict(self, is_certificate: bool, confidence: float) -> str:
        """Generate human-readable verdict"""
        if is_certificate:
            if confidence >= 0.8:
                return "✅ Definitely a certificate/document"
            elif confidence >= 0.6:
                return "✓ Likely a certificate/document"
            else:
                return "? Possibly a certificate/document"
        else:
            if confidence >= 0.8:
                return "❌ Definitely NOT a certificate"
            elif confidence >= 0.6:
                return "✗ Likely NOT a certificate"
            else:
                return "? Uncertain classification"
    
    def classify_batch(self, image_paths: list, threshold: float = 0.6) -> list:
        """
        Classify multiple images at once.
        
        Args:
            image_paths: List of image file paths
            threshold: Confidence threshold (0-1)
            
        Returns:
            List of classification results
        """
        results = []
        
        print(f"\n📦 Batch processing {len(image_paths)} images...")
        
        for i, path in enumerate(image_paths, 1):
            print(f"   [{i}/{len(image_paths)}] {Path(path).name}")
            result = self.classify_image(path, threshold)
            result['filename'] = Path(path).name
            results.append(result)
        
        # Summary statistics
        certificates = sum(1 for r in results if r.get('is_certificate', False))
        print(f"\n📊 Results: {certificates}/{len(results)} identified as certificates")
        
        return results


# Simple rule-based classifier (fallback if models fail)
class SimpleDocumentClassifier:
    """
    Lightweight classifier using image properties (no ML needed).
    Useful for quick checks or when ML models unavailable.
    """
    
    @staticmethod
    def classify(image_path: str) -> Dict:
        """Classify based on image properties"""
        try:
            image = Image.open(image_path)
            width, height = image.size
            aspect_ratio = width / height
            
            # Certificates are usually:
            # - Horizontal (landscape) or vertical (portrait)
            # - High contrast (lots of white background)
            # - Standard aspect ratios (A4, letter size)
            
            is_landscape = aspect_ratio > 1.2
            is_portrait = aspect_ratio < 0.8
            is_standard_ratio = (
                0.7 <= aspect_ratio <= 0.8 or  # Portrait (A4)
                1.3 <= aspect_ratio <= 1.5      # Landscape
            )
            
            # Convert to grayscale and check brightness
            grayscale = image.convert('L')
            pixels = list(grayscale.getdata())
            avg_brightness = sum(pixels) / len(pixels)
            
            # Certificates tend to have high average brightness (white background)
            is_bright = avg_brightness > 180
            
            # Simple scoring
            score = 0
            if is_standard_ratio:
                score += 0.4
            if is_bright:
                score += 0.3
            if is_landscape or is_portrait:
                score += 0.3
            
            is_certificate = score >= 0.5
            
            return {
                'is_certificate': is_certificate,
                'confidence': round(score, 3),
                'method': 'rule-based',
                'properties': {
                    'aspect_ratio': round(aspect_ratio, 2),
                    'avg_brightness': round(avg_brightness, 1),
                    'is_standard_ratio': is_standard_ratio
                }
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'is_certificate': False,
                'confidence': 0.0
            }


# Standalone function for easy import
def classify_document(image_path: str, use_ml: bool = True) -> Dict:
    """
    Quick helper to classify a document.
    
    Args:
        image_path: Path to image
        use_ml: If True, uses ML model. If False, uses rule-based.
        
    Returns:
        Classification result dictionary
    """
    if use_ml:
        classifier = DocumentClassifier()
        return classifier.classify_image(image_path)
    else:
        return SimpleDocumentClassifier.classify(image_path)


# Test script
if __name__ == "__main__":
    import sys
    
    print("\n" + "="*60)
    print("🏷️  Document Classifier - Use Case 1")
    print("="*60 + "\n")
    
    if len(sys.argv) < 2:
        print("❌ Usage: python document_classifier.py <image_path>")
        print("\nExample:")
        print("  python document_classifier.py ../uploads/certificate.jpg")
        print("\nOr test with multiple images:")
        print("  python document_classifier.py image1.jpg image2.jpg image3.jpg")
        sys.exit(1)
    
    image_paths = sys.argv[1:]
    
    # Check if files exist
    valid_paths = [p for p in image_paths if Path(p).exists()]
    invalid_paths = [p for p in image_paths if not Path(p).exists()]
    
    if invalid_paths:
        print("⚠️  Warning: Files not found:")
        for p in invalid_paths:
            print(f"   - {p}")
        print()
    
    if not valid_paths:
        print("❌ No valid image files provided!")
        sys.exit(1)
    
    # Initialize classifier
    print("🔧 Initializing ML-based classifier...")
    classifier = DocumentClassifier(use_custom_model=False)
    
    # Classify images
    if len(valid_paths) == 1:
        # Single image - detailed output
        result = classifier.classify_image(valid_paths[0])
        
        print("\n" + "="*60)
        print("📊 CLASSIFICATION RESULT")
        print("="*60)
        print(f"File: {Path(valid_paths[0]).name}")
        print(f"\n{result.get('verdict', 'Unknown')}")
        print(f"Confidence: {result.get('confidence', 0):.1%}")
        print(f"Is Certificate: {'✅ Yes' if result.get('is_certificate') else '❌ No'}")
        
        if 'top_predictions' in result:
            print(f"\n🎯 Top Predictions:")
            for i, pred in enumerate(result['top_predictions'][:3], 1):
                print(f"  {i}. {pred['label']}: {pred['score']:.1%}")
        
        if 'error' in result:
            print(f"\n❌ Error: {result['error']}")
    
    else:
        # Multiple images - batch processing
        results = classifier.classify_batch(valid_paths)
        
        print("\n" + "="*60)
        print("📊 BATCH CLASSIFICATION RESULTS")
        print("="*60 + "\n")
        
        for result in results:
            status = "✅" if result.get('is_certificate') else "❌"
            print(f"{status} {result['filename']}")
            print(f"   Confidence: {result.get('confidence', 0):.1%}")
            print(f"   {result.get('verdict', 'Unknown')}\n")
    
    print("="*60)
    print("✅ Classification complete!")
    print("="*60 + "\n")
