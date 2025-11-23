"""
Skill Extractor - Use Case 2
Extracts skills from certificate text using Coursera dataset and semantic similarity
NO TRAINING REQUIRED - uses pre-trained sentence embeddings!
"""

import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer, util
from typing import List, Dict
from pathlib import Path
import pickle
import os

class SkillExtractor:
    def __init__(self, skills_csv_path: str = None):
        """
        Initialize skill extractor with pre-trained embedding model.
        
        Args:
            skills_csv_path: Path to Coursera dataset CSV (optional)
        """
        print("🔄 Loading pre-trained sentence embedding model...")
        # Pre-trained model from Hugging Face (NO TRAINING NEEDED!)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Model loaded!")
        
        # Load or create skill database
        self.skills = []
        self.skill_embeddings = None
        
        if skills_csv_path and Path(skills_csv_path).exists():
            self._load_skills_from_csv(skills_csv_path)
        else:
            # Use default skill list if no dataset available
            self._load_default_skills()
    
    def _load_skills_from_csv(self, csv_path: str):
        """Load skills from Coursera/Udemy dataset"""
        print(f"📂 Loading skills from: {csv_path}")
        
        try:
            df = pd.read_csv(csv_path)
            
            # Try common column names
            skill_columns = ['course_skills', 'skills', 'course_name', 'title']
            skills_found = False
            
            for col in skill_columns:
                if col in df.columns:
                    print(f"✅ Found skill column: {col}")
                    # Extract and clean skills
                    if 'skill' in col.lower():
                        # Skills are comma-separated
                        skills_series = df[col].dropna().str.split(',')
                        self.skills = list(set([
                            skill.strip() 
                            for skills_list in skills_series 
                            for skill in skills_list 
                            if skill.strip()
                        ]))
                    else:
                        # Course names
                        self.skills = df[col].dropna().unique().tolist()
                    
                    skills_found = True
                    break
            
            if not skills_found:
                print("⚠️  No skill column found, using course names")
                self.skills = df.iloc[:, 0].dropna().unique().tolist()
            
            # Clean skills
            self.skills = [s for s in self.skills if len(s) > 3 and len(s) < 100]
            
            print(f"✅ Loaded {len(self.skills)} unique skills")
            
            # Encode skills (create embeddings)
            self._encode_skills()
            
        except Exception as e:
            print(f"❌ Error loading CSV: {e}")
            print("⚠️  Falling back to default skills")
            self._load_default_skills()
    
    def _load_default_skills(self):
        """Load a default set of common skills"""
        print("📚 Loading default skill taxonomy...")
        
        self.skills = [
            # Programming
            "Python Programming", "JavaScript", "Java", "C++", "C#", "Ruby", "Go",
            "TypeScript", "PHP", "Swift", "Kotlin", "Rust",
            
            # Web Development
            "HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Django",
            "Flask", "Spring Boot", "ASP.NET", "Laravel", "Express.js",
            
            # Data Science & AI
            "Machine Learning", "Deep Learning", "Data Science", "Data Analysis",
            "Statistics", "Natural Language Processing", "Computer Vision",
            "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
            
            # Databases
            "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Oracle",
            "Database Design", "NoSQL", "Elasticsearch",
            
            # Cloud & DevOps
            "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
            "CI/CD", "Jenkins", "Git", "Linux", "DevOps",
            
            # Business & Management
            "Project Management", "Agile", "Scrum", "Leadership",
            "Business Analysis", "Strategic Planning", "Marketing",
            
            # Design
            "UI/UX Design", "Graphic Design", "Figma", "Adobe Photoshop",
            "Web Design", "User Research",
            
            # Blockchain
            "Blockchain", "Smart Contracts", "Ethereum", "Solidity",
            "Cryptography", "Web3", "NFT",
            
            # Cybersecurity
            "Cybersecurity", "Ethical Hacking", "Network Security",
            "Penetration Testing", "Information Security"
        ]
        
        print(f"✅ Loaded {len(self.skills)} default skills")
        self._encode_skills()
    
    def _encode_skills(self):
        """Create embeddings for all skills"""
        print("🔄 Creating skill embeddings...")
        self.skill_embeddings = self.model.encode(
            self.skills,
            convert_to_tensor=True,
            show_progress_bar=True
        )
        print("✅ Embeddings created!")
    
    def extract_skills(self, text: str, top_k: int = 10, min_similarity: float = 0.5) -> List[Dict]:
        """
        Extract skills from certificate text using semantic similarity.
        
        Args:
            text: Certificate text (from OCR or manual input)
            top_k: Maximum number of skills to return
            min_similarity: Minimum similarity score (0-1)
            
        Returns:
            List of dictionaries with skill and confidence score
        """
        if not self.skill_embeddings:
            print("❌ Skill embeddings not loaded!")
            return []
        
        print(f"\n🔍 Analyzing text: '{text[:100]}...'")
        
        # Encode the input text
        text_embedding = self.model.encode(text, convert_to_tensor=True)
        
        # Calculate similarity with all skills
        similarities = util.cos_sim(text_embedding, self.skill_embeddings)[0]
        
        # Get top matches
        top_indices = similarities.argsort(descending=True)[:top_k]
        
        # Filter by minimum similarity
        extracted_skills = []
        for idx in top_indices:
            similarity = float(similarities[idx])
            if similarity >= min_similarity:
                extracted_skills.append({
                    'skill': self.skills[idx],
                    'confidence': round(similarity, 3),
                    'match_quality': self._get_match_quality(similarity)
                })
        
        print(f"✅ Found {len(extracted_skills)} matching skills")
        return extracted_skills
    
    def _get_match_quality(self, similarity: float) -> str:
        """Convert similarity score to quality label"""
        if similarity >= 0.8:
            return "High"
        elif similarity >= 0.6:
            return "Medium"
        else:
            return "Low"
    
    def add_custom_skills(self, new_skills: List[str]):
        """
        Add custom skills to the database.
        
        Args:
            new_skills: List of skill names to add
        """
        print(f"➕ Adding {len(new_skills)} custom skills...")
        
        # Remove duplicates
        new_skills = [s for s in new_skills if s not in self.skills]
        
        if not new_skills:
            print("⚠️  All skills already exist")
            return
        
        # Add to skill list
        self.skills.extend(new_skills)
        
        # Re-encode all skills
        self._encode_skills()
        
        print(f"✅ Added {len(new_skills)} new skills")


# Standalone function for easy import
def extract_skills_from_certificate(text: str, dataset_path: str = None) -> List[Dict]:
    """
    Quick helper function to extract skills from certificate text.
    
    Args:
        text: Certificate text
        dataset_path: Optional path to Coursera CSV dataset
        
    Returns:
        List of extracted skills with confidence scores
    """
    extractor = SkillExtractor(skills_csv_path=dataset_path)
    return extractor.extract_skills(text)


# Test script
if __name__ == "__main__":
    import sys
    
    print("\n" + "="*60)
    print("🎯 Skill Extractor - Use Case 2")
    print("="*60 + "\n")
    
    # Example certificate texts
    test_certificates = [
        "Certificate of Completion: Python for Data Science and Machine Learning. This course covers NumPy, Pandas, Matplotlib, and Scikit-learn.",
        "Web Development Bootcamp - JavaScript, React, Node.js, MongoDB, and Express.js",
        "AWS Certified Solutions Architect - Cloud Computing, EC2, S3, Lambda, and DevOps",
        "Digital Marketing Certificate - SEO, Google Analytics, Social Media Marketing"
    ]
    
    # Allow user to provide their own text
    if len(sys.argv) > 1:
        text = ' '.join(sys.argv[1:])
        test_certificates = [text]
    
    # Initialize extractor
    extractor = SkillExtractor()
    
    # Process each certificate
    for i, cert_text in enumerate(test_certificates, 1):
        print(f"\n📜 Certificate {i}:")
        print(f"   Text: {cert_text[:80]}...")
        print("\n   Extracted Skills:")
        
        skills = extractor.extract_skills(cert_text, top_k=5, min_similarity=0.5)
        
        if skills:
            for j, skill in enumerate(skills, 1):
                quality_emoji = "🟢" if skill['match_quality'] == "High" else "🟡" if skill['match_quality'] == "Medium" else "🟠"
                print(f"   {j}. {quality_emoji} {skill['skill']}")
                print(f"      Confidence: {skill['confidence']:.1%} ({skill['match_quality']})")
        else:
            print("   ❌ No matching skills found")
        
        print()
    
    print("="*60)
    print("✅ Skill extraction complete!")
    print("="*60 + "\n")
    
    # Usage instructions
    print("💡 Usage:")
    print("  python skill_extractor.py 'Your certificate text here'")
    print("\n  To use Coursera dataset:")
    print("  1. Download: kaggle datasets download -d khusheekapoor/coursera-courses-dataset-2021")
    print("  2. Update skills_csv_path in SkillExtractor()")
