"""
Connected tools endpoints.
Integration with Slack, Jira, Asana, and other platforms.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from uuid import UUID

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from app.models.schemas import ConnectedToolResponse, ConnectedToolUpdate
from supabase import Client

router = APIRouter(prefix="/api/tools", tags=["tools"])


@router.get("/", response_model=List[ConnectedToolResponse])
async def list_connected_tools(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> List[ConnectedToolResponse]:
    """List all connected tools for the organisation."""
    try:
        response = supabase.table("connected_tools").select("*").eq("org_id", str(current_user.org_id)).execute()

        # Don't return encrypted tokens
        tools = []
        for tool in response.data:
            tool.pop("access_token_encrypted", None)
            tools.append(ConnectedToolResponse(**tool))

        return tools

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.put("/{tool_name}", response_model=ConnectedToolResponse)
async def update_tool_connection(
    tool_name: str,
    update: ConnectedToolUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> ConnectedToolResponse:
    """Update tool connection status."""
    try:
        # Check if tool exists
        check_response = supabase.table("connected_tools").select("id").eq("tool_name", tool_name).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tool connection not found",
            )

        response = supabase.table("connected_tools").update({
            "is_connected": update.is_connected
        }).eq("tool_name", tool_name).eq("org_id", str(current_user.org_id)).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update tool connection",
            )

        tool = response.data[0]
        tool.pop("access_token_encrypted", None)

        return ConnectedToolResponse(**tool)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/{tool_name}/connect", response_model=dict)
async def initiate_oauth(
    tool_name: str,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> dict:
    """
    Initiate OAuth flow for connecting a tool.
    Returns the OAuth authorization URL.
    """
    try:
        # Define OAuth endpoints (stub - actual URLs would come from config)
        oauth_urls = {
            "slack": "https://slack.com/oauth/v2/authorize?client_id=YOUR_CLIENT_ID&scope=chat:write,users:read&redirect_uri=YOUR_CALLBACK_URL",
            "jira": "https://auth.atlassian.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_CALLBACK_URL",
            "asana": "https://app.asana.com/-/oauth_authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_CALLBACK_URL",
        }

        if tool_name not in oauth_urls:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unknown tool: {tool_name}",
            )

        # Store OAuth state in DB for verification
        state = f"{current_user.org_id}_{tool_name}_{current_user.id}"

        return {
            "authorization_url": oauth_urls[tool_name],
            "state": state,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth error: {str(e)}",
        )


@router.get("/{tool_name}/callback")
async def oauth_callback(
    tool_name: str,
    code: str = Query(..., description="OAuth authorization code"),
    state: str = Query(..., description="OAuth state parameter"),
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> dict:
    """
    OAuth callback handler.
    Exchanges authorization code for access token.
    """
    try:
        # Verify state matches expected format
        expected_state_prefix = f"{current_user.org_id}_{tool_name}"
        if not state.startswith(expected_state_prefix):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid state parameter",
            )

        # Exchange code for token (stub - actual implementation would make HTTP request)
        # In production, this would call the tool's OAuth token endpoint
        access_token = f"token_for_{tool_name}_{code}"

        # Store encrypted token in DB
        data = {
            "org_id": str(current_user.org_id),
            "tool_name": tool_name,
            "is_connected": True,
            "access_token_encrypted": access_token,  # Should be encrypted in production
        }

        # Upsert connection
        response = supabase.table("connected_tools").upsert(data).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to save connection",
            )

        return {
            "status": "connected",
            "tool": tool_name,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth callback error: {str(e)}",
        )
