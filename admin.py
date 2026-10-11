from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.api.student import to_dict
from app.core.database import get_db
from app.models import Prediction, StudentProfile, User
from app.services.ml_service import get_metrics

router = APIRouter(prefix="/admin", tags=["admin"])
admin = require_role("admin")


@router.get("/statistics")
def statistics(user: User = Depends(admin), db: Session = Depends(get_db)):
    total = db.query(func.count(User.id)).filter_by(role="student").scalar() or 0
    avg_cgpa = db.query(func.avg(StudentProfile.mca_cgpa)).scalar()

    # Latest prediction per student
    latest = {}
    for p in db.query(Prediction).order_by(Prediction.created_at).all():
        latest[p.user_id] = p
    placed = sum(1 for p in latest.values() if p.prediction == "Likely Placed")
    avg_prob = (sum(p.probability for p in latest.values()) / len(latest)
                if latest else 0)

    # Distributions
    cgpa_rows = [r[0] for r in db.query(StudentProfile.mca_cgpa).all() if r[0]]
    intern_rows = [r[0] or 0 for r in db.query(StudentProfile.internships_count).all()]
    spec_rows = db.query(StudentProfile.specialization,
                         func.count(StudentProfile.id)).group_by(
                             StudentProfile.specialization).all()

    return {
        "total_students": total,
        "predicted_placed": placed,
        "predicted_not_placed": len(latest) - placed,
        "students_with_predictions": len(latest),
        "average_cgpa": round(avg_cgpa or 0, 2),
        "average_probability": round(avg_prob, 1),
        "cgpa_distribution": cgpa_rows,
        "internship_distribution": intern_rows,
        "specialization_distribution": [{"name": s or "Unknown", "count": c}
                                        for s, c in spec_rows],
    }


@router.get("/students")
def students(q: str = Query(default=""), user: User = Depends(admin),
             db: Session = Depends(get_db)):
    query = db.query(User).filter_by(role="student")
    if q:
        like = f"%{q}%"
        query = query.filter((User.full_name.like(like)) | (User.email.like(like)))
    out = []
    for u in query.limit(100).all():
        p = db.query(StudentProfile).filter_by(user_id=u.id).first()
        last = (db.query(Prediction).filter_by(user_id=u.id)
                .order_by(Prediction.created_at.desc()).first())
        out.append({
            "id": u.id, "full_name": u.full_name, "email": u.email,
            "profile": to_dict(p) if p else {},
            "latest_prediction": ({"prediction": last.prediction,
                                   "probability": last.probability,
                                   "created_at": last.created_at.isoformat()}
                                  if last else None),
        })
    return out


@router.get("/predictions")
def all_predictions(user: User = Depends(admin), db: Session = Depends(get_db)):
    rows = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(200).all()
    return [{"id": r.id, "user_id": r.user_id,
             "user_email": (db.get(User, r.user_id).email
                            if db.get(User, r.user_id) else ""),
             "created_at": r.created_at.isoformat(), "prediction": r.prediction,
             "probability": r.probability, "model_version": r.model_version}
            for r in rows]


@router.get("/model-performance")
def model_performance(user: User = Depends(admin)):
    return get_metrics()
