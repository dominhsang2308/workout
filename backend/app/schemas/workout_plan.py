from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.exercise import ExerciseResponse


class WorkoutPlanItemBase(BaseModel):
    exercise_id: int
    order_index: int = 1
    target_sets: int = Field(default=3, ge=1, le=20)
    target_reps: int = Field(default=10, ge=1, le=100)
    target_rpe: Optional[float] = Field(default=None, ge=1.0, le=10.0)
    rest_seconds: int = Field(default=90, ge=0, le=600)
    notes: Optional[str] = None


class WorkoutPlanItemCreate(WorkoutPlanItemBase):
    pass


class WorkoutPlanItemResponse(WorkoutPlanItemBase):
    id: int
    plan_id: int
    exercise: Optional[ExerciseResponse] = None

    model_config = ConfigDict(from_attributes=True)


class WorkoutPlanBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    difficulty: str = Field(default="Intermediate", max_length=50)
    estimated_duration_min: int = Field(default=45, ge=5, le=300)


class WorkoutPlanCreate(WorkoutPlanBase):
    items: List[WorkoutPlanItemCreate] = []


class WorkoutPlanUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    difficulty: Optional[str] = Field(None, max_length=50)
    estimated_duration_min: Optional[int] = Field(None, ge=5, le=300)
    items: Optional[List[WorkoutPlanItemCreate]] = None


class WorkoutPlanResponse(WorkoutPlanBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[WorkoutPlanItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
