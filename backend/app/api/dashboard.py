"""
Dashboard endpoints.
Aggregated metrics and visualisations for company-level insights.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime

from app.core.auth import CurrentUser, get_current_user
from app.core.supabase import get_supabase_client
from supabase import Client

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=dict)
async def get_dashboard_summary(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> dict:
    """
    Get company-level summary statistics.
    Includes total employees, at-risk count, average score, and department breakdown.
    """
    try:
        # Get total employees
        emp_response = supabase.table("employees").select("id", count="exact").eq(
            "org_id", str(current_user.org_id)
        ).eq("status", "active").execute()

        total_employees = emp_response.count or 0

        # Get at-risk count (score < 40)
        at_risk_response = supabase.rpc("get_at_risk_count", {
            "org_id": str(current_user.org_id),
            "threshold": 40.0
        }).execute()

        at_risk_count = at_risk_response.data or 0

        # Get average score
        avg_score_response = supabase.rpc("get_org_avg_score", {
            "org_id": str(current_user.org_id)
        }).execute()

        avg_score = avg_score_response.data or 0.0

        # Get department breakdown
        dept_response = supabase.table("departments").select("id, name").eq(
            "org_id", str(current_user.org_id)
        ).execute()

        departments = []
        for dept in dept_response.data:
            dept_emp_response = supabase.table("employees").select("id", count="exact").eq(
                "department_id", str(dept["id"])
            ).execute()

            departments.append({
                "id": dept["id"],
                "name": dept["name"],
                "employee_count": dept_emp_response.count or 0,
            })

        return {
            "total_employees": total_employees,
            "at_risk_count": at_risk_count,
            "average_score": avg_score,
            "at_risk_percentage": (at_risk_count / total_employees * 100) if total_employees > 0 else 0,
            "departments": departments,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/scatter", response_model=List[dict])
async def get_scatter_plot_data(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> List[dict]:
    """
    Get data for Hero Matrix scatter plot.
    Returns list of employees with score, trend, and department for positioning.
    """
    try:
        # Get employees with current scores
        response = supabase.table("employees").select(
            "id, first_name, last_name, score, trend, department_id, departments(name)"
        ).eq("org_id", str(current_user.org_id)).eq("status", "active").execute()

        employees = []
        for emp in response.data:
            employees.append({
                "id": emp["id"],
                "name": f"{emp['first_name']} {emp['last_name']}",
                "score": emp.get("score") or 50.0,
                "trend": emp.get("trend") or "stable",
                "department": emp["departments"].get("name") if emp.get("departments") else "Unassigned",
            })

        return employees

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/timeline", response_model=dict)
async def get_company_timeline(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
    days: int = 30,
) -> dict:
    """
    Get company score history with event markers.
    Returns timeline of average org scores and significant events.
    """
    try:
        # Get historical scores (implementation depends on how scores are stored)
        history_response = supabase.rpc("get_org_score_history", {
            "org_id": str(current_user.org_id),
            "days": days
        }).execute()

        scores = history_response.data or []

        # Get significant events
        events_response = supabase.table("feed_events").select("*").eq(
            "org_id", str(current_user.org_id)
        ).eq("scope", "organisation").order("created_at", desc=True).limit(10).execute()

        events = [
            {
                "date": event["created_at"],
                "title": event["title"],
                "type": event["event_type"],
            }
            for event in events_response.data
        ]

        return {
            "scores": scores,
            "events": events,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/departments", response_model=List[dict])
async def get_departments_table(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client),
) -> List[dict]:
    """
    Get department table data.
    Includes name, at-risk count, average score, dominant metric, and change trend.
    """
    try:
        dept_response = supabase.table("departments").select("*").eq(
            "org_id", str(current_user.org_id)
        ).execute()

        departments = []

        for dept in dept_response.data:
            # Get at-risk employees in department
            at_risk_response = supabase.rpc("get_dept_at_risk_count", {
                "dept_id": str(dept["id"]),
                "threshold": 40.0
            }).execute()

            at_risk_count = at_risk_response.data or 0

            # Get avg score
            avg_score_response = supabase.rpc("get_department_avg_score", {
                "dept_id": str(dept["id"])
            }).execute()

            avg_score = avg_score_response.data or 0.0

            # Get dominant metric
            metrics_response = supabase.rpc("get_dept_dominant_metric", {
                "dept_id": str(dept["id"])
            }).execute()

            dominant_metric = metrics_response.data or "engagement"

            departments.append({
                "id": dept["id"],
                "name": dept["name"],
                "at_risk_count": at_risk_count,
                "average_score": avg_score,
                "dominant_metric": dominant_metric,
                "change": "stable",  # Would be calculated from historical data
            })

        return departments

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
