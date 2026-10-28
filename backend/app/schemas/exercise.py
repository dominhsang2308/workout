from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ExerciseBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    muscle_group: str = Field(..., min_length=2, max_length=100)
    equipment: str = Field(..., min_length=2, max_length=100)
    category: str = Field(default="Strength", max_length=100)
    difficulty: str = Field(default="Beginner", max_length=50)
    description: Optional[str] = None
    instructions: Optional[str] = None
    video_url: Optional[str] = None


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    muscle_group: Optional[str] = Field(None, min_length=2, max_length=100)
    equipment: Optional[str] = Field(None, min_length=2, max_length=100)
    category: Optional[str] = Field(None, max_length=100)
    difficulty: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    instructions: Optional[str] = None
    video_url: Optional[str] = None


class ExerciseResponse(ExerciseBase):
    id: int
    is_custom: bool
    user_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
