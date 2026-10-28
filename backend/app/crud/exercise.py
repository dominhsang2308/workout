from typing import List, Optional
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session

from app.models.exercise import Exercise
from app.schemas.exercise import ExerciseCreate, ExerciseUpdate


class CRUDExercise:
    def get_by_id(self, db: Session, exercise_id: int) -> Optional[Exercise]:
        return db.query(Exercise).filter(Exercise.id == exercise_id).first()

    def get_multi(
        self,
        db: Session,
        user_id: Optional[int] = None,
        muscle_group: Optional[str] = None,
        equipment: Optional[str] = None,
        difficulty: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Exercise]:
        # User sees standard exercises (user_id is None) + their own custom exercises
        if user_id:
            query = db.query(Exercise).filter(
                or_(Exercise.user_id.is_(None), Exercise.user_id == user_id)
            )
        else:
            query = db.query(Exercise).filter(Exercise.user_id.is_(None))

        if muscle_group and muscle_group != "All":
            query = query.filter(Exercise.muscle_group == muscle_group)

        if equipment and equipment != "All":
            query = query.filter(Exercise.equipment == equipment)

        if difficulty and difficulty != "All":
            query = query.filter(Exercise.difficulty == difficulty)

        if search:
            query = query.filter(Exercise.name.ilike(f"%{search}%"))

        return query.order_by(Exercise.name.asc()).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: ExerciseCreate, user_id: Optional[int] = None) -> Exercise:
        db_obj = Exercise(
            name=obj_in.name,
            muscle_group=obj_in.muscle_group,
            equipment=obj_in.equipment,
            category=obj_in.category,
            difficulty=getattr(obj_in, "difficulty", "Beginner") or "Beginner",
            description=obj_in.description,
            instructions=obj_in.instructions,
            video_url=obj_in.video_url,
            is_custom=True if user_id is not None else False,
            user_id=user_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: Exercise, obj_in: ExerciseUpdate) -> Exercise:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, db_obj: Exercise) -> Exercise:
        db.delete(db_obj)
        db.commit()
        return db_obj


exercise_crud = CRUDExercise()
