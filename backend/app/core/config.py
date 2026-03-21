"""
Application configuration using Pydantic Settings.
Loads configuration from environment variables and .env file.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Supabase configuration
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_KEY: str

    # CORS configuration
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Application metadata
    APP_NAME: str = "Blob API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    class Config:
        """Pydantic config."""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()
