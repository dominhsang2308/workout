import os
import uuid
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.crud.nutrition import meal_log_crud
from app.models.user import User
from app.schemas.nutrition import (
    MealLogCreate,
    MealLogUpdate,
    MealLogResponse,
    NutritionSummaryResponse,
)

router = APIRouter()

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads", "meals")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/meals", response_model=List[MealLogResponse])
def get_meal_logs(
    date: Optional[str] = Query(None, description="Filter by date YYYY-MM-DD"),
    meal_type: Optional[str] = Query(None, description="Filter by meal type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Retrieve meal logs for the current user."""
    return meal_log_crud.get_multi_by_user(
        db, user_id=current_user.id, date=date, meal_type=meal_type, skip=skip, limit=limit
    )


@router.post("/meals", response_model=MealLogResponse, status_code=status.HTTP_201_CREATED)
def create_meal_log(
    obj_in: MealLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Create a new meal log record."""
    return meal_log_crud.create(db, obj_in=obj_in, user_id=current_user.id)


@router.get("/summary", response_model=NutritionSummaryResponse)
def get_nutrition_summary(
    date: str = Query(..., description="Target date YYYY-MM-DD"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get nutrition summary for a given day."""
    return meal_log_crud.get_summary_by_date(db, user_id=current_user.id, date=date)


from app.core.rate_limit import upload_rate_limiter

MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB maximum file size limit


@router.post(
    "/upload-image",
    dependencies=[Depends(upload_rate_limiter)],
)
async def upload_meal_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Upload a meal photo with file size limit and magic bytes validation."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must declare a valid image content type.",
        )

    # Stream read with size enforcement to prevent DoS / Memory exhaustion
    CHUNK_SIZE = 64 * 1024
    total_size = 0
    chunks = []

    try:
        while True:
            chunk = await file.read(CHUNK_SIZE)
            if not chunk:
                break
            total_size += len(chunk)
            if total_size > MAX_IMAGE_SIZE_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="Uploaded image exceeds maximum allowed limit of 5MB.",
                )
            chunks.append(chunk)
    finally:
        await file.close()

    content = b"".join(chunks)
    if len(content) < 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty or corrupted.",
        )

    # Magic bytes verification to detect actual image signature
    if content.startswith(b"\xff\xd8\xff"):
        ext = ".jpg"
    elif content.startswith(b"\x89PNG\r\n\x1a\n"):
        ext = ".png"
    elif content[:4] == b"RIFF" and content[8:12] == b"WEBP":
        ext = ".webp"
    elif content.startswith(b"GIF87a") or content.startswith(b"GIF89a"):
        ext = ".gif"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image signature. Only valid JPEG, PNG, WebP, or GIF files are allowed.",
        )

    # Secure unique filename
    safe_filename = f"meal_{current_user.id}_{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, safe_filename)

    try:
        with open(dest_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save uploaded image: {str(e)}",
        )

    # Relative path served via StaticFiles
    return {"image_url": f"/uploads/meals/{safe_filename}"}


@router.delete("/meals/{meal_id}", status_code=status.HTTP_200_OK)
def delete_meal_log(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Delete a meal log."""
    deleted = meal_log_crud.remove(db, meal_id=meal_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal log not found or you do not have permission to delete it.",
        )
    return {"message": "Meal log deleted successfully."}
