from supabase import create_client, Client
from config import settings
import logging

logger = logging.getLogger(__name__)

class SupabaseClient:
    _instance: Client = None
    
    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
                logger.warning('Supabase credentials not configured')
                return None
            
            cls._instance = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_ANON_KEY
            )
            logger.info('Supabase client initialized')
        
        return cls._instance
    
    @classmethod
    def get_admin_client(cls) -> Client:
        """Client with service role key for admin operations"""
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
            logger.warning('Supabase service key not configured')
            return None
            
        return create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )

# Helper function
def get_db() -> Client:
    return SupabaseClient.get_client()
