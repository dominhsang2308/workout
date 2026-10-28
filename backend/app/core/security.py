from datetime import datetime, timedelta, timezone
import time
from typing import Any, Optional, Union
import uuid
import bcrypt
from jose import jwt, JWTError

from app.core.config import settings

# Thread-safe in-memory token blacklist: jti -> exp_epoch
_revoked_tokens: dict[str, float] = {}
_last_cleanup = time.time()


def _cleanup_revoked_tokens(now: float) -> None:
    global _last_cleanup
    if now - _last_cleanup > 300:  # Cleanup every 5 minutes
        expired_jtis = [jti for jti, exp in _revoked_tokens.items() if exp < now]
        for jti in expired_jtis:
            _revoked_tokens.pop(jti, None)
        _last_cleanup = now


def revoke_token(jti: str, exp: float) -> None:
    """Add a token's JTI to the revocation list."""
    now = time.time()
    _cleanup_revoked_tokens(now)
    _revoked_tokens[jti] = exp


def is_token_revoked(jti: Optional[str]) -> bool:
    """Check if token's JTI has been revoked."""
    if not jti:
        return False
    now = time.time()
    _cleanup_revoked_tokens(now)
    return jti in _revoked_tokens


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored bcrypt hash."""
    try:
        plain_bytes = plain_password.encode("utf-8")
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(plain_bytes, hash_bytes)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Generate a secure bcrypt hash for a given password."""
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def create_access_token(
    subject: Union[str, Any],
    expires_delta: Optional[timedelta] = None,
    jti: Optional[str] = None,
) -> str:
    """Create a signed JWT access token with unique JTI."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "iat": now,
        "jti": jti or uuid.uuid4().hex,
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

