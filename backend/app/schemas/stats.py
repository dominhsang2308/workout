from typing import List, Optional
from pydantic import BaseModel
from app.schemas.workout_session import WorkoutSessionResponse


class WeeklyStatItem(BaseModel):
    week_start: str
    week_label: str
    workout_count: int
    total_volume_kg: float
    total_duration_minutes: int


class MuscleGroupDistribution(BaseModel):
    muscle_group: str
    sets_count: int
    percentage: float


class DailyActivityItem(BaseModel):
    date: str  # YYYY-MM-DD
    workout_count: int
    duration_minutes: int
    total_volume_kg: float
    titles: List[str]


class DashboardStatsResponse(BaseModel):
    total_workouts: int
    total_duration_minutes: int
    total_volume_kg: float
    current_streak_days: int
    best_streak_days: int
    workouts_this_week: int
    workouts_last_week: int
    weekly_progress: List[WeeklyStatItem]
    muscle_group_distribution: List[MuscleGroupDistribution]
    recent_workouts: List[WorkoutSessionResponse]
    daily_activity: List[DailyActivityItem]
