from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.crud.workout_session import workout_session_crud
from app.models.user import User
from app.schemas.workout_session import (
    WorkoutSessionCreate,
    WorkoutSessionUpdate,
    WorkoutSessionResponse,
)

router = APIRouter()


@router.get("/", response_model=List[WorkoutSessionResponse])
def read_workout_sessions(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Retrieve logged workout sessions for the current user."""
    sessions = workout_session_crud.get_multi_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return sessions


@router.get("/{session_id}", response_model=WorkoutSessionResponse)
def read_workout_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Retrieve details of a specific recorded workout session."""
    session = workout_session_crud.get_by_id(
        db, session_id=session_id, user_id=current_user.id
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout session not found or you do not have permission to view it.",
        )
    return session


@router.post("/", response_model=WorkoutSessionResponse, status_code=status.HTTP_201_CREATED)
def create_workout_session(
    session_in: WorkoutSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Record and complete a workout session with all performed sets."""
    session = workout_session_crud.create_with_sets(
        db, obj_in=session_in, user_id=current_user.id
    )
    return session


@router.put("/{session_id}", response_model=WorkoutSessionResponse)
def update_workout_session(
    session_id: int,
    session_in: WorkoutSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update an existing workout session."""
    session = workout_session_crud.get_by_id(
        db, session_id=session_id, user_id=current_user.id
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout session not found or you do not have permission to edit it.",
        )
    updated = workout_session_crud.update_with_sets(
        db, db_obj=session, obj_in=session_in
    )
    return updated


@router.delete("/{session_id}")
def delete_workout_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Delete a logged workout session."""
    session = workout_session_crud.get_by_id(
        db, session_id=session_id, user_id=current_user.id
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout session not found or you do not have permission to delete it.",
        )
    workout_session_crud.delete(db, db_obj=session)
    return {"message": "Workout session deleted successfully."}
