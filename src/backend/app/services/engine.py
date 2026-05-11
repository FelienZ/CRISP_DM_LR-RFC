import pandas as pd
from typing import Dict, Any
from app.services.loader import get_model_loader

def predict_risk(input_data: Dict[str, Any]) -> dict:
    """
    Core inference logic supporting model switching.
    """
    loader = get_model_loader()
    
    # Extract model_type and remove from features since it's not a ML feature
    model_type = input_data.pop("model_type", "rf")
    if model_type not in loader.models:
        raise ValueError(f"Invalid model_type: {model_type}. Allowed: 'lr', 'rf'")
        
    model = loader.models[model_type]
    
    # Convert input to DataFrame
    df_input = pd.DataFrame([input_data])
    
    # 1. Label Encoding
    for col, le in loader.label_encoders.items():
        if col in df_input.columns:
            try:
                df_input[col] = le.transform(df_input[col].astype(str))
            except ValueError as e:
                # Basic fallback if a category wasn't seen in training
                raise ValueError(f"Unknown category in column {col}: {e}")
                
    # 2. One-Hot Encoding
    df_input = pd.get_dummies(df_input)
    
    # 3. Alignment
    df_input = df_input.reindex(columns=loader.expected_features, fill_value=0)
    
    # 4. Scaling
    present_num_cols = [c for c in loader.num_cols if c in df_input.columns]
    if present_num_cols:
        df_input[present_num_cols] = loader.scaler.transform(df_input[present_num_cols])
        
    # 5. Prediction
    prediction = int(model.predict(df_input)[0])
    
    if hasattr(model, "predict_proba"):
        probability = float(model.predict_proba(df_input)[0][1])
    else:
        probability = float(prediction)
        
    return {
        "status": "success",
        "prediction": prediction,
        "risk_level": "High Risk" if prediction == 1 else "Low Risk",
        "probability": round(probability, 4),
        "model_used": model_type.upper()
    }
