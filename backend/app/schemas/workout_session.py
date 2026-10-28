from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.exercise import ExerciseResponse


class WorkoutSetLogBase(BaseModel):
    exercise_id: int
    set_number: int = Field(default=1, ge=1)
    reps: int = Field(default=0, ge=0)
    weight_kg: float = Field(default=0.0, ge=0.0)
    duration_seconds: Optional[int] = Field(default=None, ge=0)
    rpe: Optional[float] = Field(default=None, ge=1.0, le=10.0)
    is_completed: bool = True
    notes: Optional[str] = None


class WorkoutSetLogCreate(WorkoutSetLogBase):
    pass


class WorkoutSetLogUpdate(BaseModel):
    exercise_id: Optional[int] = None
    set_number: Optional[int] = None
    reps: Optional[int] = None
    weight_kg: Optional[float] = None
    duration_seconds: Optional[int] = None
    rpe: Optional[float] = None
    is_completed: Optional[bool] = None
    notes: Optional[str] = None


class WorkoutSetLogResponse(WorkoutSetLogBase):
    id: int
    session_id: int
    created_at: datetime
    exercise: Optional[ExerciseResponse] = None

    model_config = ConfigDict(from_attributes=True)


class WorkoutSessionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    plan_id: Optional[int] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: int = Field(default=0, ge=0)
    notes: Optional[str] = None


class WorkoutSessionCreate(WorkoutSessionBase):
    sets: List[WorkoutSetLogCreate] = []


class WorkoutSessionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    plan_id: Optional[int] = None
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None
    sets: Optional[List[WorkoutSetLogCreate]] = None


class WorkoutSessionResponse(WorkoutSessionBase):
    id: int
    user_id: int
    total_volume_kg: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    sets: List[WorkoutSetLogResponse] = []

    model_config = ConfigDict(from_attributes=True)
