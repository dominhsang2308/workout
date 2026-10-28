from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.crud.workout_plan import workout_plan_crud
from app.models.user import User
from app.schemas.workout_plan import (
    WorkoutPlanCreate,
    WorkoutPlanUpdate,
    WorkoutPlanResponse,
)

router = APIRouter()


@router.get("/", response_model=List[WorkoutPlanResponse])
def read_workout_plans(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Retrieve workout plans for the current user."""
    plans = workout_plan_crud.get_multi_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return plans


@router.get("/{plan_id}", response_model=WorkoutPlanResponse)
def read_workout_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Retrieve details of a specific workout plan."""
    plan = workout_plan_crud.get_by_id(db, plan_id=plan_id, user_id=current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout plan not found or you do not have permission to view it.",
        )
    return plan


@router.post("/", response_model=WorkoutPlanResponse, status_code=status.HTTP_201_CREATED)
def create_workout_plan(
    plan_in: WorkoutPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Create a new workout plan with exercises."""
    plan = workout_plan_crud.create_with_items(
        db, obj_in=plan_in, user_id=current_user.id
    )
    return plan


@router.put("/{plan_id}", response_model=WorkoutPlanResponse)
def update_workout_plan(
    plan_id: int,
    plan_in: WorkoutPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update a workout plan and its exercises."""
    plan = workout_plan_crud.get_by_id(db, plan_id=plan_id, user_id=current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout plan not found or you do not have permission to edit it.",
        )
    updated_plan = workout_plan_crud.update_with_items(
        db, db_obj=plan, obj_in=plan_in
    )
    return updated_plan


@router.delete("/{plan_id}")
def delete_workout_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Delete a workout plan."""
    plan = workout_plan_crud.get_by_id(db, plan_id=plan_id, user_id=current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout plan not found or you do not have permission to delete it.",
        )
    workout_plan_crud.delete(db, db_obj=plan)
    return {"message": f"Workout plan '{plan.name}' deleted successfully."}
