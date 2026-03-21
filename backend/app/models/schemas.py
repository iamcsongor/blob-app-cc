"""
Pydantic models for API request/response schemas.
All response models include id and created_at fields.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# Organisation schemas
class OrganisationBase(BaseModel):
    """Base organisation model."""
    name: str = Field(..., description="Organisation name")
    timezone: Optional[str] = Field(None, description="Timezone (e.g., UTC, US/Eastern)")
    currency: Optional[str] = Field(None, description="Currency code (e.g., USD, EUR)")
    logo_url: Optional[str] = Field(None, description="URL to organisation logo")


class OrganisationCreate(OrganisationBase):
    """Create organisation request."""
    pass


class OrganisationResponse(OrganisationBase):
    """Organisation response."""
    id: UUID = Field(..., description="Organisation ID")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        from_attributes = True


# Department schemas
class DepartmentBase(BaseModel):
    """Base department model."""
    name: str = Field(..., description="Department name")
    description: Optional[str] = Field(None, description="Department description")


class DepartmentCreate(DepartmentBase):
    """Create department request."""
    pass


class DepartmentResponse(DepartmentBase):
    """Department response with metrics."""
    id: UUID = Field(..., description="Department ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    employee_count: Optional[int] = Field(None, description="Number of employees")
    avg_score: Optional[float] = Field(None, description="Average employee score")

    class Config:
        from_attributes = True


# Score and metric schemas
class BlobScoreResponse(BaseModel):
    """Blob (overall productivity) score response."""
    score: float = Field(..., ge=0, le=100, description="Score 0-100")
    grade: str = Field(..., description="Grade (A, B, C, D, F)")
    confidence: float = Field(..., ge=0, le=1, description="Confidence 0-1")
    computed_at: datetime = Field(..., description="Computation timestamp")


class MetricScoreResponse(BaseModel):
    """Individual metric score response."""
    category: str = Field(..., description="Metric category (e.g., engagement, focus)")
    value: float = Field(..., ge=0, le=100, description="Score 0-100")
    trend: Optional[str] = Field(None, description="Trend (up, down, stable)")
    computed_at: datetime = Field(..., description="Computation timestamp")


# Employee schemas
class EmployeeBase(BaseModel):
    """Base employee model."""
    first_name: str = Field(..., description="First name")
    last_name: str = Field(..., description="Last name")
    email: str = Field(..., description="Email address")
    department_id: Optional[UUID] = Field(None, description="Department ID")
    role: Optional[str] = Field(None, description="Job role")
    status: Optional[str] = Field("active", description="Employment status (active, inactive, on_leave)")


class EmployeeCreate(EmployeeBase):
    """Create employee request."""
    pass


class EmployeeUpdate(BaseModel):
    """Update employee request."""
    first_name: Optional[str] = Field(None, description="First name")
    last_name: Optional[str] = Field(None, description="Last name")
    email: Optional[str] = Field(None, description="Email address")
    department_id: Optional[UUID] = Field(None, description="Department ID")
    role: Optional[str] = Field(None, description="Job role")
    status: Optional[str] = Field(None, description="Employment status")


class EmployeeResponse(EmployeeBase):
    """Employee response with current metrics."""
    id: UUID = Field(..., description="Employee ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    score: Optional[float] = Field(None, description="Current Blob score")
    grade: Optional[str] = Field(None, description="Current grade")
    trend: Optional[str] = Field(None, description="Score trend (up, down, stable)")

    class Config:
        from_attributes = True


# Program schemas
class ProgramBase(BaseModel):
    """Base program model."""
    name: str = Field(..., description="Program name")
    description: Optional[str] = Field(None, description="Program description")
    program_type: str = Field(..., description="Type (training, intervention, development)")
    status: Optional[str] = Field("active", description="Status (active, paused, completed)")


class ProgramCreate(ProgramBase):
    """Create program request."""
    pass


class ProgramResponse(ProgramBase):
    """Program response with enrolment info."""
    id: UUID = Field(..., description="Program ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    enrolment_count: Optional[int] = Field(None, description="Number of enrolled employees")
    progress: Optional[float] = Field(None, ge=0, le=100, description="Average progress %")

    class Config:
        from_attributes = True


class ProgramEnrolmentCreate(BaseModel):
    """Enrol employee in program request."""
    employee_id: UUID = Field(..., description="Employee ID")


class ProgramEnrolmentResponse(BaseModel):
    """Program enrolment response."""
    id: UUID = Field(..., description="Enrolment ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    program_id: UUID = Field(..., description="Program ID")
    employee_id: UUID = Field(..., description="Employee ID")
    status: str = Field(..., description="Enrolment status (enrolled, completed, dropped)")
    progress: float = Field(..., ge=0, le=100, description="Progress percentage")

    class Config:
        from_attributes = True


# Trophy schemas
class TrophyBase(BaseModel):
    """Base trophy type model."""
    name: str = Field(..., description="Trophy name")
    description: Optional[str] = Field(None, description="Trophy description")
    icon_url: Optional[str] = Field(None, description="Icon URL")
    category: Optional[str] = Field(None, description="Trophy category (e.g., achievement, milestone)")


class TrophyCreate(TrophyBase):
    """Create trophy type request."""
    pass


class TrophyResponse(TrophyBase):
    """Trophy type response."""
    id: UUID = Field(..., description="Trophy ID")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        from_attributes = True


class TrophyAwardCreate(BaseModel):
    """Award trophy to employee request."""
    employee_id: UUID = Field(..., description="Employee ID")
    trophy_id: UUID = Field(..., description="Trophy ID")
    reason: Optional[str] = Field(None, description="Reason for award")


class TrophyAwardResponse(BaseModel):
    """Trophy award response."""
    id: UUID = Field(..., description="Award ID")
    created_at: datetime = Field(..., description="Award timestamp")
    employee_id: UUID = Field(..., description="Employee ID")
    trophy_id: UUID = Field(..., description="Trophy ID")
    reason: Optional[str] = Field(None, description="Reason for award")

    class Config:
        from_attributes = True


# Feed event schema
class FeedEventResponse(BaseModel):
    """Feed event response."""
    id: UUID = Field(..., description="Event ID")
    created_at: datetime = Field(..., description="Event timestamp")
    event_type: str = Field(..., description="Event type (alert, milestone, award, change)")
    scope: str = Field(..., description="Scope (employee, department, organisation)")
    title: str = Field(..., description="Event title")
    description: Optional[str] = Field(None, description="Event description")
    entity_id: Optional[UUID] = Field(None, description="Related entity ID")
    tags: List[str] = Field(default_factory=list, description="Event tags")

    class Config:
        from_attributes = True


# Connected tools schema
class ConnectedToolResponse(BaseModel):
    """Connected tool response."""
    id: UUID = Field(..., description="Connection ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    tool_name: str = Field(..., description="Tool name (slack, jira, asana, etc)")
    is_connected: bool = Field(..., description="Connection status")
    last_synced: Optional[datetime] = Field(None, description="Last sync timestamp")
    access_token_encrypted: Optional[str] = Field(None, description="Encrypted access token (not returned in responses)")

    class Config:
        from_attributes = True


class ConnectedToolUpdate(BaseModel):
    """Update connected tool request."""
    is_connected: bool = Field(..., description="Connection status")


# Notification schema
class NotificationResponse(BaseModel):
    """Notification response."""
    id: UUID = Field(..., description="Notification ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    notification_type: str = Field(..., description="Type (alert, info, warning)")
    title: str = Field(..., description="Notification title")
    message: str = Field(..., description="Notification message")
    is_read: bool = Field(..., description="Read status")
    related_entity_id: Optional[UUID] = Field(None, description="Related entity ID")
    action_url: Optional[str] = Field(None, description="URL for action")

    class Config:
        from_attributes = True


# Watchlist schema
class WatchlistItemCreate(BaseModel):
    """Add item to watchlist request."""
    employee_id: UUID = Field(..., description="Employee ID")
    reason: Optional[str] = Field(None, description="Reason for watchlist")


class WatchlistItemResponse(BaseModel):
    """Watchlist item response."""
    id: UUID = Field(..., description="Watchlist ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    employee_id: UUID = Field(..., description="Employee ID")
    reason: Optional[str] = Field(None, description="Reason for watchlist")

    class Config:
        from_attributes = True


# Company settings schema
class CompanySettingsUpdate(BaseModel):
    """Update company settings request."""
    name: Optional[str] = Field(None, description="Company name")
    timezone: Optional[str] = Field(None, description="Timezone")
    currency: Optional[str] = Field(None, description="Currency code")
    logo_url: Optional[str] = Field(None, description="Logo URL")
