from sklearn.ensemble import IsolationForest
import numpy as np
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import json

class FatigueMonitor:
    def __init__(self, contamination: float = 0.1):
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100
        )
        self.baseline_wpm = None
        self.baseline_click_rate = None
        self.features = [
            'typing_speed_ratio',  # Ratio to baseline WPM
            'click_rate_ratio',    # Ratio to baseline clicks/min
            'error_rate',          # Backspaces and corrections
            'session_duration',    # Minutes in current session
            'inactivity_periods'   # Number of long pauses
        ]
        
    def train_baseline(self, historical_data: List[Dict]):
        """Establish baseline metrics from historical data."""
        if not historical_data:
            return
            
        typing_speeds = [d['typing_speed'] for d in historical_data if 'typing_speed' in d]
        click_rates = [d['click_rate'] for d in historical_data if 'click_rate' in d]
        
        if typing_speeds:
            self.baseline_wpm = np.mean(typing_speeds)
        if click_rates:
            self.baseline_click_rate = np.mean(click_rates)
            
        # Train the anomaly detection model
        features = self._extract_features(historical_data)
        if features.size > 0:
            self.model.fit(features)

    def _extract_features(self, data: List[Dict]) -> np.ndarray:
        """Extract relevant features from interaction data."""
        features_list = []
        
        for entry in data:
            if not all(k in entry for k in ['typing_speed', 'click_rate', 'error_rate', 'session_duration', 'inactivity_periods']):
                continue
                
            feature_vector = [
                entry['typing_speed'] / self.baseline_wpm if self.baseline_wpm else 1.0,
                entry['click_rate'] / self.baseline_click_rate if self.baseline_click_rate else 1.0,
                entry['error_rate'],
                min(entry['session_duration'] / 480, 1.0),  # Normalize to 8-hour max
                entry['inactivity_periods']
            ]
            features_list.append(feature_vector)
            
        return np.array(features_list)

    def detect_fatigue(self, current_data: Dict) -> Dict:
        """Analyze current user interaction data for fatigue indicators."""
        if not all(k in current_data for k in ['typing_speed', 'click_rate', 'error_rate', 'session_duration', 'inactivity_periods']):
            raise ValueError("Missing required metrics in current_data")

        # Extract features
        features = self._extract_features([current_data])
        if features.size == 0:
            raise ValueError("Could not extract features from current_data")

        # Get anomaly score
        score = self.model.score_samples(features)[0]
        normalized_score = 1 - (score - self.model.offset_) / np.abs(self.model.offset_)
        
        # Analyze specific indicators
        indicators = {
            "typing_speed_decline": current_data['typing_speed'] < 0.7 * self.baseline_wpm if self.baseline_wpm else False,
            "high_error_rate": current_data['error_rate'] > 0.1,
            "increased_inactivity": current_data['inactivity_periods'] > 5,
            "extended_session": current_data['session_duration'] > 240  # 4 hours
        }
        
        # Calculate fatigue probability and determine if break is needed
        fatigue_probability = normalized_score
        needs_break = (
            fatigue_probability > 0.7 or
            sum(indicators.values()) >= 2 or
            current_data['session_duration'] > 240
        )
        
        return {
            "timestamp": datetime.now().isoformat(),
            "fatigue_score": float(fatigue_probability),
            "needs_break": needs_break,
            "indicators": indicators,
            "recommendations": self._generate_recommendations(indicators, current_data)
        }
    
    def _generate_recommendations(self, indicators: Dict[str, bool], current_data: Dict) -> List[str]:
        """Generate specific recommendations based on fatigue indicators."""
        recommendations = []
        
        if indicators["typing_speed_decline"]:
            recommendations.append("Your typing speed has decreased significantly. Consider taking a short break.")
            
        if indicators["high_error_rate"]:
            recommendations.append("You're making more mistakes than usual. This might be a sign of fatigue.")
            
        if indicators["increased_inactivity"]:
            recommendations.append("You're taking longer pauses between actions. A brief walk might help refresh your focus.")
            
        if indicators["extended_session"]:
            recommendations.append("You've been working for over 4 hours. Consider taking a 15-minute break.")
            
        if current_data['session_duration'] > 360:  # 6 hours
            recommendations.append("You've been working for over 6 hours. Consider ending your session soon.")
            
        return recommendations 