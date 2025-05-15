from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Dict, List
from ....modules.threat_detection.anomaly_detector import AnomalyDetector
from sqlalchemy.orm import Session
from ....database import get_db
from datetime import datetime
from pydantic import BaseModel
from ....middleware.rate_limiter import limiter

router = APIRouter()
anomaly_detector = AnomalyDetector()

@router.post("/analyze")
@limiter.limit("5/minute")
async def analyze_behavior(request: Request, data: Dict):
    """
    Analyze user behavior for anomalies.
    Rate limited to 5 requests per minute per IP address.
    """
    try:
        result = anomaly_detector.detect_anomalies([data])
        return result[0] if result else {"error": "No analysis results"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent-anomalies/{user_id}")
@limiter.limit("30/minute")
async def get_recent_anomalies(
    request: Request,
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get recent anomalies for a user.
    Rate limited to 30 requests per minute per IP address.
    """
    try:
        # Get last 10 anomalies for the user
        anomalies = anomaly_detector.get_recent_anomalies(user_id, limit=10)
        return anomalies
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 