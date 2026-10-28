from typing import Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class CRUDUser:
    def get_by_id(self, db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email.lower()).first()

    def get_by_username(self, db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username.lower()).first()

    def get_by_username_or_email(self, db: Session, identifier: str) -> Optional[User]:
        id_lower = identifier.lower().strip()
        return db.query(User).filter(
            or_(User.email == id_lower, User.username == id_lower)
        ).first()

    def create(self, db: Session, obj_in: UserCreate) -> User:
        db_user = User(
            email=obj_in.email.lower().strip(),
            username=obj_in.username.lower().strip(),
            full_name=obj_in.full_name,
            hashed_password=get_password_hash(obj_in.password),
            is_active=True,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def authenticate(self, db: Session, identifier: str, password: str) -> Optional[User]:
        user = self.get_by_username_or_email(db, identifier)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def update(self, db: Session, db_obj: User, obj_in: UserUpdate) -> User:
        update_data = obj_in.model_dump(exclude_unset=True)
        update_data.pop("current_password", None)
        if "password" in update_data and update_data["password"]:
            hashed_password = get_password_hash(update_data.pop("password"))
            db_obj.hashed_password = hashed_password
        if "email" in update_data and update_data["email"]:
            db_obj.email = update_data["email"].lower().strip()
        if "username" in update_data and update_data["username"]:
            db_obj.username = update_data["username"].lower().strip()
        if "full_name" in update_data:
            db_obj.full_name = update_data["full_name"]

        db.commit()
        db.refresh(db_obj)
        return db_obj


user_crud = CRUDUser()
