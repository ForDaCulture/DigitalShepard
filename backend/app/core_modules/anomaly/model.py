from pyod.models.iforest import IForest
import numpy as np
from typing import List, Dict
import joblib
from pathlib import Path

class AnomalyDetector:
    def __init__(self):
        self.model = IForest(
            n_estimators=100,
            max_samples='auto',
            contamination=0.1,
            random_state=42
        )
        self._is_trained = False
        self.model_path = Path(__file__).parent / "iforest_model.joblib"
        self._load_or_train_model()

    def _generate_mock_data(self) -> np.ndarray:
        """Generate mock training data for initial model training."""
        n_samples = 1000
        rng = np.random.RandomState(42)
        
        # Normal patterns
        login_times = rng.randint(6, 23, n_samples)  # Login hours between 6AM and 11PM
        typing_speeds = rng.normal(60, 15, n_samples)  # Average typing speed 60 WPM
        click_rates = rng.normal(100, 20, n_samples)  # Clicks per minute
        session_durations = rng.normal(45, 15, n_samples)  # Session duration in minutes
        
        return np.column_stack([login_times, typing_speeds, click_rates, session_durations])

    def _load_or_train_model(self):
        """Load existing model or train new one with mock data."""
        try:
            if self.model_path.exists():
                self.model = joblib.load(self.model_path)
                self._is_trained = True
            else:
                mock_data = self._generate_mock_data()
                self.model.fit(mock_data)
                joblib.dump(self.model, self.model_path)
                self._is_trained = True
        except Exception as e:
            print(f"Error in model loading/training: {str(e)}")
            # Initialize with default model if loading fails
            self.model = IForest(contamination=0.1, random_state=42)
            mock_data = self._generate_mock_data()
            self.model.fit(mock_data)
            self._is_trained = True

    def analyze(self, session_data: Dict) -> Dict:
        """Analyze a single session for anomalies."""
        features = np.array([[
            session_data['login_hour'],
            session_data['typing_speed'],
            session_data['click_rate'],
            session_data['session_duration']
        ]])
        
        try:
            # Get anomaly scores (higher scores indicate more anomalous)
            scores = self.model.decision_function(features)
            predictions = self.model.predict(features)
            
            # Convert score to 0-1 range for better interpretation
            # pyod scores are already normalized, but we'll ensure they're in 0-1
            normalized_score = 1 / (1 + np.exp(-scores[0]))
            
            return {
                'is_anomaly': bool(predictions[0]),  # Convert numpy bool to Python bool
                'label': 'suspicious' if predictions[0] == 1 else 'normal',
                'anomaly_score': float(normalized_score),
                'confidence': abs(float(normalized_score) - 0.5) * 2  # 0-1 range
            }
        except Exception as e:
            print(f"Error in anomaly analysis: {str(e)}")
            return {
                'is_anomaly': False,
                'label': 'error',
                'anomaly_score': 0.5,
                'confidence': 0.0,
                'error': str(e)
            } 