"""Seed demo users. Run: python -m backend.seed (from repo root) or python seed.py (from backend/)."""
from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models import StudentProfile, User

Base.metadata.create_all(bind=engine)
db = SessionLocal()

defaults = [
    ("admin@college.edu", "Admin123!", "admin", "Placement Admin"),
    ("student@college.edu", "Student123!", "student", "Demo Student"),
]
for email, pw, role, name in defaults:
    if not db.query(User).filter_by(email=email).first():
        u = User(email=email, password_hash=hash_password(pw), role=role,
                 full_name=name)
        db.add(u)
        db.flush()
        if role == "student":
            db.add(StudentProfile(
                user_id=u.id, tenth_pct=82, twelfth_pct=78, grad_pct=76,
                mca_cgpa=8.1, backlogs=0, attendance_pct=88,
                python_skill=7, java_skill=6, sql_skill=8, dsa_skill=5,
                webdev_skill=6, ds_skill=6, ml_skill=5,
                internships_count=1, internship_months=3, projects_count=3,
                major_project=1, certifications_count=2,
                aptitude_score=72, coding_score=74, communication_score=58,
                interview_prep_score=62, resume_available=1, github_available=1,
                training_attended=1, ug_stream="BCA", specialization="Data Science"))
        print(f"created {email} / {pw}")
    else:
        print(f"exists {email}")
db.commit()
