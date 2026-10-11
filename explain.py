"""Rule-based strengths / weaknesses / recommendations from actual profile values.

Honest framing: these describe how inputs compare to thresholds and global
model importance — they do NOT prove causation.
"""


def skill_label(v) -> str:
    if v is None:
        return "Not set"
    if v >= 8:
        return "Excellent"
    if v >= 6:
        return "Good"
    if v >= 4:
        return "Intermediate"
    return "Basic"


def analyze(profile: dict, top_features: list | None = None) -> dict:
    g = lambda k, d=None: profile.get(k, d)  # noqa: E731
    strengths, weaknesses, recs = [], [], []

    # Academic
    if (g("mca_cgpa") or 0) >= 8:
        strengths.append("High MCA CGPA")
    elif g("mca_cgpa") is not None and g("mca_cgpa") < 6.5:
        weaknesses.append("Low MCA CGPA")
        recs.append("Prioritize backlog clearance and consistent semester scores — CGPA is a top model signal.")
    if (g("backlogs") or 0) == 0:
        strengths.append("No active backlogs")
    elif (g("backlogs") or 0) >= 2:
        weaknesses.append(f"{g('backlogs')} backlogs")
        recs.append("Clear backlogs first — recruiters filter on this before skills.")
    if (g("attendance_pct") or 0) >= 85:
        strengths.append("Strong attendance")

    # Technical
    for key, name, tip in [
        ("dsa_skill", "DSA", "Practice DSA daily (arrays → DP); target 200+ problems."),
        ("python_skill", "Python", "Build 2 Python mini-projects and push to GitHub."),
        ("sql_skill", "SQL", "Complete SQL interview exercises: joins, window functions."),
        ("coding_score", None, None),
        ("ml_skill", "Machine Learning", "Build one end-to-end ML project with evaluation."),
        ("ds_skill", "Data Science", "Complete a data-analysis portfolio project."),
        ("webdev_skill", "Web development", "Ship one full-stack project with deployment."),
        ("java_skill", "Java", "Strengthen Java OOP + collections for interviews."),
    ]:
        v = g(key)
        if key.endswith("_skill"):
            if v is not None and v >= 7:
                strengths.append(f"Strong {name}")
            elif v is not None and v <= 4:
                weaknesses.append(f"Low {name} skill ({skill_label(v)})")
                recs.append(tip)
        elif key == "coding_score":
            if v is not None and v >= 75:
                strengths.append("Strong coding score")
            elif v is not None and v < 50:
                weaknesses.append("Low coding score")
                recs.append("Do timed coding practice 4x/week and track accuracy.")

    # Career
    if (g("internships_count") or 0) >= 1:
        strengths.append("Internship experience")
    else:
        weaknesses.append("No internship")
        recs.append("Apply for internships / freelance / open-source to gain experience.")
    if (g("projects_count") or 0) >= 3:
        strengths.append("Good project portfolio")
    elif (g("projects_count") or 0) <= 1:
        weaknesses.append("Few projects")
        recs.append("Build 2–3 deployable projects with README + demo links.")
    if g("major_project") == 1:
        strengths.append("Major project completed")
    if (g("certifications_count") or 0) >= 2:
        strengths.append("Relevant certifications")
    elif (g("certifications_count") or 0) == 0:
        weaknesses.append("No certifications")
        recs.append("Earn 1–2 recognized certifications aligned to your target role.")

    # Assessment
    if (g("aptitude_score") or 0) >= 75:
        strengths.append("Strong aptitude")
    elif g("aptitude_score") is not None and g("aptitude_score") < 50:
        weaknesses.append("Low aptitude score")
        recs.append("Practice aptitude sets (quant + logical) 30 min/day.")
    if (g("communication_score") or 0) >= 75:
        strengths.append("Strong communication")
    elif g("communication_score") is not None and g("communication_score") < 55:
        weaknesses.append("Low communication score")
        recs.append("Practice mock interviews and group discussions weekly.")
    if (g("interview_prep_score") or 0) >= 70:
        strengths.append("Good interview preparation")
    elif g("interview_prep_score") is not None and g("interview_prep_score") < 45:
        weaknesses.append("Weak interview preparation")
        recs.append("Run mock interviews; prepare HR + project deep-dives.")
    if g("resume_available") == 1:
        strengths.append("Resume ready")
    else:
        weaknesses.append("Resume missing")
        recs.append("Create a one-page resume with metrics + project links.")
    if g("github_available") == 1:
        strengths.append("GitHub/portfolio available")
    else:
        weaknesses.append("No GitHub/portfolio")
        recs.append("Publish code on GitHub with clean READMEs.")
    if g("training_attended") != 1:
        recs.append("Attend placement training for resume + interview readiness.")

    # Skill-gap section (dedicated)
    skill_keys = [("python_skill", "Python"), ("sql_skill", "SQL"),
                  ("dsa_skill", "DSA"), ("ml_skill", "Machine Learning"),
                  ("ds_skill", "Data Science"), ("webdev_skill", "Web Development"),
                  ("java_skill", "Java")]
    current_skills = [{"skill": n, "value": g(k), "level": skill_label(g(k))}
                      for k, n in skill_keys]
    current_skills.append({"skill": "Communication",
                           "value": g("communication_score"),
                           "level": skill_label(
                               round((g("communication_score") or 0) / 10) if g("communication_score") is not None else None)})
    gaps = [s["skill"] for s in current_skills
            if s["value"] is None or (s["skill"] == "Communication"
                                      and (g("communication_score") or 100) < 60)
            or (s["skill"] != "Communication" and (s["value"] or 0) < 6)]

    # Deduplicate, keep order
    strengths = list(dict.fromkeys(strengths))[:8]
    weaknesses = list(dict.fromkeys(weaknesses))[:8]
    recs = list(dict.fromkeys(recs))[:8]
    if not recs:
        recs.append("Strong overall — stretch further with advanced DSA, system design, "
                    "and mentoring peers to deepen mastery.")

    factors = []
    if top_features:
        names = [t["feature"] if isinstance(t, dict) else t for t in top_features[:6]]
        factors = [f"Model weighs '{n}' highly (association, not causation)" for n in names]

    return {"strengths": strengths, "weaknesses": weaknesses,
            "recommendations": recs, "current_skills": current_skills,
            "gaps": gaps, "top_factors": factors}
