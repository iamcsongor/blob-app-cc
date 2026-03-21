"""
Program management endpoints.
Training/intervention programs and employee enrolments.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from uuid import UUID

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from app.models.schemas import (
    ProgramCreate,
    ProgramResponse,
    ProgramEnrolmentCreate,
    ProgramEnrolmentResponse,
)
from supabase import Client

router = APIRouter(prefix="/api/programs", tags=["programs"])


@router.get("/", response_model=List[ProgramResponse])
async def list_programs(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
    limit: int = Query(50, ge=1, le=500, description="Results limit"),
    offset: int = Query(0, ge=0, description="Results offset"),
) -> List[ProgramResponse]:
    """List programs for the organisation with enrolment counts."""
    try:
        response = supabase.table("programs").select("*").eq("org_id", str(current_user.org_id)).range(
            offset, offset + limit - 1
        ).execute()

        programs = []
        for program in response.data:
            # Get enrolment count
            enrol_response = supabase.table("program_enrolments").select("id", count="exact").eq(
                "program_id", str(program["id"])
            ).execute()

            program["enrolment_count"] = enrol_response.count
            program["progress"] = 0.0  # Would be calculated from actual enrolment progress

            programs.append(ProgramResponse(**program))

        return programs

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/{program_id}", response_model=ProgramResponse)
async def get_program(
    program_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> ProgramResponse:
    """Get program detail with enrolled employees."""
    try:
        response = supabase.table("programs").select("*").eq("id", str(program_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Program not found",
            )

        program = response.data

        # Get enrolment count
        enrol_response = supabase.table("program_enrolments").select("id", count="exact").eq(
            "program_id", str(program_id)
        ).execute()

        program["enrolment_count"] = enrol_response.count
        program["progress"] = 0.0

        return ProgramResponse(**program)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/", response_model=ProgramResponse, status_code=status.HTTP_201_CREATED)
async def create_program(
    program: ProgramCreate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> ProgramResponse:
    """Create a new program."""
    try:
        data = program.model_dump()
        data["org_id"] = str(current_user.org_id)

        response = supabase.table("programs").insert(data).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create program",
            )

        prog = response.data[0]
        prog["enrolment_count"] = 0
        prog["progress"] = 0.0

        return ProgramResponse(**prog)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.put("/{program_id}", response_model=ProgramResponse)
async def update_program(
    program_id: UUID,
    program: ProgramCreate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> ProgramResponse:
    """Update a program."""
    try:
        # Verify program belongs to user's org
        check_response = supabase.table("programs").select("id").eq("id", str(program_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Program not found",
            )

        data = program.model_dump()
        response = supabase.table("programs").update(data).eq("id", str(program_id)).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update program",
            )

        prog = response.data[0]

        # Get enrolment count
        enrol_response = supabase.table("program_enrolments").select("id", count="exact").eq(
            "program_id", str(program_id)
        ).execute()

        prog["enrolment_count"] = enrol_response.count
        prog["progress"] = 0.0

        return ProgramResponse(**prog)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/{program_id}/enrol", response_model=ProgramEnrolmentResponse, status_code=status.HTTP_201_CREATED)
async def enrol_employee(
    program_id: UUID,
    enrolment: ProgramEnrolmentCreate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> ProgramEnrolmentResponse:
    """Enrol an employee in a program."""
    try:
        # Verify program belongs to user's org
        prog_response = supabase.table("programs").select("id").eq("id", str(program_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not prog_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Program not found",
            )

        # Verify employee belongs to user's org
        emp_response = supabase.table("employees").select("id").eq("id", str(enrolment.employee_id)).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not emp_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        data = {
            "program_id": str(program_id),
            "employee_id": str(enrolment.employee_id),
            "status": "enrolled",
            "progress": 0.0,
        }

        response = supabase.table("program_enrolments").insert(data).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to enrol employee",
            )

        return ProgramEnrolmentResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.put("/enrolments/{enrolment_id}", response_model=ProgramEnrolmentResponse)
async def update_enrolment(
    enrolment_id: UUID,
    status: str = Query(..., description="Enrolment status (enrolled, completed, dropped)"),
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> ProgramEnrolmentResponse:
    """Update enrolment status."""
    try:
        # Verify enrolment's program belongs to user's org
        enrol_response = supabase.table("program_enrolments").select("program_id").eq(
            "id", str(enrolment_id)
        ).single().execute()

        if not enrol_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Enrolment not found",
            )

        # Verify program belongs to org
        prog_check = supabase.table("programs").select("id").eq("id", str(enrol_response.data["program_id"])).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not prog_check.data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized",
            )

        response = supabase.table("program_enrolments").update({"status": status}).eq(
            "id", str(enrolment_id)
        ).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update enrolment",
            )

        return ProgramEnrolmentResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/milestones/{enrolment_id}/complete", status_code=status.HTTP_204_NO_CONTENT)
async def complete_milestone(
    enrolment_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> None:
    """Mark a milestone as complete for an enrolment."""
    try:
        # Verify enrolment's program belongs to user's org
        enrol_response = supabase.table("program_enrolments").select("program_id").eq(
            "id", str(enrolment_id)
        ).single().execute()

        if not enrol_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Enrolment not found",
            )

        # Verify program belongs to org
        prog_check = supabase.table("programs").select("id").eq("id", str(enrol_response.data["program_id"])).eq(
            "org_id", str(current_user.org_id)
        ).single().execute()

        if not prog_check.data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized",
            )

        # Update milestone completion (implementation depends on schema)
        supabase.table("program_enrolments").update({"progress": 100.0}).eq("id", str(enrolment_id)).execute()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
