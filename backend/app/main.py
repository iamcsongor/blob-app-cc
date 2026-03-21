"""
FastAPI application factory and configuration.
Sets up CORS, includes all routers, and defines health check endpoints.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import employees, organisations, departments, programs, trophies, feed, notifications, watchlist, tools, dashboard

# Create FastAPI instance
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered early-warning system for employee productivity and burnout",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router)
app.include_router(organisations.router)
app.include_router(departments.router)
app.include_router(programs.router)
app.include_router(trophies.router)
app.include_router(feed.router)
app.include_router(notifications.router)
app.include_router(watchlist.router)
app.include_router(tools.router)
app.include_router(dashboard.router)


@app.get("/")
async def root() -> dict:
    """Root endpoint."""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/api/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
