import numpy as np
from sklearn.ensemble import IsolationForest
from typing import List, Dict, Any
import pandas as pd
from datetime import datetime, timezone
import json


class AnomalyDetector:
    def __init__(self, contamination: float = 0.1):
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100
        )
        self.feature_columns = [
            'hour_of_day',
            'day_of_week',
            'login_frequency',
            'location_change',
            'browser_change'
        ]

    def _preprocess_data(self, activities: List[Dict[str, Any]]) -> pd.DataFrame:
        """Preprocess user activities into features for anomaly detection."""
        records = []
        
        for activity in activities:
            timestamp = activity['timestamp']
            if isinstance(timestamp, str):
                timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            
            record = {
                'hour_of_day': timestamp.hour,
                'day_of_week': timestamp.weekday(),
                'login_frequency': activity.get('login_count', 0),
                'location_change': 1 if activity.get('location_changed', False) else 0,
                'browser_change': 1 if activity.get('browser_changed', False) else 0
            }
            records.append(record)
        
        return pd.DataFrame(records)

    def train(self, historical_data: List[Dict[str, Any]]):
        """Train the anomaly detection model on historical data."""
        if not historical_data:
            raise ValueError("No historical data provided for training")
        
        df = self._preprocess_data(historical_data)
        self.model.fit(df[self.feature_columns])

    def detect_anomalies(self, activities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Detect anomalies in user activities."""
        df = self._preprocess_data(activities)
        
        # Get anomaly scores (-1 for anomalies, 1 for normal)
        scores = self.model.score_samples(df[self.feature_columns])
        
        # Convert scores to probability-like values between 0 and 1
        normalized_scores = (scores - scores.min()) / (scores.max() - scores.min())
        
        results = []
        for idx, activity in enumerate(activities):
            anomaly_score = 1 - normalized_scores[idx]  # Invert so higher score = more anomalous
            
            result = {
                "timestamp": activity["timestamp"].isoformat() if isinstance(activity["timestamp"], datetime) else activity["timestamp"],
                "anomaly_score": float(anomaly_score),
                "is_anomaly": bool(anomaly_score > 0.8),  # Threshold for anomaly detection
                "features": {
                    "hour_of_day": int(df.iloc[idx]["hour_of_day"]),
                    "day_of_week": int(df.iloc[idx]["day_of_week"]),
                    "login_frequency": int(df.iloc[idx]["login_frequency"]),
                    "location_change": bool(df.iloc[idx]["location_change"]),
                    "browser_change": bool(df.iloc[idx]["browser_change"])
                }
            }
            results.append(result)
        
        return results


# Example usage with mock data
def generate_mock_data(n_samples: int = 100) -> List[Dict[str, Any]]:
    """Generate mock user activity data for testing."""
    np.random.seed(42)
    
    activities = []
    for _ in range(n_samples):
        timestamp = datetime.now(timezone.utc)
        activity = {
            "timestamp": timestamp,
            "login_count": np.random.randint(1, 10),
            "location_changed": np.random.choice([True, False], p=[0.1, 0.9]),
            "browser_changed": np.random.choice([True, False], p=[0.05, 0.95]),
        }
        activities.append(activity)
    
    return activities 