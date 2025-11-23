Implement skill extraction using BERT NER and skill taxonomy matching
"""
Skills Extraction Service - Extract skills from certificate text
Uses BERT-based NER model with skill taxonomy matching
"""

from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
import numpy as np

class SkillsService:
    def __init__(self):
        self.device = 0 if __import__('torch').cuda.is_available() else -1
        
        # Initialize NER pipeline
        try:
            self.ner_pipeline = pipeline(
                "ner",
                model="dslim/distilbert-NER",
                device=self.device
            )
            print("[Skills] NER pipeline loaded")
        except Exception as e:
            print(f"[Skills] Error loading NER pipeline: {e}")
            self.ner_pipeline = None
        
        # Skill taxonomy (O*NET + common certifications)
        self.skill_taxonomy = {
            "programming": ["python", "javascript", "java", "c++", "sql", "r", "rust", "golang", "typescript"],
            "data_science": ["machine learning", "deep learning", "data analysis", "statistics", "tensorflow", "pytorch", "scikit-learn"],
            "web": ["html", "css", "react", "angular", "vue", "node.js", "express", "django", "flask"],
            "cloud": ["aws", "azure", "gcp", "kubernetes", "docker", "terraform", "devops"],
            "soft_skills": ["communication", "leadership", "teamwork", "project management", "problem solving"]
        }
    
    def extract_skills(self, text: str) -> dict:
        """Extract skills from certificate text
        
        Args:
            text: Extracted certificate text
        
        Returns:
            dict with extracted skills and proficiency levels
        """
        if self.ner_pipeline is None:
            return self._extract_skills_heuristic(text)
        
        try:
            # Run NER
            entities = self.ner_pipeline(text[:512])  # Limit to 512 chars
            
            # Extract entities
            extracted_entities = [entity['word'] for entity in entities]
            
            # Match against skill taxonomy
            matched_skills = self._match_skills(extracted_entities + text.lower().split())
            
            # Determine proficiency levels
            proficiency_map = self._determine_proficiency(text)
            
            skills_with_proficiency = [
                {
                    "skill": skill,
                    "proficiency": proficiency_map.get(skill.lower(), "intermediate"),
                    "confidence": 0.85
                }
                for skill in matched_skills
            ]
            
            return {
                "skills": skills_with_proficiency,
                "total_skills": len(skills_with_proficiency),
                "extraction_method": "ner_pipeline",
                "success": True
            }
        except Exception as e:
            print(f"[Skills] Error in NER extraction: {e}")
            return self._extract_skills_heuristic(text)
    
    def _extract_skills_heuristic(self, text: str) -> dict:
        """Fallback heuristic-based skill extraction"""
        text_lower = text.lower()
        found_skills = []
        
        for category, skills in self.skill_taxonomy.items():
            for skill in skills:
                if skill in text_lower:
                    found_skills.append({
                        "skill": skill.title(),
                        "proficiency": self._determine_proficiency_heuristic(text_lower, skill),
                        "confidence": 0.75
                    })
        
        return {
            "skills": found_skills,
            "total_skills": len(found_skills),
            "extraction_method": "heuristic",
            "success": len(found_skills) > 0
        }
    
    def _match_skills(self, words: list) -> list:
        """Match extracted words against skill taxonomy"""
        matched = set()
        words_lower = [w.lower() for w in words]
        
        for category, skills in self.skill_taxonomy.items():
            for skill in skills:
                for word in words_lower:
                    if skill in word or word in skill:
                        matched.add(skill.title())
        
        return list(matched)
    
    def _determine_proficiency(self, text: str) -> dict:
        """Determine proficiency levels for extracted skills"""
        text_lower = text.lower()
        proficiency_map = {}
        
        advanced_keywords = ["advanced", "expert", "mastery", "specialization", "honors"]
        intermediate_keywords = ["proficient", "skilled", "familiar", "competent"]
        beginner_keywords = ["introduction", "basic", "fundamentals", "beginner", "intro"]
        
        for category, skills in self.skill_taxonomy.items():
            for skill in skills:
                if skill in text_lower:
                    # Check for proficiency indicators
                    for keyword in advanced_keywords:
                        if keyword in text_lower and text_lower.find(keyword) < text_lower.find(skill) + 50:
                            proficiency_map[skill] = "advanced"
                            break
                    
                    if skill not in proficiency_map:
                        for keyword in intermediate_keywords:
                            if keyword in text_lower:
                                proficiency_map[skill] = "intermediate"
                                break
                    
                    if skill not in proficiency_map:
                        for keyword in beginner_keywords:
                            if keyword in text_lower:
                                proficiency_map[skill] = "beginner"
                                break
                    
                    if skill not in proficiency_map:
                        proficiency_map[skill] = "intermediate"
        
        return proficiency_map
    
    def _determine_proficiency_heuristic(self, text: str, skill: str) -> str:
        """Heuristic-based proficiency determination"""
        # Look for surrounding keywords
        skill_pos = text.find(skill)
        context = text[max(0, skill_pos - 50):min(len(text), skill_pos + 50)]
        
        if any(word in context for word in ["advanced", "expert", "honors", "specialization"]):
            return "advanced"
        elif any(word in context for word in ["proficient", "skilled", "strong"]):
            return "advanced"
        elif any(word in context for word in ["introduction", "basic", "fundamentals"]):
            return "beginner"
        else:
            return "intermediate"

# Singleton instance
_skills_service = None

def get_skills_service():
    global _skills_service
    if _skills_service is None:
        _skills_service = SkillsService()
    return _skills_service
