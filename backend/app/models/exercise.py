from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), index=True, nullable=False)
    muscle_group = Column(String(100), index=True, nullable=False)
    equipment = Column(String(100), nullable=False)
    category = Column(String(100), default="Strength", nullable=False)
    difficulty = Column(String(50), default="Beginner", nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    video_url = Column(String(500), nullable=True)
    is_custom = Column(Boolean, default=False, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="custom_exercises")
    plan_items = relationship("WorkoutPlanItem", back_populates="exercise", cascade="all, delete-orphan")
    set_logs = relationship("WorkoutSetLog", back_populates="exercise", cascade="all, delete-orphan")
