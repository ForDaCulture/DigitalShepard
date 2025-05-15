from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from ....modules.fatigue_detection.fatigue_monitor import FatigueMonitor
from sqlalchemy.orm import Session
from ....database import get_db
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()
fatigue_monitor = FatigueMonitor()

class UserInteractionData(BaseModel):
    user_id: int
    typing_speed: float
    click_rate: float
    error_rate: float
    session_duration: float  # in minutes
    inactivity_periods: int

class FatigueAnalysisResponse(BaseModel):
    timestamp: str
    fatigue_score: float
    needs_break: bool
    indicators: Dict[str, bool]
    recommendations: List[str]

@router.post("/analyze", response_model=FatigueAnalysisResponse)
async def analyze_fatigue(
    data: UserInteractionData,
    db: Session = Depends(get_db)
):
    """
    Analyze user interaction data for signs of fatigue.
    """
    try:
        # Convert Pydantic model to dict
        interaction_data = data.dict()
        
        # Analyze fatigue
        result = fatigue_monitor.detect_fatigue(interaction_data)
        
        # Store the analysis result if needed
        # TODO: Add database storage logic here
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/train-baseline/{user_id}")
async def train_user_baseline(
    user_id: int,
    historical_data: List[UserInteractionData],
    db: Session = Depends(get_db)
):
    """
    Train the fatigue detection model with user's historical data.
    """
    try:
        # Convert Pydantic models to dicts
        data = [item.dict() for item in historical_data]
        
        # Train the model
        fatigue_monitor.train_baseline(data)
        
        return {"message": "Baseline training completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 