from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_optional_current_user
from app.core.database import get_db
from app.crud.exercise import exercise_crud
from app.models.user import User
from app.schemas.exercise import ExerciseCreate, ExerciseUpdate, ExerciseResponse

router = APIRouter()


@router.get("/", response_model=List[ExerciseResponse])
def read_exercises(
    db: Session = Depends(get_db),
    muscle_group: Optional[str] = Query(None, description="Filter by muscle group"),
    equipment: Optional[str] = Query(None, description="Filter by equipment"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty level: Beginner, Intermediate, Experienced"),
    search: Optional[str] = Query(None, description="Search exercise by name"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    """Retrieve exercises list. Returns global standard exercises and user-custom ones if logged in."""
    user_id = current_user.id if current_user else None
    exercises = exercise_crud.get_multi(
        db,
        user_id=user_id,
        muscle_group=muscle_group,
        equipment=equipment,
        difficulty=difficulty,
        search=search,
        skip=skip,
        limit=limit,
    )
    return exercises


@router.get("/{exercise_id}", response_model=ExerciseResponse)
def read_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
) -> Any:
    """Get exercise details by ID."""
    exercise = exercise_crud.get_by_id(db, exercise_id=exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found."
        )
    # Check if custom exercise belongs to another user
    if exercise.is_custom and exercise.user_id:
        if not current_user or exercise.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to view this private exercise.",
            )
    return exercise


@router.post("/", response_model=ExerciseResponse, status_code=status.HTTP_201_CREATED)
def create_exercise(
    exercise_in: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Create a new custom exercise for the current user."""
    exercise = exercise_crud.create(db, obj_in=exercise_in, user_id=current_user.id)
    return exercise


@router.put("/{exercise_id}", response_model=ExerciseResponse)
def update_exercise(
    exercise_id: int,
    exercise_in: ExerciseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update a custom exercise. Only the creator can edit it."""
    exercise = exercise_crud.get_by_id(db, exercise_id=exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found."
        )
    if not exercise.is_custom or exercise.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit custom exercises created by yourself.",
        )
    updated = exercise_crud.update(db, db_obj=exercise, obj_in=exercise_in)
    return updated


@router.delete("/{exercise_id}")
def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Delete a custom exercise. Only the creator can delete it."""
    exercise = exercise_crud.get_by_id(db, exercise_id=exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found."
        )
    if not exercise.is_custom or exercise.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete custom exercises created by yourself.",
        )
    exercise_crud.delete(db, db_obj=exercise)
    return {"message": f"Exercise '{exercise.name}' deleted successfully."}
