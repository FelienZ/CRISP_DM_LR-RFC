import joblib
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class ModelLoader:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance._load_models()
        return cls._instance
        
    def _load_models(self):
        try:
            logger.info("Loading ML models and preprocessors...")
            
            lr_path = settings.LR_MODEL_PATH
            rf_path = settings.RF_MODEL_PATH
            
            # Add fallback support for colab model naming format if strictly named best_lr_model.pkl
            if not lr_path.exists() and (settings.MODELS_DIR / "best_lr_model.pkl").exists():
                lr_path = settings.MODELS_DIR / "best_lr_model.pkl"
            if not rf_path.exists() and (settings.MODELS_DIR / "best_rf_model.pkl").exists():
                rf_path = settings.MODELS_DIR / "best_rf_model.pkl"
            
            self.models = {
                "lr": joblib.load(lr_path),
                "rf": joblib.load(rf_path)
            }
            self.scaler = joblib.load(settings.SCALER_PATH)
            self.label_encoders = joblib.load(settings.LABEL_ENCODERS_PATH)
            self.expected_features = joblib.load(settings.EXPECTED_FEATURES_PATH)
            self.num_cols = joblib.load(settings.NUM_COLS_PATH)
            
            logger.info("ML models loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            raise RuntimeError(f"Could not load ML artifacts from {settings.MODELS_DIR}: {e}")

# Global instance reference
model_loader = None

def get_model_loader() -> ModelLoader:
    global model_loader
    if model_loader is None:
        model_loader = ModelLoader()
    return model_loader
