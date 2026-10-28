from datetime import timedelta
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import optional_oauth2
from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import auth_rate_limiter, register_rate_limiter
from app.core.security import create_access_token, decode_access_token, revoke_token
from app.crud.user import user_crud
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserResponse, UserLogin

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(register_rate_limiter)],
)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """Register a new user account with email, username, and password."""
    # Check if email is already registered
    if user_crud.get_by_email(db, email=user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )
    # Check if username is already taken
    if user_crud.get_by_username(db, username=user_in.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This username is already taken. Please choose another.",
        )

    user = user_crud.create(db, obj_in=user_in)
    return user


@router.post(
    "/login",
    response_model=Token,
    dependencies=[Depends(auth_rate_limiter)],
)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """OAuth2 compatible token login, accepts form-encoded username/email and password."""
    user = user_crud.authenticate(
        db, identifier=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user account."
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post(
    "/login/json",
    response_model=Token,
    dependencies=[Depends(auth_rate_limiter)],
)
def login_json(
    credentials: UserLogin, db: Session = Depends(get_db)
) -> Any:
    """JSON login endpoint convenient for frontend Axios requests."""
    user = user_crud.authenticate(
        db, identifier=credentials.username_or_email, password=credentials.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user account."
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(token: Optional[str] = Depends(optional_oauth2)) -> Any:
    """Logout endpoint. Revokes the provided JWT token on the backend."""
    if token:
        payload = decode_access_token(token)
        if payload and "jti" in payload:
            exp = float(payload.get("exp", 0))
            revoke_token(payload["jti"], exp)
    return {"message": "Logged out successfully"}

