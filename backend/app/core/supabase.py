"""
Supabase client management.
Provides singleton instance for backend operations and user-scoped clients.
"""

from supabase import create_client, Client
from .config import settings


class SupabaseManager:
    """Manages Supabase client instances."""

    _instance: Client = None

    @classmethod
    def get_client(cls) -> Client:
        """
        Get or create the Supabase client (backend service account).
        Uses service key for privileged operations.

        Returns:
            Client: Supabase client instance
        """
        if cls._instance is None:
            cls._instance = create_client(
                supabase_url=settings.SUPABASE_URL,
                supabase_key=settings.SUPABASE_SERVICE_KEY,
            )
        return cls._instance

    @classmethod
    def get_user_client(cls, user_jwt: str) -> Client:
        """
        Create a user-scoped Supabase client for row-level security.
        Uses the user's JWT token instead of service key.

        Args:
            user_jwt: User's JWT token from Supabase auth

        Returns:
            Client: User-scoped Supabase client instance
        """
        return create_client(
            supabase_url=settings.SUPABASE_URL,
            supabase_key=settings.SUPABASE_ANON_KEY,
        ).auth.set_session(user_jwt)


def get_supabase_client() -> Client:
    """
    FastAPI dependency for getting the Supabase backend client.

    Returns:
        Client: Supabase client instance
    """
    return SupabaseManager.get_client()
