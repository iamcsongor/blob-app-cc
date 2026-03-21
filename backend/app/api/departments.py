"""
Department management endpoints.
CRUD operations and aggregated metrics.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from uuid import UUID

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from app.models.schemas import DepartmentCreate, DepartmentResponse
from supabase import Client

router = APIRouter(prefix="/api/departments", tags=["departments"])


@router.get("/", response_model=List[DepartmentResponse])
async def list_departments(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
    limit: int = Query(50, ge=1, le=500, description="Results limit"),
    offset: int = Query(0, ge=0, description="Results offset"),
) -> List[DepartmentResponse]:
    """
    List departments for the organisation.
    Includes employee count and average score.
    """
    try:
        response = supabase.table("departments").select("*").eq("org_id", str(current_user.org_id)).range(
            offset, offset + limit - 1
        ).execute()

        departments = []
        for dept in response.data:
            # Get employee count
            emp_count_response = supabase.table("employees").select("id", count="exact").eq(
                "department_id", str(dept["id"])
            ).execute()

            # Get average score (from latest scores)
            avg_score_response = supabase.rpc("get_department_avg_score", {
                "dept_id": str(dept["id"])
            }).execute()

            dept["employee_count"] = emp_count_response.count
            dept["avg_score"] = avg_score_response.data if avg_score_response.data else None

            departments.append(DepartmentResponse(**dept))

        return departments

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(
    department: DepartmentCreate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> DepartmentResponse:
    """Create a new department."""
    try:
        data = department.model_dump()
        data["org_id"] = str(current_user.org_id)

        response = supabase.table("departments").insert(data).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create department",
            )

        dept = response.data[0]
        dept["employee_count"] = 0
        dept["avg_score"] = None

        return DepartmentResponse(**dept)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.put("/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: UUID,
    department: DepartmentCreate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> DepartmentResponse:
    """Update a department."""
    try:
        # Verify department belongs to user's org
        check_response = supabase.table("departments").select("id").eq("id", str(department_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )

        data = department.model_dump()
        response = supabase.table("departments").update(data).eq("id", str(department_id)).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update department",
            )

        dept = response.data[0]

        # Get employee count
        emp_count_response = supabase.table("employees").select("id", count="exact").eq(
            "department_id", str(department_id)
        ).execute()

        dept["employee_count"] = emp_count_response.count

        return DepartmentResponse(**dept)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(
    department_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> None:
    """Delete a department."""
    try:
        # Verify department belongs to user's org
        check_response = supabase.table("departments").select("id").eq("id", str(department_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )

        supabase.table("departments").delete().eq("id", str(department_id)).execute()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
