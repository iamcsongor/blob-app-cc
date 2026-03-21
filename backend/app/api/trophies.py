"""
Trophy management endpoints.
Achievement badges and awards for employees.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from uuid import UUID

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from app.models.schemas import (
    TrophyCreate,
    TrophyResponse,
    TrophyAwardCreate,
    TrophyAwardResponse,
)
from supabase import Client

router = APIRouter(prefix="/api/trophies", tags=["trophies"])


@router.get("/", response_model=List[TrophyResponse])
async def list_trophies(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> List[TrophyResponse]:
    """List all trophy types for the organisation."""
    try:
        response = supabase.table("trophies").select("*").eq("org_id", str(current_user.org_id)).execute()

        return [TrophyResponse(**trophy) for trophy in response.data]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/", response_model=TrophyResponse, status_code=status.HTTP_201_CREATED)
async def create_trophy(
    trophy: TrophyCreate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> TrophyResponse:
    """Create a new trophy type."""
    try:
        data = trophy.model_dump()
        data["org_id"] = str(current_user.org_id)

        response = supabase.table("trophies").insert(data).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create trophy",
            )

        return TrophyResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/awards", response_model=List[TrophyAwardResponse])
async def list_awards(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
    limit: int = Query(50, ge=1, le=500, description="Results limit"),
    offset: int = Query(0, ge=0, description="Results offset"),
) -> List[TrophyAwardResponse]:
    """List recent trophy awards for the organisation."""
    try:
        # Get awards for org (via trophy org_id)
        response = supabase.table("trophy_awards").select(
            "*, trophies(org_id)"
        ).range(offset, offset + limit - 1).order("created_at", desc=True).execute()

        awards = [award for award in response.data if award["trophies"]["org_id"] == str(current_user.org_id)]

        return [TrophyAwardResponse(**award) for award in awards]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/awards", response_model=TrophyAwardResponse, status_code=status.HTTP_201_CREATED)
async def award_trophy(
    award: TrophyAwardCreate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> TrophyAwardResponse:
    """Award a trophy to an employee."""
    try:
        # Verify trophy belongs to user's org
        trophy_response = supabase.table("trophies").select("id").eq("id", str(award.trophy_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not trophy_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trophy not found",
            )

        # Verify employee belongs to user's org
        emp_response = supabase.table("employees").select("id").eq("id", str(award.employee_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not emp_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        data = award.model_dump()

        response = supabase.table("trophy_awards").insert(data).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to award trophy",
            )

        return TrophyAwardResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/leaderboard", response_model=List[dict])
async def get_leaderboard(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
    limit: int = Query(10, ge=1, le=100, description="Top N recipients"),
) -> List[dict]:
    """Get top trophy recipients in the organisation."""
    try:
        # Get trophy counts per employee
        response = supabase.rpc("get_trophy_leaderboard", {
            "org_id": str(current_user.org_id),
            "limit": limit
        }).execute()

        return response.data or []

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
