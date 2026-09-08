"""Authentication API routes."""

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    MessageResponse,
    RefreshTokenRequest,
    TokenResponse,
    UserLoginRequest,
    UserProfileResponse,
    UserRegisterRequest,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


# -----------------------------
# Register
# -----------------------------
@router.post(
    "/register",
    response_model=UserProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.register(payload)


# -----------------------------
# JSON Login (Frontend)
# -----------------------------
@router.post("/login-json", response_model=TokenResponse)
def login_json(payload: UserLoginRequest, db: Session = Depends(get_db)):
    """
    Login endpoint for frontend/mobile apps.
    Accepts JSON:
    {
        "email": "...",
        "password": "..."
    }
    """
    service = AuthService(db)
    user = service.authenticate(payload)
    return service.issue_tokens(user)


# -----------------------------
# OAuth2 Login (Swagger)
# -----------------------------
@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    OAuth2 Password Flow login used by Swagger Authorize.
    """

    service = AuthService(db)

    payload = UserLoginRequest(
        email=form_data.username,
        password=form_data.password,
    )

    user = service.authenticate(payload)

    return service.issue_tokens(user)


# -----------------------------
# Refresh Token
# -----------------------------
@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.refresh_tokens(payload.refresh_token)


# -----------------------------
# Logout
# -----------------------------
@router.post("/logout", response_model=MessageResponse)
def logout(current_user: User = Depends(get_current_user)):
    return MessageResponse(message="Successfully logged out")


# -----------------------------
# Change Password
# -----------------------------
@router.post("/change-password", response_model=MessageResponse)
def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    service.change_password(current_user, payload)
    return MessageResponse(message="Password changed successfully")


# -----------------------------
# Current User Profile
# -----------------------------
@router.get("/profile", response_model=UserProfileResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user