from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class MealLogBase(BaseModel):
    meal_type: str = Field(..., description="Type of meal: breakfast, lunch, afternoon_snack, dinner, snack")
    title: str = Field(..., max_length=255, description="Name or title of the meal/food")
    description: Optional[str] = Field(None, description="Detailed notes, ingredients or reflections")
    image_url: Optional[str] = Field(None, description="URL or relative path to the uploaded meal image")
    date: str = Field(..., description="Date of the meal in YYYY-MM-DD format")
    time: Optional[str] = Field(None, description="Time of the meal in HH:MM format")
    calories: Optional[int] = Field(None, ge=0, description="Estimated calories in kcal")
    protein_g: Optional[float] = Field(None, ge=0, description="Protein in grams")
    carbs_g: Optional[float] = Field(None, ge=0, description="Carbohydrates in grams")
    fat_g: Optional[float] = Field(None, ge=0, description="Fat in grams")


class MealLogCreate(MealLogBase):
    pass


class MealLogUpdate(BaseModel):
    meal_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    calories: Optional[int] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None


class MealLogResponse(MealLogBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class NutritionSummaryResponse(BaseModel):
    date: str
    total_meals: int
    total_calories: int
    total_protein: float
    total_carbs: float
    total_fat: float
    meals: List[MealLogResponse]
