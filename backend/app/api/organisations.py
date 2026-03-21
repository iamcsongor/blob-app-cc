"""
Organisation management endpoints.
Retrieve and update organisation settings and logo.
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from uuid import UUID

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from app.models.schemas import OrganisationResponse, CompanySettingsUpdate
from supabase import Client

router = APIRouter(prefix="/api/organisation", tags=["organisation"])


@router.get("/", response_model=OrganisationResponse)
async def get_organisation(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> OrganisationResponse:
    """Get current user's organisation details."""
    try:
        response = supabase.table("organisations").select("*").eq("id", str(current_user.org_id)).single().execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organisation not found",
            )

        return OrganisationResponse(**response.data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.put("/", response_model=OrganisationResponse)
async def update_organisation(
    settings: CompanySettingsUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> OrganisationResponse:
    """Update organisation settings (name, timezone, currency)."""
    try:
        # Only organisation owner/admin can update
        data = settings.model_dump(exclude_unset=True)

        response = supabase.table("organisations").update(data).eq("id", str(current_user.org_id)).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update organisation",
            )

        return OrganisationResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/logo", response_model=OrganisationResponse)
async def upload_logo(
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> OrganisationResponse:
    """Upload organisation logo to Supabase Storage."""
    try:
        # Validate file is an image
        allowed_types = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Allowed: JPEG, PNG, WebP, SVG",
            )

        # Read file content
        file_content = await file.read()

        # Upload to Supabase Storage
        file_path = f"logos/{current_user.org_id}/{file.filename}"
        supabase.storage.from_("organisation-assets").upload(file_path, file_content, {
            "content-type": file.content_type
        })

        # Get public URL
        public_url = supabase.storage.from_("organisation-assets").get_public_url(file_path)

        # Update organisation with logo URL
        response = supabase.table("organisations").update({
            "logo_url": public_url
        }).eq("id", str(current_user.org_id)).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update logo",
            )

        return OrganisationResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload error: {str(e)}",
        )
