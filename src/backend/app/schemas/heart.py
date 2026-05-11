from pydantic import BaseModel, Field
from typing import Literal

class HeartDiseaseRequest(BaseModel):
    Age: int = Field(..., ge=1, le=120, description="Patient's age")
    Gender: Literal['Male', 'Female'] = Field(..., description="Patient's gender")
    ChestPain: Literal['Typical', 'Atypical', 'Non-anginal', 'Asymptomatic'] = Field(...)
    RestingBP: int = Field(..., ge=50, le=250, description="Resting blood pressure")
    Cholesterol: int = Field(..., ge=0, le=600, description="Serum cholesterol")
    FastingBS: Literal[0, 1] = Field(..., description="Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)")
    MaxHR: int = Field(..., ge=50, le=250, description="Maximum heart rate achieved")
    ExerciseAngina: Literal['Yes', 'No'] = Field(..., description="Exercise-induced angina")
    Smoking: Literal['Yes', 'No'] = Field(..., description="Smoker status")
    BMI: float = Field(..., ge=10.0, le=60.0, description="Body Mass Index")
    FamilyHistory: Literal['Yes', 'No'] = Field(..., description="Family history of heart disease")
    StressLevel: int = Field(..., ge=1, le=10, description="Stress level (1-10)")
    PhysicalActivity: Literal['Rendah', 'Sedang', 'Tinggi'] = Field(...)
    
    model_type: Literal['lr', 'rf'] = Field('rf', description="Model to use for prediction (lr or rf)")

class HeartDiseaseResponse(BaseModel):
    status: str
    prediction: int
    risk_level: str
    probability: float
    model_used: str
