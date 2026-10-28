from app.crud.user import user_crud
from app.crud.exercise import exercise_crud
from app.crud.workout_plan import workout_plan_crud
from app.crud.workout_session import workout_session_crud
from app.crud.stats import stats_crud

__all__ = [
    "user_crud",
    "exercise_crud",
    "workout_plan_crud",
    "workout_session_crud",
    "stats_crud",
]
