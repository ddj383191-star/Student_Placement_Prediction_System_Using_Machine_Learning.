"""Tables: users, student_profiles, internships, projects, predictions."""
from datetime import datetime
from sqlalchemy import (JSON, DateTime, Float, ForeignKey, Integer, String,
                        func)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="student")  # student|admin
    full_name: Mapped[str] = mapped_column(String(255), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    profile: Mapped["StudentProfile"] = relationship(back_populates="user",
                                                     cascade="all, delete-orphan",
                                                     uselist=False)
    predictions: Mapped[list["Prediction"]] = relationship(back_populates="user",
                                                           cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    tenth_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    twelfth_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    grad_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    mca_cgpa: Mapped[float | None] = mapped_column(Float, nullable=True)
    backlogs: Mapped[int | None] = mapped_column(Integer, nullable=True)
    attendance_pct: Mapped[float | None] = mapped_column(Float, nullable=True)

    python_skill: Mapped[int | None] = mapped_column(Integer, nullable=True)
    java_skill: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sql_skill: Mapped[int | None] = mapped_column(Integer, nullable=True)
    dsa_skill: Mapped[int | None] = mapped_column(Integer, nullable=True)
    webdev_skill: Mapped[int | None] = mapped_column(Integer, nullable=True)
    ds_skill: Mapped[int | None] = mapped_column(Integer, nullable=True)
    ml_skill: Mapped[int | None] = mapped_column(Integer, nullable=True)

    internships_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    internship_months: Mapped[int | None] = mapped_column(Integer, nullable=True)
    projects_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    major_project: Mapped[int | None] = mapped_column(Integer, nullable=True)
    certifications_count: Mapped[int | None] = mapped_column(Integer, nullable=True)

    aptitude_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    coding_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    communication_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    interview_prep_score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    resume_available: Mapped[int | None] = mapped_column(Integer, nullable=True)
    github_available: Mapped[int | None] = mapped_column(Integer, nullable=True)
    training_attended: Mapped[int | None] = mapped_column(Integer, nullable=True)

    ug_stream: Mapped[str | None] = mapped_column(String(50), nullable=True)
    specialization: Mapped[str | None] = mapped_column(String(50), nullable=True)

    user: Mapped[User] = relationship(back_populates="profile")


class Internship(Base):
    __tablename__ = "internships"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(255), default="")
    company: Mapped[str] = mapped_column(String(255), default="")
    months: Mapped[int] = mapped_column(Integer, default=0)


class Project(Base):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(255), default="")
    description: Mapped[str] = mapped_column(String(1000), default="")
    url: Mapped[str] = mapped_column(String(500), default="")


class Prediction(Base):
    __tablename__ = "predictions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    input_snapshot: Mapped[dict] = mapped_column(JSON)
    prediction: Mapped[str] = mapped_column(String(50))  # Likely Placed | Needs Improvement
    probability: Mapped[float] = mapped_column(Float)
    model_version: Mapped[str] = mapped_column(String(50), default="")

    user: Mapped[User] = relationship(back_populates="predictions")
