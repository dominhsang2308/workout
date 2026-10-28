from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload

from app.models.workout_session import WorkoutSession, WorkoutSetLog
from app.schemas.workout_session import WorkoutSessionCreate, WorkoutSessionUpdate


class CRUDWorkoutSession:
    def get_by_id(
        self, db: Session, session_id: int, user_id: Optional[int] = None
    ) -> Optional[WorkoutSession]:
        query = (
            db.query(WorkoutSession)
            .options(
                joinedload(WorkoutSession.sets).joinedload(WorkoutSetLog.exercise)
            )
            .filter(WorkoutSession.id == session_id)
        )
        if user_id is not None:
            query = query.filter(WorkoutSession.user_id == user_id)
        return query.first()

    def get_multi_by_user(
        self, db: Session, user_id: int, skip: int = 0, limit: int = 50
    ) -> List[WorkoutSession]:
        return (
            db.query(WorkoutSession)
            .options(
                joinedload(WorkoutSession.sets).joinedload(WorkoutSetLog.exercise)
            )
            .filter(WorkoutSession.user_id == user_id)
            .order_by(WorkoutSession.started_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def _calc_volume(self, sets_data: List[dict]) -> float:
        total = 0.0
        for s in sets_data:
            reps = s.get("reps", 0) or 0
            weight = s.get("weight_kg", 0.0) or 0.0
            total += reps * weight
        return round(total, 2)

    def create_with_sets(
        self, db: Session, obj_in: WorkoutSessionCreate, user_id: int
    ) -> WorkoutSession:
        sets_dicts = [s.model_dump() for s in obj_in.sets]
        total_volume = self._calc_volume(sets_dicts)

        db_session = WorkoutSession(
            user_id=user_id,
            plan_id=obj_in.plan_id,
            title=obj_in.title,
            started_at=obj_in.started_at,
            completed_at=obj_in.completed_at,
            duration_seconds=obj_in.duration_seconds,
            total_volume_kg=total_volume,
            notes=obj_in.notes,
        )
        db.add(db_session)
        db.flush()

        for s in sets_dicts:
            db_set = WorkoutSetLog(
                session_id=db_session.id,
                exercise_id=s["exercise_id"],
                set_number=s.get("set_number", 1),
                reps=s.get("reps", 0),
                weight_kg=s.get("weight_kg", 0.0),
                duration_seconds=s.get("duration_seconds"),
                rpe=s.get("rpe"),
                is_completed=s.get("is_completed", True),
                notes=s.get("notes"),
            )
            db.add(db_set)

        db.commit()
        return self.get_by_id(db, db_session.id)

    def update_with_sets(
        self, db: Session, db_obj: WorkoutSession, obj_in: WorkoutSessionUpdate
    ) -> WorkoutSession:
        update_data = obj_in.model_dump(exclude_unset=True)

        if "sets" in update_data:
            new_sets = update_data.pop("sets")
            if new_sets is not None:
                db.query(WorkoutSetLog).filter(WorkoutSetLog.session_id == db_obj.id).delete()
                for s in new_sets:
                    db_set = WorkoutSetLog(
                        session_id=db_obj.id,
                        exercise_id=s["exercise_id"],
                        set_number=s.get("set_number", 1),
                        reps=s.get("reps", 0),
                        weight_kg=s.get("weight_kg", 0.0),
                        duration_seconds=s.get("duration_seconds"),
                        rpe=s.get("rpe"),
                        is_completed=s.get("is_completed", True),
                        notes=s.get("notes"),
                    )
                    db.add(db_set)
                db_obj.total_volume_kg = self._calc_volume(new_sets)

        for field, value in update_data.items():
            setattr(db_obj, field, value)

        db.commit()
        return self.get_by_id(db, db_obj.id)

    def delete(self, db: Session, db_obj: WorkoutSession) -> WorkoutSession:
        db.delete(db_obj)
        db.commit()
        return db_obj


workout_session_crud = CRUDWorkoutSession()
