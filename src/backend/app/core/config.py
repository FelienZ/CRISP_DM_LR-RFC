import os
from pathlib import Path

# Base directory is src/backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Models directory
MODELS_DIR = BASE_DIR / "models"

class Settings:
    PROJECT_NAME: str = "Heart Disease Prediction API"
    API_V1_STR: str = "/api/v1"
    
    # Models directory mapping
    MODELS_DIR: Path = MODELS_DIR
    
    # Model files paths
    LR_MODEL_PATH: Path = MODELS_DIR / "best_lr.pkl"
    RF_MODEL_PATH: Path = MODELS_DIR / "best_rf.pkl"
    SCALER_PATH: Path = MODELS_DIR / "scaler.pkl"
    LABEL_ENCODERS_PATH: Path = MODELS_DIR / "label_encoders.pkl"
    EXPECTED_FEATURES_PATH: Path = MODELS_DIR / "expected_features.pkl"
    NUM_COLS_PATH: Path = MODELS_DIR / "num_cols.pkl"

settings = Settings()
