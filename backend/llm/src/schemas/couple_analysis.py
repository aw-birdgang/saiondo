from pydantic import BaseModel


class CoupleAnalysisRequest(BaseModel):
    prompt: str


class CoupleAnalysisResponse(BaseModel):
    response: str
