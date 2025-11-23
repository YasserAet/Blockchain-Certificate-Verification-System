"""
Synthetic Certificate Generator
Generates realistic training data for ML models without needing real certificates
"""

import os
import json
import random
from datetime import datetime, timedelta
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import numpy as np

class SyntheticCertificateGenerator:
    def __init__(self, output_dir: str = "training_data/certificates"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Certificate templates
        self.templates = {
            "academic": self._generate_academic_certificate,
            "professional": self._generate_professional_certificate,
            "bootcamp": self._generate_bootcamp_certificate,
        }
        
        # Sample data
        self.institutions = [
            "MIT", "Stanford University", "Harvard University", 
            "University of California", "Yale University", "Princeton University",
            "CodeCademy", "Coursera", "Udacity", "LinkedIn Learning"
        ]
        
        self.names = [
            "John Smith", "Sarah Johnson", "Michael Chen", "Emily Williams",
            "David Brown", "Jessica Davis", "Robert Miller", "Amanda Wilson",
            "Christopher Lee", "Michelle Anderson"
        ]
        
        self.courses = [
            "Computer Science", "Data Science", "Machine Learning",
            "Web Development", "Cloud Computing", "Cybersecurity",
            "Artificial Intelligence", "Software Engineering", "DevOps"
        ]
        
        self.grades = ["A", "A-", "B+", "B", "B-", "Excellent", "Pass"]

    def _generate_academic_certificate(self) -> Image.Image:
        """Generate a realistic academic certificate"""
        # Create image with light blue background
        img = Image.new('RGB', (1200, 800), color=(240, 248, 255))
        draw = ImageDraw.Draw(img)
        
        # Try to use default font, fallback to basic font if not available
        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
            header_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
            body_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        except:
            title_font = ImageFont.load_default()
            header_font = ImageFont.load_default()
            body_font = ImageFont.load_default()
        
        # Draw decorative border
        border_color = (25, 55, 125)
        draw.rectangle([50, 50, 1150, 750], outline=border_color, width=5)
        draw.rectangle([60, 60, 1140, 740], outline=border_color, width=2)
        
        # Title
        title = "Certificate of Achievement"
        draw.text((600, 100), title, fill=(25, 55, 125), font=title_font, anchor="mm")
        
        # Institution
        institution = random.choice(self.institutions)
        draw.text((600, 180), institution, fill=(50, 50, 50), font=header_font, anchor="mm")
        
        # Course
        course = random.choice(self.courses)
        draw.text((600, 250), f"Has successfully completed the course in", fill=(50, 50, 50), font=body_font, anchor="mm")
        draw.text((600, 310), course, fill=(25, 55, 125), font=header_font, anchor="mm")
        
        # Recipient
        recipient = random.choice(self.names)
        draw.text((600, 400), f"This certifies that {recipient}", fill=(50, 50, 50), font=body_font, anchor="mm")
        draw.text((600, 460), "has demonstrated proficiency in the above subject", fill=(50, 50, 50), font=body_font, anchor="mm")
        
        # Date
        date_str = (datetime.now() - timedelta(days=random.randint(1, 365))).strftime("%B %d, %Y")
        draw.text((600, 570), f"Date: {date_str}", fill=(50, 50, 50), font=body_font, anchor="mm")
        
        # Grade/Score
        grade = random.choice(self.grades)
        draw.text((600, 630), f"Grade: {grade}", fill=(25, 55, 125), font=body_font, anchor="mm")
        
        # Signature line
        draw.line([(200, 700), (450, 700)], fill=(50, 50, 50), width=2)
        draw.text((325, 720), "Director", fill=(50, 50, 50), font=body_font, anchor="mm")
        
        return img

    def _generate_professional_certificate(self) -> Image.Image:
        """Generate a professional training certificate"""
        img = Image.new('RGB', (1200, 800), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        
        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 44)
            header_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32)
            body_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
        except:
            title_font = ImageFont.load_default()
            header_font = ImageFont.load_default()
            body_font = ImageFont.load_default()
        
        # Modern design with gradient feel (using shapes)
        draw.rectangle([0, 0, 1200, 150], fill=(0, 102, 204))
        
        # Title
        draw.text((600, 75), "Certificate of Completion", fill=(255, 255, 255), font=title_font, anchor="mm")
        
        # Organization
        organization = random.choice(self.institutions)
        draw.text((100, 250), f"Organization:", fill=(50, 50, 50), font=body_font)
        draw.text((100, 300), organization, fill=(0, 102, 204), font=header_font)
        
        # Course name
        course = random.choice(self.courses)
        draw.text((100, 380), f"Course:", fill=(50, 50, 50), font=body_font)
        draw.text((100, 430), course, fill=(0, 102, 204), font=header_font)
        
        # Recipient name
        recipient = random.choice(self.names)
        draw.text((100, 510), f"Awarded to:", fill=(50, 50, 50), font=body_font)
        draw.text((100, 560), recipient, fill=(0, 102, 204), font=header_font)
        
        # Date
        date_str = (datetime.now() - timedelta(days=random.randint(1, 365))).strftime("%B %d, %Y")
        draw.text((800, 250), f"Date Issued: {date_str}", fill=(50, 50, 50), font=body_font)
        
        # Certificate ID
        cert_id = f"CERT-{random.randint(100000, 999999)}"
        draw.text((800, 300), f"ID: {cert_id}", fill=(50, 50, 50), font=body_font)
        
        return img

    def _generate_bootcamp_certificate(self) -> Image.Image:
        """Generate a bootcamp/online course certificate"""
        img = Image.new('RGB', (1200, 800), color=(245, 245, 245))
        draw = ImageDraw.Draw(img)
        
        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56)
            body_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        except:
            title_font = ImageFont.load_default()
            body_font = ImageFont.load_default()
        
        # Colored accent bar
        draw.rectangle([0, 0, 1200, 100], fill=(76, 175, 80))
        
        # Main title
        draw.text((600, 200), "Certificate of Completion", fill=(76, 175, 80), font=title_font, anchor="mm")
        
        # Recipient
        recipient = random.choice(self.names)
        draw.text((600, 320), f"{recipient}", fill=(50, 50, 50), font=body_font, anchor="mm")
        
        # Course info
        course = random.choice(self.courses)
        draw.text((600, 400), f"has successfully completed the {course} bootcamp", fill=(50, 50, 50), font=body_font, anchor="mm")
        
        # Completion details
        hours = random.randint(40, 200)
        date_str = (datetime.now() - timedelta(days=random.randint(1, 365))).strftime("%B %d, %Y")
        draw.text((600, 520), f"Completed on: {date_str} | Hours: {hours}", fill=(100, 100, 100), font=body_font, anchor="mm")
        
        return img

    def generate_batch(self, count: int = 1000, label: str = None) -> list:
        """Generate a batch of synthetic certificates
        
        Args:
            count: Number of certificates to generate
            label: Optional label for the batch (authentic/forged/tampered)
        """
        metadata_list = []
        
        for i in range(count):
            template_type = random.choice(list(self.templates.keys()))
            img = self.templates[template_type]()
            
            # Save image
            filename = f"{template_type}_{i:06d}.png"
            filepath = self.output_dir / filename
            img.save(filepath)
            
            # Create metadata
            metadata = {
                "filename": filename,
                "filepath": str(filepath),
                "template_type": template_type,
                "institution": random.choice(self.institutions),
                "recipient": random.choice(self.names),
                "course": random.choice(self.courses),
                "grade": random.choice(self.grades),
                "label": label or "authentic",
                "generated_at": datetime.now().isoformat(),
            }
            metadata_list.append(metadata)
            
            if (i + 1) % 100 == 0:
                print(f"Generated {i + 1}/{count} synthetic certificates...")
        
        # Save metadata
        metadata_file = self.output_dir / f"metadata_{label or 'batch'}.json"
        with open(metadata_file, 'w') as f:
            json.dump(metadata_list, f, indent=2)
        
        print(f"\n✓ Generated {count} synthetic certificates")
        print(f"✓ Saved to: {self.output_dir}")
        print(f"✓ Metadata saved to: {metadata_file}")
        
        return metadata_list

def main():
    """Main function to generate training dataset"""
    print("Generating Synthetic Certificate Dataset...\n")
    
    generator = SyntheticCertificateGenerator()
    
    # Generate authentic certificates
    print("Phase 1: Generating authentic certificates...")
    generator.generate_batch(count=800, label="authentic")
    
    print("\nPhase 2: Generating forged certificates...")
    generator.generate_batch(count=200, label="forged")
    
    print("\n" + "="*60)
    print("Dataset generation complete!")
    print("="*60)

if __name__ == "__main__":
    main()
