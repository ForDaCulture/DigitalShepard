from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from ....modules.threat_detection.anomaly_detector import AnomalyDetector, generate_mock_data
from ....models.user_activity import UserActivity
from sqlalchemy.orm import Session
from ....database import get_db
from datetime import datetime, timedelta

router = APIRouter()
anomaly_detector = AnomalyDetector()

# Initialize with mock data
mock_data = generate_mock_data(100)
anomaly_detector.train(mock_data)


@router.post("/analyze", response_model=List[Dict[str, Any]])
async def analyze_user_activity(
    activities: List[Dict[str, Any]],
    db: Session = Depends(get_db)
):
    """
    Analyze user activities for potential threats.
    """
    try:
        # Detect anomalies
        results = anomaly_detector.detect_anomalies(activities)
        
        # Store results in database
        for result in results:
            if result["is_anomaly"]:
                activity = UserActivity(
                    user_id=activities[0].get("user_id"),  # Assuming all activities are from same user
                    timestamp=datetime.fromisoformat(result["timestamp"]),
                    anomaly_score=result["anomaly_score"],
                    additional_data=result
                )
                db.add(activity)
        
        db.commit()
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recent-anomalies/{user_id}")
async def get_recent_anomalies(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get recent anomalies for a specific user.
    """
    cutoff_date = datetime.utcnow() - timedelta(days=7)
    anomalies = db.query(UserActivity).filter(
        UserActivity.user_id == user_id,
        UserActivity.timestamp >= cutoff_date,
        UserActivity.anomaly_score > 0.8
    ).all()
    
    return [
        {
            "timestamp": anomaly.timestamp,
            "anomaly_score": anomaly.anomaly_score,
            "details": anomaly.additional_data
        }
        for anomaly in anomalies
    ] 