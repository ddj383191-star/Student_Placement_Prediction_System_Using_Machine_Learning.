"""Load the trained sklearn Pipeline once; predict from profile dicts."""
import json
import os
from pathlib import Path

import joblib
import pandas as pd

_here = Path(__file__).resolve()
_default_model = _here.parents[3] / "ml" / "models" / "best_model.joblib"
MODEL_PATH = Path(os.getenv("MODEL_PATH", str(_default_model)))
METRICS_PATH = Path(os.getenv("METRICS_PATH", str(MODEL_PATH.parent / "metrics.json")))

_pipe = None
_features: list[str] | None = None
_model_version = "unknown"


def _load():
    global _pipe, _features, _model_version
    if _pipe is None:
        if not MODEL_PATH.exists():
            raise RuntimeError(f"Model not found at {MODEL_PATH}. Run ml/train.py first.")
        _pipe = joblib.load(MODEL_PATH)
        metrics = json.loads(METRICS_PATH.read_text())
        _features = metrics["features"]
        _model_version = metrics.get("model_version", "unknown")
    return _pipe, _features, _model_version


def predict_proba(profile: dict) -> tuple[float, str]:
    """Return (probability of placed, model_version). Missing values imputed by pipeline."""
    pipe, features, version = _load()
    row = {f: profile.get(f) for f in features}
    proba = float(pipe.predict_proba(pd.DataFrame([row]))[0, 1])
    return round(proba * 100, 1), version


def get_metrics() -> dict:
    _load()
    return json.loads(METRICS_PATH.read_text())
