from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.api.v1.predict import router as predict_router
from app.services.loader import get_model_loader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Modular FastAPI backend for Heart Disease Prediction",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing application...")
    # Initialize the Singleton loader to load models into memory
    try:
        get_model_loader()
    except Exception as e:
        logger.error(f"Failed to load models at startup: {e}")
        # Not stopping the app here, it will fail gracefully when predicting or can be configured to halt

# Include routers
app.include_router(predict_router, prefix=settings.API_V1_STR, tags=["Prediction"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Heart Disease Prediction API. Use /docs for documentation.",
        "status": "Running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
