from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import verify_password
from app.crud.user import user_crud
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)) -> Any:
    """Get current authenticated user profile."""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_user_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update current user profile information with security checks."""
    # 1. Check email conflict
    if user_in.email and user_in.email.lower().strip() != current_user.email.lower():
        existing_email = (
            db.query(User)
            .filter(User.email == user_in.email.lower().strip(), User.id != current_user.id)
            .first()
        )
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists.",
            )

    # 2. Check username conflict
    if user_in.username and user_in.username.lower().strip() != current_user.username.lower():
        existing_username = (
            db.query(User)
            .filter(User.username == user_in.username.lower().strip(), User.id != current_user.id)
            .first()
        )
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This username is already taken. Please choose another.",
            )

    # 3. Require current password verification when setting a new password
    if user_in.password:
        if not user_in.current_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is required to change your password.",
            )
        if not verify_password(user_in.current_password, current_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password.",
            )

    updated_user = user_crud.update(db, db_obj=current_user, obj_in=user_in)
    return updated_user

