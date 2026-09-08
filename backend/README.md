# Authentication Backend Module

## Overview

This module provides a complete JWT-based authentication system for the AI Powered Healthcare Communication Assistant.

It includes:

- User Registration
- User Login
- JWT Authentication
- Refresh Token
- User Profile
- Logout
- Change Password
- Forgot Password
- Reset Password (Email-based)

---

# Project Structure

```
app/
├── api/
│   └── auth.py
│
├── schemas/
│   └── auth.py
│
├── services/
│   └── auth_service.py
│
├── core/
│   ├── security.py
│   └── config.py
│
├── repositories/
│   └── user_repository.py
│
├── models/
│   └── user.py
│
└── utils/
    └── email.py
```

---

# Module Description

## 1. app/api/auth.py

Contains all authentication API endpoints.

### Available APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login-json | User login |
| POST | /auth/refresh | Generate new access token |
| GET | /auth/profile | Get logged-in user profile |
| POST | /auth/logout | Logout user |
| POST | /auth/change-password | Change password |
| POST | /auth/forgot-password | Send password reset email |
| POST | /auth/reset-password | Reset password |

---

## 2. app/services/auth_service.py

Contains all authentication business logic.

Responsibilities:

- Register user
- Login user
- Verify password
- Generate JWT tokens
- Refresh tokens
- Forgot password
- Reset password
- Change password

---

## 3. app/core/security.py

Responsible for authentication security.

Functions include:

- Password hashing
- Password verification
- Create Access Token
- Create Refresh Token
- Create Reset Token
- Decode JWT Tokens

---

## 4. app/core/config.py

Stores authentication configuration.

Includes:

- JWT Secret Key
- JWT Algorithm
- Access Token Expiry
- Refresh Token Expiry
- Reset Token Expiry
- SMTP Configuration
- Frontend URL

---

## 5. app/repositories/user_repository.py

Handles all user database operations.

Functions:

- Create User
- Find User by Email
- Find User by ID
- Update Password
- Update User Information

---

## 6. app/models/user.py

SQLAlchemy User model.

Contains user fields such as:

- id
- full_name
- email
- phone_number
- password_hash
- role
- created_at
- updated_at

---

## 7. app/schemas/auth.py

Contains request and response schemas.

Request Models

- UserRegisterRequest
- UserLoginRequest
- RefreshTokenRequest
- ChangePasswordRequest
- ForgotPasswordRequest
- ResetPasswordRequest

Response Models

- TokenResponse
- UserProfileResponse
- MessageResponse

---

## 8. app/utils/email.py

Responsible for sending password reset emails.

Features:

- SMTP Email
- Password Reset Link
- HTML Email Template

---

# Authentication Flow

```
Register
      │
      ▼
Login
      │
      ▼
Access Token + Refresh Token
      │
      ▼
Store Tokens
      │
      ▼
Access Protected APIs
      │
      ▼
Refresh Token
      │
      ▼
Generate New Access Token
```

---

# Forgot Password Flow

```
Forgot Password
        │
        ▼
Generate Reset Token
        │
        ▼
Send Reset Email
        │
        ▼
User Clicks Reset Link
        │
        ▼
Reset Password
        │
        ▼
Login Again
```

---

# Protected Endpoints

The following APIs require an Access Token.

```
Authorization: Bearer <ACCESS_TOKEN>
```

| Endpoint | Description |
|----------|-------------|
| GET /auth/profile | User Profile |
| POST /auth/logout | Logout |
| POST /auth/change-password | Change Password |

---

# Password Policy

Passwords must contain:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

Example:

```
Healthcare@123
```

---

# Frontend Integration

Base URL

```
http://127.0.0.1:8000/api/v1
```

Example Login API

```
POST /auth/login-json
```

Request

```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

Response

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer"
}
```

Store both tokens securely on successful login.

---

# Notes for Frontend Team

- Use the Access Token for authenticated requests.
- Include the token in the Authorization header:

```
Authorization: Bearer <ACCESS_TOKEN>
```

- If the Access Token expires, call the Refresh Token API.
- Use the Forgot Password API to send reset emails.
- Use the Reset Password API with the reset token received via email.

---

# Authentication Features

- User Registration
- User Login
- JWT Authentication
- Refresh Token Support
- User Profile
- Secure Logout
- Change Password
- Forgot Password
- Reset Password
- Password Hashing (bcrypt)
- Email-based Password Recovery

---

**Backend Module:** Authentication Service

**Framework:** FastAPI

**Authentication:** JWT (Access Token & Refresh Token)

**Password Hashing:** bcrypt

**Database:** SQLAlchemy ORM

**Email Service:** SMTP
