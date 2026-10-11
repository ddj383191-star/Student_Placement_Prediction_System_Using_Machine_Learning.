from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.core.database import get_db
from app.models import Internship, Project, StudentProfile, User
from app.schemas import InternshipIn, ProfileIn, ProjectIn

router = APIRouter(prefix="/student", tags=["student"])
student = require_role("student", "admin")

PROFILE_FIELDS = [c for c in StudentProfile.__table__.columns.keys() if c not in ("id", "user_id")]


def to_dict(p: StudentProfile) -> dict:
    return {f: getattr(p, f) for f in PROFILE_FIELDS}


@router.get("/profile")
def get_profile(user: User = Depends(student), db: Session = Depends(get_db)):
    p = db.query(StudentProfile).filter_by(user_id=user.id).first()
    if p is None:
        p = StudentProfile(user_id=user.id)
        db.add(p)
        db.commit()
        db.refresh(p)
    return {"full_name": user.full_name, "email": user.email, **to_dict(p)}


@router.put("/profile")
def update_profile(body: ProfileIn, user: User = Depends(student),
                   db: Session = Depends(get_db)):
    p = db.query(StudentProfile).filter_by(user_id=user.id).first()
    if p is None:
        p = StudentProfile(user_id=user.id)
        db.add(p)
    for f in PROFILE_FIELDS:
        v = getattr(body, f)
        if v is not None:
            setattr(p, f, v)
    # Keep counts in sync with detail tables when details exist
    db.flush()
    n_int = db.query(Internship).filter_by(user_id=user.id).count()
    if n_int:
        p.internships_count = n_int
        p.internship_months = sum(
            r.months for r in db.query(Internship).filter_by(user_id=user.id).all())
    n_proj = db.query(Project).filter_by(user_id=user.id).count()
    if n_proj:
        p.projects_count = n_proj
    db.commit()
    return to_dict(p)


@router.get("/internships")
def list_internships(user: User = Depends(student), db: Session = Depends(get_db)):
    return [{"id": r.id, "title": r.title, "company": r.company, "months": r.months}
            for r in db.query(Internship).filter_by(user_id=user.id).all()]


@router.post("/internships")
def add_internship(body: InternshipIn, user: User = Depends(student),
                   db: Session = Depends(get_db)):
    r = Internship(user_id=user.id, **body.model_dump())
    db.add(r)
    db.commit()
    return {"id": r.id}


@router.delete("/internships/{iid}")
def del_internship(iid: int, user: User = Depends(student),
                   db: Session = Depends(get_db)):
    r = db.query(Internship).filter_by(id=iid, user_id=user.id).first()
    if r:
        db.delete(r)
        db.commit()
    return {"ok": True}


@router.get("/projects")
def list_projects(user: User = Depends(student), db: Session = Depends(get_db)):
    return [{"id": r.id, "title": r.title, "description": r.description, "url": r.url}
            for r in db.query(Project).filter_by(user_id=user.id).all()]


@router.post("/projects")
def add_project(body: ProjectIn, user: User = Depends(student),
                db: Session = Depends(get_db)):
    r = Project(user_id=user.id, **body.model_dump())
    db.add(r)
    db.commit()
    return {"id": r.id}


@router.delete("/projects/{pid}")
def del_project(pid: int, user: User = Depends(student),
                db: Session = Depends(get_db)):
    r = db.query(Project).filter_by(id=pid, user_id=user.id).first()
    if r:
        db.delete(r)
        db.commit()
    return {"ok": True}
