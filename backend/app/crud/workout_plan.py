from typing import List, Optional
from sqlalchemy.orm import Session, joinedload

from app.models.workout_plan import WorkoutPlan, WorkoutPlanItem
from app.schemas.workout_plan import WorkoutPlanCreate, WorkoutPlanUpdate


class CRUDWorkoutPlan:
    def get_by_id(self, db: Session, plan_id: int, user_id: Optional[int] = None) -> Optional[WorkoutPlan]:
        query = (
            db.query(WorkoutPlan)
            .options(
                joinedload(WorkoutPlan.items).joinedload(WorkoutPlanItem.exercise)
            )
            .filter(WorkoutPlan.id == plan_id)
        )
        if user_id is not None:
            query = query.filter(WorkoutPlan.user_id == user_id)
        return query.first()

    def get_multi_by_user(
        self, db: Session, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[WorkoutPlan]:
        return (
            db.query(WorkoutPlan)
            .options(
                joinedload(WorkoutPlan.items).joinedload(WorkoutPlanItem.exercise)
            )
            .filter(WorkoutPlan.user_id == user_id)
            .order_by(WorkoutPlan.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_items(
        self, db: Session, obj_in: WorkoutPlanCreate, user_id: int
    ) -> WorkoutPlan:
        db_plan = WorkoutPlan(
            user_id=user_id,
            name=obj_in.name,
            description=obj_in.description,
            difficulty=obj_in.difficulty,
            estimated_duration_min=obj_in.estimated_duration_min,
        )
        db.add(db_plan)
        db.flush()  # Flush to get db_plan.id

        # Add items
        for idx, item_in in enumerate(obj_in.items, start=1):
            item = WorkoutPlanItem(
                plan_id=db_plan.id,
                exercise_id=item_in.exercise_id,
                order_index=item_in.order_index or idx,
                target_sets=item_in.target_sets,
                target_reps=item_in.target_reps,
                target_rpe=item_in.target_rpe,
                rest_seconds=item_in.rest_seconds,
                notes=item_in.notes,
            )
            db.add(item)

        db.commit()
        return self.get_by_id(db, db_plan.id)

    def update_with_items(
        self, db: Session, db_obj: WorkoutPlan, obj_in: WorkoutPlanUpdate
    ) -> WorkoutPlan:
        update_data = obj_in.model_dump(exclude_unset=True)

        if "items" in update_data:
            new_items = update_data.pop("items")
            if new_items is not None:
                # Remove existing items and add new items
                db.query(WorkoutPlanItem).filter(WorkoutPlanItem.plan_id == db_obj.id).delete()
                for idx, item_data in enumerate(new_items, start=1):
                    item = WorkoutPlanItem(
                        plan_id=db_obj.id,
                        exercise_id=item_data["exercise_id"],
                        order_index=item_data.get("order_index", idx),
                        target_sets=item_data.get("target_sets", 3),
                        target_reps=item_data.get("target_reps", 10),
                        target_rpe=item_data.get("target_rpe"),
                        rest_seconds=item_data.get("rest_seconds", 90),
                        notes=item_data.get("notes"),
                    )
                    db.add(item)

        for field, value in update_data.items():
            setattr(db_obj, field, value)

        db.commit()
        return self.get_by_id(db, db_obj.id)

    def delete(self, db: Session, db_obj: WorkoutPlan) -> WorkoutPlan:
        db.delete(db_obj)
        db.commit()
        return db_obj


workout_plan_crud = CRUDWorkoutPlan()
