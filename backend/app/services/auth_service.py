"""Business logic for authentication: registration, login, refresh, password changes."""
import uuid

from fastapi import HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import ChangePasswordRequest, TokenResponse, UserLoginRequest, UserRegisterRequest


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register(self, payload: UserRegisterRequest) -> User:
        if self.user_repo.get_by_email(payload.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")
        if self.user_repo.get_by_phone(payload.phone_number):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone number is already registered")

        user = User(
            full_name=payload.full_name,
            email=payload.email,
            phone_number=payload.phone_number,
            hashed_password=hash_password(payload.password),
            role=payload.role,
        )
        return self.user_repo.create(user)

    def authenticate(self, payload: UserLoginRequest) -> User:
        user = self.user_repo.get_by_email(payload.email)
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive")
        return user

    @staticmethod
    def issue_tokens(user: User) -> TokenResponse:
        access_token = create_access_token(subject=str(user.id), extra_claims={"role": user.role.value})
        refresh_token = create_refresh_token(subject=str(user.id))
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)

    def refresh_tokens(self, refresh_token: str) -> TokenResponse:
        try:
            payload = decode_refresh_token(refresh_token)
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

        user_id = payload.get("sub")
        user = self.user_repo.get_by_id(uuid.UUID(user_id)) if user_id else None
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

        return self.issue_tokens(user)

    def change_password(self, user: User, payload: ChangePasswordRequest) -> None:
        if not verify_password(payload.old_password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Old password is incorrect")
        user.hashed_password = hash_password(payload.new_password)
        self.user_repo.update(user)
