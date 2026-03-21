"""
Notification endpoints.
User notifications for alerts, updates, and actions.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from app.models.schemas import NotificationResponse
from supabase import Client

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/", response_model=List[NotificationResponse])
async def list_notifications(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
    read: Optional[bool] = Query(None, description="Filter by read status"),
    notification_type: Optional[str] = Query(None, description="Filter by type (alert, info, warning)"),
    limit: int = Query(50, ge=1, le=500, description="Results limit"),
    offset: int = Query(0, ge=0, description="Results offset"),
) -> List[NotificationResponse]:
    """
    List notifications for the current user.
    Supports filtering by read status and type.
    """
    try:
        query = supabase.table("notifications").select("*").eq("user_id", current_user.id)

        if read is not None:
            query = query.eq("is_read", read)

        if notification_type:
            query = query.eq("notification_type", notification_type)

        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)

        response = query.execute()

        return [NotificationResponse(**notif) for notif in response.data]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> NotificationResponse:
    """Mark a notification as read."""
    try:
        # Verify notification belongs to current user
        check_response = supabase.table("notifications").select("id").eq("id", notification_id).eq(
            "user_id", current_user.id
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found",
            )

        response = supabase.table("notifications").update({"is_read": True}).eq("id", notification_id).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update notification",
            )

        return NotificationResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.put("/read-all", status_code=status.HTTP_204_NO_CONTENT)
async def mark_all_read(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> None:
    """Mark all notifications as read for current user."""
    try:
        supabase.table("notifications").update({"is_read": True}).eq("user_id", current_user.id).eq(
            "is_read", False
        ).execute()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/count", response_model=dict)
async def get_unread_count(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> dict:
    """Get count of unread notifications for current user."""
    try:
        response = supabase.table("notifications").select("id", count="exact").eq(
            "user_id", current_user.id
        ).eq("is_read", False).execute()

        return {"unread_count": response.count or 0}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
