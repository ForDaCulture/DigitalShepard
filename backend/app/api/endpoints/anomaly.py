from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
from app.core_modules.anomaly.model import AnomalyDetector
from datetime import datetime, timedelta

router = APIRouter()
anomaly_detector = AnomalyDetector()

class SessionData(BaseModel):
    user_id: str
    device_id: str
    typing_speed: float
    click_rate: float
    session_duration: float
    timestamp: datetime

class AnomalyResponse(BaseModel):
    timestamp: str
    anomaly_score: float
    is_anomaly: bool
    features: Dict[str, any]

@router.post("/analyze", response_model=Dict)
async def analyze_session(session_data: SessionData):
    try:
        # Extract hour from timestamp for login time analysis
        login_hour = session_data.timestamp.hour
        
        analysis_result = anomaly_detector.analyze({
            'login_hour': login_hour,
            'typing_speed': session_data.typing_speed,
            'click_rate': session_data.click_rate,
            'session_duration': session_data.session_duration
        })
        
        return {
            **analysis_result,
            'user_id': session_data.user_id,
            'device_id': session_data.device_id,
            'timestamp': session_data.timestamp
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/v1/threat-detection/recent-anomalies/{user_id}", response_model=List[AnomalyResponse])
async def get_recent_anomalies(user_id: str):
    # Dummy data for demonstration
    now = datetime.now()
    return [
        {
            "timestamp": (now - timedelta(hours=i)).isoformat(),
            "anomaly_score": 0.85 if i % 2 == 0 else 0.45,
            "is_anomaly": i % 2 == 0,
            "features": {
                "hour_of_day": ((now - timedelta(hours=i)).hour),
                "day_of_week": ((now - timedelta(hours=i)).weekday()),
                "login_frequency": 5 if i % 2 == 0 else 2,
                "location_change": i % 3 == 0,
                "browser_change": i % 4 == 0
            }
        }
        for i in range(5)
    ] 