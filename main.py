from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import admin, auth, predict, student
from app.core.config import settings
from app.core.database import Base, engine

app = FastAPI(title="Student Placement Prediction System", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup (demo-friendly; use migrations in production).
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(student.router)
app.include_router(predict.router)
app.include_router(admin.router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "0.3.0"}


@app.get("/")
def root():
    return {"message": "Placement Prediction API — see /docs"}
