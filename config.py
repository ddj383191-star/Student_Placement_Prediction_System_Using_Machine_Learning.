from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./placement.db"
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 60
    cors_origins: list[str] = ["http://localhost:5173"]
    model_path: str = "../ml/models/best_model.joblib"
    preprocess_path: str = "../ml/models/preprocess.joblib"
    metrics_path: str = "../ml/models/metrics.json"

    class Config:
        env_file = ".env"


settings = Settings()
