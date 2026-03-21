"""
Authentication and authorization utilities.
Provides JWT verification and current user dependency.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional
from jose import jwt, JWTError
from .config import settings
from .supabase import SupabaseManager

security = HTTPBearer()


class CurrentUser(BaseModel):
    """Current authenticated user information."""

    id: str = Field(..., description="User ID from Supabase")
    email: str = Field(..., description="User email")
    org_id: str = Field(..., description="Organisation ID")
    role: str = Field(..., description="User role (owner, admin, manager, viewer)")
    name: Optional[str] = Field(None, description="User full name")


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> CurrentUser:
    """
    Extract and verify JWT token from Authorization header.
    Returns current user information from the JWT claims.

    Args:
        credentials: Bearer token from Authorization header

    Returns:
        CurrentUser: Current authenticated user

    Raises:
        HTTPException: 401 if token is invalid or missing required claims
    """
    token = credentials.credentials

    try:
        # Verify token with Supabase
        client = SupabaseManager.get_client()
        user = client.auth.get_user(token)

        # Extract user metadata
        user_id = user.user.id
        email = user.user.email

        # Get custom claims from JWT
        decoded = jwt.get_unverified_claims(token)

        org_id = decoded.get("org_id")
        role = decoded.get("role", "viewer")
        name = decoded.get("name")

        if not org_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing org_id in token",
            )

        return CurrentUser(
            id=user_id,
            email=email,
            org_id=org_id,
            role=role,
            name=name,
        )

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
        ) from e
