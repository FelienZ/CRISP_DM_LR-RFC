from fastapi import APIRouter, HTTPException
from app.schemas.heart import HeartDiseaseRequest, HeartDiseaseResponse
from app.services.engine import predict_risk

router = APIRouter()

@router.post("/predict", response_model=HeartDiseaseResponse)
def make_prediction(request: HeartDiseaseRequest):
    try:
        # Convert Pydantic model to dict
        input_data = request.model_dump()
        
        # Run inference
        result = predict_risk(input_data)
        
        return HeartDiseaseResponse(**result)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
