from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.nutrition import MealLog
from app.schemas.nutrition import MealLogCreate, MealLogUpdate


class CRUDMealLog:
    def get_by_id(self, db: Session, meal_id: int, user_id: Optional[int] = None) -> Optional[MealLog]:
        query = db.query(MealLog).filter(MealLog.id == meal_id)
        if user_id is not None:
            query = query.filter(MealLog.user_id == user_id)
        return query.first()

    def get_multi_by_user(
        self,
        db: Session,
        user_id: int,
        date: Optional[str] = None,
        meal_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[MealLog]:
        query = db.query(MealLog).filter(MealLog.user_id == user_id)
        if date:
            query = query.filter(MealLog.date == date)
        if meal_type and meal_type.lower() != "all":
            query = query.filter(MealLog.meal_type == meal_type)
        return query.order_by(MealLog.date.desc(), MealLog.time.desc().nullslast(), MealLog.created_at.desc()).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: MealLogCreate, user_id: int) -> MealLog:
        db_obj = MealLog(
            user_id=user_id,
            meal_type=obj_in.meal_type,
            title=obj_in.title,
            description=obj_in.description,
            image_url=obj_in.image_url,
            date=obj_in.date,
            time=obj_in.time,
            calories=obj_in.calories,
            protein_g=obj_in.protein_g,
            carbs_g=obj_in.carbs_g,
            fat_g=obj_in.fat_g,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: MealLog, obj_in: MealLogUpdate) -> MealLog:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, meal_id: int, user_id: int) -> Optional[MealLog]:
        obj = self.get_by_id(db, meal_id=meal_id, user_id=user_id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

    def get_summary_by_date(self, db: Session, user_id: int, date: str) -> dict:
        meals = db.query(MealLog).filter(MealLog.user_id == user_id, MealLog.date == date).order_by(MealLog.time.asc().nullslast()).all()
        total_calories = sum(m.calories or 0 for m in meals)
        total_protein = round(sum(m.protein_g or 0.0 for m in meals), 1)
        total_carbs = round(sum(m.carbs_g or 0.0 for m in meals), 1)
        total_fat = round(sum(m.fat_g or 0.0 for m in meals), 1)

        return {
            "date": date,
            "total_meals": len(meals),
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_carbs": total_carbs,
            "total_fat": total_fat,
            "meals": meals,
        }


meal_log_crud = CRUDMealLog()
