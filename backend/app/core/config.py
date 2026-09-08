"""
Application configuration module.
Loads all environment variables using pydantic-settings.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application settings loaded from environment variables / .env file."""

    # --- Application ---
    APP_NAME: str = "AI-Powered Healthcare Communication Assistant"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # --- Security ---
    SECRET_KEY: str
    REFRESH_SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # --- Database ---
    DATABASE_URL: str
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "healthcare_db"

    # --- File Upload ---
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_FILE_EXTENSIONS: str = ".pdf,.jpg,.jpeg,.png"

    # --- External Services ---
    OCR_SERVICE_URL: str = "http://ocr-service:9001/extract"
    NLP_SERVICE_URL: str = "http://nlp-service:9002/process"
    TRANSLATION_SERVICE_URL: str = "http://translation-service:9003/translate"
    TTS_SERVICE_URL: str = "http://voice-service:9004/tts"
    STT_SERVICE_URL: str = "http://voice-service:9004/stt"

    # --- CORS ---
    CORS_ORIGINS: str = "http://localhost:3000"

    # --- Rate Limiting ---
    RATE_LIMIT_PER_MINUTE: int = 60

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def allowed_extensions_list(self) -> List[str]:
        return [ext.strip().lower() for ext in self.ALLOWED_FILE_EXTENSIONS.split(",") if ext.strip()]


@lru_cache()
def get_settings() -> Settings:
    """Return a cached Settings instance (singleton pattern)."""
    return Settings()


settings = get_settings()
