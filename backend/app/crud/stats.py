from datetime import datetime, timedelta, timezone
from typing import List
from collections import defaultdict
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.workout_session import WorkoutSession, WorkoutSetLog
from app.models.exercise import Exercise
from app.schemas.stats import (
    DashboardStatsResponse,
    WeeklyStatItem,
    MuscleGroupDistribution,
    DailyActivityItem,
)
from app.crud.workout_session import workout_session_crud


class CRUDStats:
    def get_dashboard_stats(self, db: Session, user_id: int) -> DashboardStatsResponse:
        sessions = workout_session_crud.get_multi_by_user(db, user_id=user_id, limit=200)

        total_workouts = len(sessions)
        total_seconds = sum(s.duration_seconds for s in sessions if s.duration_seconds)
        total_duration_minutes = total_seconds // 60
        total_volume_kg = round(sum(s.total_volume_kg for s in sessions if s.total_volume_kg), 1)

        # Streak calculation
        workout_dates = set()
        for s in sessions:
            if s.started_at:
                workout_dates.add(s.started_at.date())

        streak = 0
        today = datetime.now(timezone.utc).date()
        check_date = today

        # If user worked out today or yesterday, streak is active
        if check_date in workout_dates:
            streak += 1
            check_date -= timedelta(days=1)
        elif (check_date - timedelta(days=1)) in workout_dates:
            check_date -= timedelta(days=1)
            streak += 1
            check_date -= timedelta(days=1)

        while check_date in workout_dates:
            streak += 1
            check_date -= timedelta(days=1)

        # Best streak calculation
        sorted_dates = sorted(list(workout_dates))
        best_streak = 0
        if sorted_dates:
            current_run = 1
            best_streak = 1
            for i in range(1, len(sorted_dates)):
                diff = (sorted_dates[i] - sorted_dates[i-1]).days
                if diff == 1:
                    current_run += 1
                elif diff > 1:
                    current_run = 1
                if current_run > best_streak:
                    best_streak = current_run
        best_streak = max(best_streak, streak)

        # Weekly comparisons
        now = datetime.now(timezone.utc)
        start_of_this_week = (now - timedelta(days=now.weekday())).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        start_of_last_week = start_of_this_week - timedelta(days=7)

        workouts_this_week = sum(
            1 for s in sessions if s.started_at and s.started_at.replace(tzinfo=timezone.utc) >= start_of_this_week
        )
        workouts_last_week = sum(
            1
            for s in sessions
            if s.started_at
            and start_of_last_week <= s.started_at.replace(tzinfo=timezone.utc) < start_of_this_week
        )

        # Weekly progress breakdown (Last 6 weeks)
        weekly_data = []
        for i in range(5, -1, -1):
            w_start = start_of_this_week - timedelta(weeks=i)
            w_end = w_start + timedelta(days=7)
            week_label = f"W{w_start.strftime('%W')} ({w_start.strftime('%d/%m')})"

            w_sessions = [
                s
                for s in sessions
                if s.started_at and w_start <= s.started_at.replace(tzinfo=timezone.utc) < w_end
            ]
            w_count = len(w_sessions)
            w_volume = round(sum(s.total_volume_kg for s in w_sessions if s.total_volume_kg), 1)
            w_mins = sum(s.duration_seconds for s in w_sessions if s.duration_seconds) // 60

            weekly_data.append(
                WeeklyStatItem(
                    week_start=w_start.strftime("%Y-%m-%d"),
                    week_label=week_label,
                    workout_count=w_count,
                    total_volume_kg=w_volume,
                    total_duration_minutes=w_mins,
                )
            )

        # Muscle group distribution from set logs
        muscle_stats = (
            db.query(Exercise.muscle_group, func.count(WorkoutSetLog.id))
            .join(WorkoutSetLog, WorkoutSetLog.exercise_id == Exercise.id)
            .join(WorkoutSession, WorkoutSession.id == WorkoutSetLog.session_id)
            .filter(WorkoutSession.user_id == user_id)
            .group_by(Exercise.muscle_group)
            .all()
        )

        total_sets = sum(count for _, count in muscle_stats)
        distribution = []
        for mg, count in sorted(muscle_stats, key=lambda x: x[1], reverse=True):
            pct = round((count / total_sets) * 100, 1) if total_sets > 0 else 0.0
            distribution.append(
                MuscleGroupDistribution(
                    muscle_group=mg,
                    sets_count=count,
                    percentage=pct,
                )
            )

        # Daily activity mapping for calendar & heatmap
        daily_map = defaultdict(lambda: {"count": 0, "duration": 0, "volume": 0.0, "titles": []})
        for s in sessions:
            if s.started_at:
                d_str = s.started_at.strftime("%Y-%m-%d")
                daily_map[d_str]["count"] += 1
                daily_map[d_str]["duration"] += (s.duration_seconds or 0) // 60
                daily_map[d_str]["volume"] += round(s.total_volume_kg or 0.0, 1)
                if s.title and s.title not in daily_map[d_str]["titles"]:
                    daily_map[d_str]["titles"].append(s.title)

        daily_activity = [
            DailyActivityItem(
                date=d_str,
                workout_count=data["count"],
                duration_minutes=data["duration"],
                total_volume_kg=round(data["volume"], 1),
                titles=data["titles"],
            )
            for d_str, data in sorted(daily_map.items())
        ]

        # Recent 5 workouts
        recent = sessions[:5]

        return DashboardStatsResponse(
            total_workouts=total_workouts,
            total_duration_minutes=total_duration_minutes,
            total_volume_kg=total_volume_kg,
            current_streak_days=streak,
            best_streak_days=best_streak,
            workouts_this_week=workouts_this_week,
            workouts_last_week=workouts_last_week,
            weekly_progress=weekly_data,
            muscle_group_distribution=distribution,
            recent_workouts=recent,
            daily_activity=daily_activity,
        )


stats_crud = CRUDStats()
