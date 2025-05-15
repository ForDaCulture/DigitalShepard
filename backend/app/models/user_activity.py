from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.sql import func
from ..database import Base


class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(String)
    location = Column(JSON)  # Stores geo-location data
    browser_fingerprint = Column(String)
    user_agent = Column(String)
    activity_type = Column(String)  # login, logout, action, etc.
    anomaly_score = Column(Float, nullable=True)
    additional_data = Column(JSON)  # For storing any additional behavioral data 