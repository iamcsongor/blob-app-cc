"""
Employee management endpoints.
CRUD operations and score/metric retrieval scoped to user's organisation.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from app.models.schemas import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse,
    BlobScoreResponse,
    MetricScoreResponse,
)
from supabase import Client

router = APIRouter(prefix="/api/employees", tags=["employees"])


@router.get("/", response_model=List[EmployeeResponse])
async def list_employees(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
    department_id: Optional[UUID] = Query(None, description="Filter by department"),
    status: Optional[str] = Query(None, description="Filter by status (active, inactive, on_leave)"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level (low, medium, high)"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    sort_by: Optional[str] = Query("created_at", description="Sort field"),
    limit: int = Query(50, ge=1, le=500, description="Results limit"),
    offset: int = Query(0, ge=0, description="Results offset"),
) -> List[EmployeeResponse]:
    """
    List employees for the current user's organisation.
    Supports filtering, searching, and sorting.
    """
    try:
        query = supabase.table("employees").select("*").eq("org_id", str(current_user.org_id))

        if department_id:
            query = query.eq("department_id", str(department_id))

        if status:
            query = query.eq("status", status)

        if search:
            query = query.or_(f"first_name.ilike.%{search}%,last_name.ilike.%{search}%,email.ilike.%{search}%")

        query = query.order(sort_by, desc=False).range(offset, offset + limit - 1)

        response = query.execute()

        return [EmployeeResponse(**employee) for employee in response.data]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> EmployeeResponse:
    """Get a single employee with current score and metrics."""
    try:
        response = supabase.table("employees").select("*").eq("id", str(employee_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        return EmployeeResponse(**response.data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee: EmployeeCreate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> EmployeeResponse:
    """Create a new employee in the organisation."""
    try:
        data = employee.model_dump()
        data["org_id"] = str(current_user.org_id)

        response = supabase.table("employees").insert(data).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create employee",
            )

        return EmployeeResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: UUID,
    employee_update: EmployeeUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> EmployeeResponse:
    """Update an employee's information."""
    try:
        # Verify employee belongs to user's org
        check_response = supabase.table("employees").select("id").eq("id", str(employee_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        # Update only provided fields
        data = employee_update.model_dump(exclude_unset=True)
        response = supabase.table("employees").update(data).eq("id", str(employee_id)).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update employee",
            )

        return EmployeeResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> None:
    """Delete an employee from the organisation."""
    try:
        # Verify employee belongs to user's org
        check_response = supabase.table("employees").select("id").eq("id", str(employee_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        supabase.table("employees").delete().eq("id", str(employee_id)).execute()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/{employee_id}/scores", response_model=List[BlobScoreResponse])
async def get_employee_scores(
    employee_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
    start_date: Optional[datetime] = Query(None, description="Start date for score history"),
    end_date: Optional[datetime] = Query(None, description="End date for score history"),
) -> List[BlobScoreResponse]:
    """Get score history for an employee."""
    try:
        # Verify employee belongs to user's org
        check_response = supabase.table("employees").select("id").eq("id", str(employee_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        query = supabase.table("scores").select("*").eq("employee_id", str(employee_id))

        if start_date:
            query = query.gte("computed_at", start_date.isoformat())

        if end_date:
            query = query.lte("computed_at", end_date.isoformat())

        query = query.order("computed_at", desc=True)

        response = query.execute()

        return [BlobScoreResponse(**score) for score in response.data]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/{employee_id}/metrics", response_model=List[MetricScoreResponse])
async def get_employee_metrics(
    employee_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> List[MetricScoreResponse]:
    """Get current metric scores for an employee."""
    try:
        # Verify employee belongs to user's org
        check_response = supabase.table("employees").select("id").eq("id", str(employee_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        response = supabase.table("metrics").select("*").eq("employee_id", str(employee_id)).eq(
            "is_current", True
        ).order("category").execute()

        return [MetricScoreResponse(**metric) for metric in response.data]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
