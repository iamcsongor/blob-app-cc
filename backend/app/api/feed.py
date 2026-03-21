"""
Activity feed endpoints.
Lists events, alerts, milestones, and awards.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from uuid import UUID

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from app.models.schemas import FeedEventResponse
from supabase import Client

router = APIRouter(prefix="/api/feed", tags=["feed"])


@router.get("/", response_model=List[FeedEventResponse])
async def list_feed_events(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
    event_type: Optional[str] = Query(None, description="Filter by event type (alert, milestone, award, change)"),
    scope: Optional[str] = Query(None, description="Filter by scope (employee, department, organisation)"),
    search: Optional[str] = Query(None, description="Search in title/description"),
    limit: int = Query(50, ge=1, le=500, description="Results limit"),
    offset: int = Query(0, ge=0, description="Results offset"),
) -> List[FeedEventResponse]:
    """
    List feed events for the organisation.
    Supports filtering by type, scope, and text search.
    """
    try:
        query = supabase.table("feed_events").select("*").eq("org_id", str(current_user.org_id))

        if event_type:
            query = query.eq("event_type", event_type)

        if scope:
            query = query.eq("scope", scope)

        if search:
            query = query.or_(f"title.ilike.%{search}%,description.ilike.%{search}%")

        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)

        response = query.execute()

        events = []
        for event in response.data:
            # Parse tags from JSON if stored as JSON string
            if isinstance(event.get("tags"), str):
                import json
                try:
                    event["tags"] = json.loads(event["tags"])
                except (json.JSONDecodeError, TypeError):
                    event["tags"] = []
            else:
                event["tags"] = event.get("tags") or []

            events.append(FeedEventResponse(**event))

        return events

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
