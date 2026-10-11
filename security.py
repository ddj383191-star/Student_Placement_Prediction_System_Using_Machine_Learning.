from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


def hash_password(pw: str) -> str:
    return pwd_ctx.hash(pw)


def verify_password(pw: str, hashed: str) -> bool:
    return pwd_ctx.verify(pw, hashed)


def create_token(sub: str, role: str) -> str:
    exp = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode({"sub": sub, "role": role, "exp": exp}, settings.secret_key,
                      algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
