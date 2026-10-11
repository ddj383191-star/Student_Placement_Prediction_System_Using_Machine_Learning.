from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.api.student import PROFILE_FIELDS, to_dict
from app.core.database import get_db
from app.models import Prediction, StudentProfile, User
from app.schemas import ProfileIn, WhatIfRequest
from app.services import explain as ex
from app.services.ml_service import get_metrics, predict_proba

router = APIRouter(tags=["prediction"])
student = require_role("student", "admin")


def _profile_dict(user: User, db: Session) -> dict:
    p = db.query(StudentProfile).filter_by(user_id=user.id).first()
    if p is None:
        raise HTTPException(400, "Complete your profile first")
    return to_dict(p)


def _confidence(prob: float) -> str:
    if prob >= 80:
        return "High"
    if prob >= 60:
        return "Moderate"
    if prob >= 40:
        return "Low"
    return "Very low"


def _build_result(profile: dict) -> dict:
    prob, version = predict_proba(profile)
    metrics = get_metrics()
    info = ex.analyze(profile, metrics.get("top_features"))
    label = "Likely Placed" if prob >= 50 else "Needs Improvement"
    return {
        "prediction": label,
        "probability": prob,
        "confidence": _confidence(prob),
        "model_version": version,
        **info,
        "disclaimer": "ML-based estimate from demo (synthetic) data — not a guarantee.",
    }


@router.post("/predict")
def predict(overrides: ProfileIn | None = None, user: User = Depends(student),
            db: Session = Depends(get_db)):
    profile = _profile_dict(user, db)
    if overrides:
        for k, v in overrides.model_dump().items():
            if v is not None:
                profile[k] = v
    if all(profile.get(f) is None for f in
           ("mca_cgpa", "coding_score", "aptitude_score", "communication_score")):
        raise HTTPException(400, "Enter at least CGPA and assessment scores first")
    try:
        result = _build_result(profile)
    except RuntimeError as e:
        raise HTTPException(500, str(e))
    db.add(Prediction(user_id=user.id, input_snapshot=profile,
                      prediction=result["prediction"],
                      probability=result["probability"],
                      model_version=result["model_version"]))
    db.commit()
    return result


@router.post("/what-if")
def what_if(body: WhatIfRequest, user: User = Depends(student),
            db: Session = Depends(get_db)):
    """Simulation only — not stored. Compare current vs overridden profile."""
    current = _profile_dict(user, db)
    base = _build_result(current)
    sim = dict(current)
    for k, v in body.overrides.model_dump().items():
        if v is not None:
            sim[k] = v
    alt = _build_result(sim)
    return {
        "current_probability": base["probability"],
        "current_prediction": base["prediction"],
        "whatif_probability": alt["probability"],
        "whatif_prediction": alt["prediction"],
        "difference_pp": round(alt["probability"] - base["probability"], 1),
        "whatif_details": alt,
        "disclaimer": "Model simulation — changing inputs changes the estimate, "
                      "not a guaranteed real-world outcome.",
    }


@router.get("/predictions")
def history(user: User = Depends(student), db: Session = Depends(get_db)):
    rows = (db.query(Prediction).filter_by(user_id=user.id)
            .order_by(Prediction.created_at.desc()).limit(50).all())
    return [{"id": r.id, "created_at": r.created_at.isoformat(),
             "prediction": r.prediction, "probability": r.probability,
             "model_version": r.model_version, "input_snapshot": r.input_snapshot}
            for r in rows]


@router.get("/skill-gap")
def skill_gap(user: User = Depends(student), db: Session = Depends(get_db)):
    profile = _profile_dict(user, db)
    info = ex.analyze(profile, get_metrics().get("top_features"))
    return {"current_skills": info["current_skills"], "gaps": info["gaps"],
            "recommendations": info["recommendations"],
            "weaknesses": info["weaknesses"]}


@router.get("/recommendations")
def recommendations(user: User = Depends(student), db: Session = Depends(get_db)):
    profile = _profile_dict(user, db)
    info = ex.analyze(profile, get_metrics().get("top_features"))
    return {"recommendations": info["recommendations"],
            "strengths": info["strengths"], "weaknesses": info["weaknesses"]}
