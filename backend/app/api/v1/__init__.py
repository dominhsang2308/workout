from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.exercises import router as exercises_router
from app.api.v1.workout_plans import router as workout_plans_router
from app.api.v1.workout_sessions import router as workout_sessions_router
from app.api.v1.stats import router as stats_router
from app.api.v1.nutrition import router as nutrition_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_v1_router.include_router(users_router, prefix="/users", tags=["Users"])
api_v1_router.include_router(exercises_router, prefix="/exercises", tags=["Exercises"])
api_v1_router.include_router(workout_plans_router, prefix="/plans", tags=["Workout Plans"])
api_v1_router.include_router(workout_sessions_router, prefix="/sessions", tags=["Workout Sessions"])
api_v1_router.include_router(stats_router, prefix="/stats", tags=["Statistics & Dashboard"])
api_v1_router.include_router(nutrition_router, prefix="/nutrition", tags=["Nutrition & Meals"])
