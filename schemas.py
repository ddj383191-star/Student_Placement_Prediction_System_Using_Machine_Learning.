"""Pydantic schemas with sensible ranges (spec section 4)."""
from pydantic import BaseModel, EmailStr, Field

OPT_FLOAT = lambda: Field(default=None)  # noqa: E731


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    full_name: str = Field(min_length=1, max_length=255)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str


class ProfileIn(BaseModel):
    tenth_pct: float | None = Field(default=None, ge=0, le=100)
    twelfth_pct: float | None = Field(default=None, ge=0, le=100)
    grad_pct: float | None = Field(default=None, ge=0, le=100)
    mca_cgpa: float | None = Field(default=None, ge=0, le=10)
    backlogs: int | None = Field(default=None, ge=0, le=20)
    attendance_pct: float | None = Field(default=None, ge=0, le=100)

    python_skill: int | None = Field(default=None, ge=1, le=10)
    java_skill: int | None = Field(default=None, ge=1, le=10)
    sql_skill: int | None = Field(default=None, ge=1, le=10)
    dsa_skill: int | None = Field(default=None, ge=1, le=10)
    webdev_skill: int | None = Field(default=None, ge=1, le=10)
    ds_skill: int | None = Field(default=None, ge=1, le=10)
    ml_skill: int | None = Field(default=None, ge=1, le=10)

    internships_count: int | None = Field(default=None, ge=0, le=10)
    internship_months: int | None = Field(default=None, ge=0, le=60)
    projects_count: int | None = Field(default=None, ge=0, le=20)
    major_project: int | None = Field(default=None, ge=0, le=1)
    certifications_count: int | None = Field(default=None, ge=0, le=20)

    aptitude_score: int | None = Field(default=None, ge=0, le=100)
    coding_score: int | None = Field(default=None, ge=0, le=100)
    communication_score: int | None = Field(default=None, ge=0, le=100)
    interview_prep_score: int | None = Field(default=None, ge=0, le=100)

    resume_available: int | None = Field(default=None, ge=0, le=1)
    github_available: int | None = Field(default=None, ge=0, le=1)
    training_attended: int | None = Field(default=None, ge=0, le=1)

    ug_stream: str | None = Field(default=None, max_length=50)
    specialization: str | None = Field(default=None, max_length=50)


class InternshipIn(BaseModel):
    title: str = Field(max_length=255)
    company: str = Field(default="", max_length=255)
    months: int = Field(ge=0, le=60)


class ProjectIn(BaseModel):
    title: str = Field(max_length=255)
    description: str = Field(default="", max_length=1000)
    url: str = Field(default="", max_length=500)


class WhatIfRequest(BaseModel):
    overrides: ProfileIn  # only non-null fields override current profile
