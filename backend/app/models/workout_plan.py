from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String(50), default="Intermediate", nullable=False)
    estimated_duration_min = Column(Integer, default=45, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="workout_plans")
    items = relationship(
        "WorkoutPlanItem",
        back_populates="plan",
        cascade="all, delete-orphan",
        order_by="WorkoutPlanItem.order_index"
    )
    sessions = relationship("WorkoutSession", back_populates="plan")


class WorkoutPlanItem(Base):
    __tablename__ = "workout_plan_items"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("workout_plans.id", ondelete="CASCADE"), nullable=False, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id", ondelete="CASCADE"), nullable=False, index=True)
    order_index = Column(Integer, default=1, nullable=False)
    target_sets = Column(Integer, default=3, nullable=False)
    target_reps = Column(Integer, default=10, nullable=False)
    target_rpe = Column(Float, nullable=True)
    rest_seconds = Column(Integer, default=90, nullable=False)
    notes = Column(Text, nullable=True)

    # Relationships
    plan = relationship("WorkoutPlan", back_populates="items")
    exercise = relationship("Exercise", back_populates="plan_items")
