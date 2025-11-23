"""
OCR Extractor - Use Case 3
Extracts text from certificate images using pre-trained EasyOCR
NO TRAINING REQUIRED - works out of the box!
"""

import easyocr
import re
from typing import Dict, List
from pathlib import Path

class OCRExtractor:
    def __init__(self, languages: List[str] = ['en', 'fr', 'ar']):
        """
        Initialize OCR reader with pre-trained models.
        Downloads models automatically on first run.
        
        Args:
            languages: List of language codes (e.g., ['en', 'fr', 'ar'])
        """
        print(f"Loading pre-trained OCR models for languages: {languages}")
        self.reader = easyocr.Reader(languages, gpu=False)  # Set gpu=True if you have CUDA
        print("✅ OCR models loaded successfully!")
    
    def extract_text(self, image_path: str) -> Dict:
        """
        Extract all text from certificate image.
        
        Args:
            image_path: Path to certificate image
            
        Returns:
            Dictionary with full text and individual fields
        """
        print(f"📄 Processing image: {image_path}")
        
        # Run OCR
        results = self.reader.readtext(image_path)
        
        # Combine all text
        full_text = ' '.join([text for (bbox, text, conf) in results])
        
        # Extract individual fields with positions
        fields = []
        for (bbox, text, confidence) in results:
            fields.append({
                'text': text,
                'confidence': round(confidence, 3),
                'bbox': bbox  # [top-left, top-right, bottom-right, bottom-left]
            })
        
        print(f"✅ Extracted {len(fields)} text fields")
        
        return {
            'full_text': full_text,
            'fields': fields,
            'field_count': len(fields)
        }
    
    def parse_certificate_fields(self, ocr_text: str) -> Dict:
        """
        Parse OCR text into structured certificate fields.
        Uses regex patterns - NO ML NEEDED!
        
        Args:
            ocr_text: Raw text from OCR
            
        Returns:
            Dictionary with structured fields (name, course, date, institution)
        """
        data = {
            'name': None,
            'course': None,
            'date': None,
            'institution': None,
            'grade': None
        }
        
        # Extract date (multiple formats)
        date_patterns = [
            r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',  # 12/31/2024 or 31-12-2024
            r'\d{4}-\d{2}-\d{2}',                # 2024-12-31
            r'[A-Z][a-z]+ \d{1,2},? \d{4}',     # January 31, 2024
            r'\d{1,2} [A-Z][a-z]+ \d{4}'        # 31 January 2024
        ]
        for pattern in date_patterns:
            match = re.search(pattern, ocr_text)
            if match:
                data['date'] = match.group().strip()
                break
        
        # Extract name (after keywords)
        name_keywords = [
            r'(?:awarded to|presented to|this certifies that|name:)\s+([A-Z][a-z]+(?: [A-Z][a-z]+)+)',
            r'(?:student|recipient):?\s+([A-Z][a-z]+(?: [A-Z][a-z]+)+)'
        ]
        for pattern in name_keywords:
            match = re.search(pattern, ocr_text, re.IGNORECASE)
            if match:
                data['name'] = match.group(1).strip()
                break
        
        # Extract course/program name (usually in caps or title case)
        lines = ocr_text.split('\n')
        for line in lines:
            line = line.strip()
            # Look for lines that are all caps and reasonable length
            if 10 < len(line) < 100:
                if line.isupper() and not any(keyword in line.lower() for keyword in ['certificate', 'completion', 'achievement']):
                    data['course'] = line
                    break
        
        # Extract institution (look for "University", "Institute", etc.)
        institution_patterns = [
            r'([A-Z][a-z]+(?: [A-Z][a-z]+)*)\s+(?:University|Institute|College|Academy|School)',
            r'(?:issued by|from):?\s+([A-Z][a-z]+(?: [A-Z][a-z]+)+)'
        ]
        for pattern in institution_patterns:
            match = re.search(pattern, ocr_text)
            if match:
                data['institution'] = match.group().strip()
                break
        
        # Extract grade/score if present
        grade_patterns = [
            r'(?:grade|score|mark):?\s+([\d.]+%?)',
            r'([\d.]+%)\s+(?:score|grade)',
            r'(?:with|grade:?)\s+([A-F][+-]?)'
        ]
        for pattern in grade_patterns:
            match = re.search(pattern, ocr_text, re.IGNORECASE)
            if match:
                data['grade'] = match.group(1).strip()
                break
        
        return data


# Standalone function for easy import
def extract_certificate_data(image_path: str) -> Dict:
    """
    Quick helper function to extract and parse certificate data.
    
    Args:
        image_path: Path to certificate image
        
    Returns:
        Dictionary with OCR text and parsed fields
    """
    extractor = OCRExtractor()
    
    # Extract text
    ocr_result = extractor.extract_text(image_path)
    
    # Parse fields
    parsed_fields = extractor.parse_certificate_fields(ocr_result['full_text'])
    
    return {
        'raw_text': ocr_result['full_text'],
        'fields': ocr_result['fields'],
        'parsed_data': parsed_fields
    }


# Test script
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python ocr_extractor.py <path_to_certificate.jpg>")
        print("\nExample:")
        print("  python ocr_extractor.py ../uploads/certificate.jpg")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not Path(image_path).exists():
        print(f"❌ Error: File not found: {image_path}")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("🔍 OCR Certificate Extractor - Use Case 3")
    print("="*60 + "\n")
    
    # Extract data
    result = extract_certificate_data(image_path)
    
    # Print results
    print("\n📝 RAW OCR TEXT:")
    print("-" * 60)
    print(result['raw_text'])
    
    print("\n\n🎯 PARSED FIELDS:")
    print("-" * 60)
    for key, value in result['parsed_data'].items():
        status = "✅" if value else "❌"
        print(f"{status} {key.upper()}: {value or 'Not found'}")
    
    print("\n\n📊 CONFIDENCE SCORES:")
    print("-" * 60)
    high_conf = [f for f in result['fields'] if f['confidence'] > 0.8]
    low_conf = [f for f in result['fields'] if f['confidence'] < 0.5]
    print(f"High confidence (>80%): {len(high_conf)}/{len(result['fields'])} fields")
    print(f"Low confidence (<50%): {len(low_conf)}/{len(result['fields'])} fields")
    
    if low_conf:
        print("\n⚠️  Low confidence fields:")
        for field in low_conf[:5]:  # Show first 5
            print(f"  - '{field['text']}' ({field['confidence']:.1%})")
    
    print("\n" + "="*60)
    print("✅ Processing complete!")
    print("="*60 + "\n")
