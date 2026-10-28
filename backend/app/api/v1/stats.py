from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.crud.stats import stats_crud
from app.models.user import User
from app.schemas.stats import DashboardStatsResponse

router = APIRouter()


@router.get("/dashboard", response_model=DashboardStatsResponse)
def get_dashboard_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Retrieve comprehensive workout statistics and weekly progression for the logged-in user."""
    stats = stats_crud.get_dashboard_stats(db, user_id=current_user.id)
    return stats
