"""
Watchlist endpoints.
Track employees of concern for managers and admins.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from app.models.schemas import WatchlistItemCreate, WatchlistItemResponse
from supabase import Client

router = APIRouter(prefix="/api/watchlist", tags=["watchlist"])


@router.get("/", response_model=List[WatchlistItemResponse])
async def list_watchlist(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> List[WatchlistItemResponse]:
    """Get watchlist items for the current user."""
    try:
        response = supabase.table("watchlist").select("*").eq("user_id", current_user.id).execute()

        return [WatchlistItemResponse(**item) for item in response.data]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/", response_model=WatchlistItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_watchlist(
    item: WatchlistItemCreate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> WatchlistItemResponse:
    """Add an employee to the user's watchlist."""
    try:
        # Verify employee belongs to user's org
        emp_response = supabase.table("employees").select("id").eq("id", str(item.employee_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not emp_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        data = {
            "user_id": current_user.id,
            "employee_id": str(item.employee_id),
            "reason": item.reason,
        }

        response = supabase.table("watchlist").insert(data).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to add to watchlist",
            )

        return WatchlistItemResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.delete("/{watchlist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_watchlist(
    watchlist_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> None:
    """Remove an item from the user's watchlist."""
    try:
        # Verify watchlist item belongs to current user
        check_response = supabase.table("watchlist").select("id").eq("id", str(watchlist_id)).eq(
            "user_id", current_user.id
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Watchlist item not found",
            )

        supabase.table("watchlist").delete().eq("id", str(watchlist_id)).execute()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
