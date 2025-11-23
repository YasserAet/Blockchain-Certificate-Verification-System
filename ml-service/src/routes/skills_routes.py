Implement skill extraction using NER and skill taxonomy
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.services.skills_service import get_skills_service

router = APIRouter()

class SkillExtractionRequest(BaseModel):
    certificate_text: str
    certificate_type: str

@router.post("/extract")
async def extract_skills(request: SkillExtractionRequest):
    """
    Extract skills from certificate text using NER
    
    Returns structured skills with proficiency levels
    """
    try:
        if not request.certificate_text:
            raise HTTPException(status_code=400, detail="No certificate text provided")
        
        # Get skills service
        service = get_skills_service()
        
        # Extract skills
        extraction = service.extract_skills(request.certificate_text)
        
        if not extraction.get('success', False):
            extraction['skills'] = []
        
        # Separate hard and soft skills
        hard_skills = [s for s in extraction.get('skills', []) 
                       if s['skill'].lower() not in ['communication', 'leadership', 'teamwork', 'project management', 'problem solving']]
        soft_skills = [s for s in extraction.get('skills', []) 
                       if s['skill'].lower() in ['communication', 'leadership', 'teamwork', 'project management', 'problem solving']]
        
        result = {
            "skills": hard_skills,
            "soft_skills": soft_skills,
            "total_skills": extraction.get('total_skills', 0),
            "extraction_method": extraction.get('extraction_method', 'unknown'),
            "certificate_type": request.certificate_type,
            "model_version": "v2.0"
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill extraction failed: {str(e)}")

@router.get("/taxonomy")
async def get_skill_taxonomy():
    """Get available skill taxonomy"""
    try:
        service = get_skills_service()
        return {
            "taxonomy": service.skill_taxonomy,
            "total_skills": sum(len(v) for v in service.skill_taxonomy.values())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve taxonomy: {str(e)}")
