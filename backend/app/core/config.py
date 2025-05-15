from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Digital Shepherd"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here"  # In production, use proper secret management
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/digitalshepherd"
    
    # Security settings
    ALGORITHM: str = "HS256"
    ALLOWED_HOSTS: list = ["localhost", "127.0.0.1"]
    
    class Config:
        case_sensitive = True


settings = Settings() 